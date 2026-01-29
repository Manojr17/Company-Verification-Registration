import bcrypt from 'bcrypt';
import { supabase } from '../config/supabaseclient.js';
import { generateJWT } from '../middleware/auth.js';

export const registerUser = async (req, res) => {
  try {
    const {
      email,
      firstName,
      lastName,
      phoneNumber,
      emailVerified = false,
      phoneVerified = false
    } = req.body;

    const { uid: firebaseUid } = req.firebaseUser;

    // Check if user already exists (by email OR firebase_uid)
    const { data: existing, error: existingError } = await supabase
      .from('users')
      .select('id')
      .or(`email.eq.${email},firebase_uid.eq.${firebaseUid}`)
      .limit(1);

    if (existingError) {
      console.error('Supabase select error (existing user):', existingError);
      return res.status(500).json({ error: 'Database error' });
    }

    if (existing && existing.length > 0) {
      return res.status(400).json({
        error: 'User already exists with this email or Firebase UID'
      });
    }

    // Insert new user
    const { data: insertData, error: insertError } = await supabase
      .from('users')
      .insert([{
        firebase_uid: firebaseUid,
        email,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        email_verified: emailVerified,
        phone_verified: phoneVerified
      }])
      .select()
      .limit(1);

    if (insertError) {
      console.error('Supabase insert error (register):', insertError);
      return res.status(500).json({ error: 'Database insert error' });
    }

    const newUser = insertData?.[0];

    // Generate JWT token (assuming generateJWT works with the user row)
    const token = generateJWT(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        phoneNumber: newUser.phone_number,
        emailVerified: newUser.email_verified,
        phoneVerified: newUser.phone_verified,
        createdAt: newUser.created_at
      },
      token
    });
  } catch (error) {
    console.error('User registration error:', error);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { uid: firebaseUid } = req.firebaseUser;

    // Get user from Supabase
    const { data: userData, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('firebase_uid', firebaseUid)
      .limit(1);

    if (selectError) {
      console.error('Supabase select error (login):', selectError);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!userData || userData.length === 0) {
      return res.status(404).json({
        error: 'User not found. Please register first.'
      });
    }

    const user = userData[0];

    // Generate JWT token
    const token = generateJWT(user);

    // Update last login/updated_at (optional)
    const { error: updateError } = await supabase
      .from('users')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (updateError) {
      console.warn('Warning: failed to update last-login time:', updateError);
      // Not fatal — continue
    }

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phoneNumber: user.phone_number,
        emailVerified: user.email_verified,
        phoneVerified: user.phone_verified,
        createdAt: user.created_at
      },
      token
    });
  } catch (error) {
    console.error('User login error:', error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
};
