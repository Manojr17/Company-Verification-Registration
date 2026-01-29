import { supabase } from '../config/supabaseclient.js';

export const registerCompany = async (req, res) => {
  try {
    const {
      companyName,
      companyType,
      industry,
      registrationNumber,
      taxId,
      address,
      city,
      state,
      country,
      postalCode,
      website,
      description,
      logoUrl,
      bannerUrl,
      employeeCount,
      foundedYear
    } = req.body;

    const userId = req.user.id;

    // Check if company profile already exists for this user
    const { data: existingCompany, error: existingError } = await supabase
      .from('company_profiles')
      .select('id')
      .eq('user_id', userId)
      .limit(1);

    if (existingError) {
      console.error('Supabase select error (existing company):', existingError);
      return res.status(500).json({ error: 'Database error' });
    }

    if (existingCompany && existingCompany.length > 0) {
      return res.status(400).json({
        error: 'Company profile already exists for this user'
      });
    }

    // Insert new company profile
    const { data: insertData, error: insertError } = await supabase
      .from('company_profiles')
      .insert([{
        user_id: userId,
        company_name: companyName,
        company_type: companyType,
        industry,
        registration_number: registrationNumber,
        tax_id: taxId,
        address,
        city,
        state,
        country,
        postal_code: postalCode,
        website,
        description,
        logo_url: logoUrl,
        banner_url: bannerUrl,
        employee_count: employeeCount,
        founded_year: foundedYear
      }])
      .select()
      .limit(1);

    if (insertError) {
      console.error('Supabase insert error (register company):', insertError);
      return res.status(500).json({ error: 'Database insert error' });
    }

    const newCompany = insertData?.[0];

    res.status(201).json({
      message: 'Company registered successfully',
      company: {
        id: newCompany.id,
        companyName: newCompany.company_name,
        companyType: newCompany.company_type,
        industry: newCompany.industry,
        registrationNumber: newCompany.registration_number,
        taxId: newCompany.tax_id,
        address: newCompany.address,
        city: newCompany.city,
        state: newCompany.state,
        country: newCompany.country,
        postalCode: newCompany.postal_code,
        website: newCompany.website,
        description: newCompany.description,
        logoUrl: newCompany.logo_url,
        bannerUrl: newCompany.banner_url,
        employeeCount: newCompany.employee_count,
        foundedYear: newCompany.founded_year,
        isVerified: newCompany.is_verified,
        createdAt: newCompany.created_at
      }
    });
  } catch (error) {
    console.error('Company registration error:', error);
    res.status(500).json({ error: 'Internal server error during company registration' });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const {
      companyName,
      companyType,
      industry,
      registrationNumber,
      taxId,
      address,
      city,
      state,
      country,
      postalCode,
      website,
      description,
      logoUrl,
      bannerUrl,
      employeeCount,
      foundedYear
    } = req.body;

    const userId = req.user.id;

    // Update company profile for this user
    const { data: updateData, error: updateError } = await supabase
      .from('company_profiles')
      .update({
        company_name: companyName,
        company_type: companyType,
        industry,
        registration_number: registrationNumber,
        tax_id: taxId,
        address,
        city,
        state,
        country,
        postal_code: postalCode,
        website,
        description,
        logo_url: logoUrl,
        banner_url: bannerUrl,
        employee_count: employeeCount,
        founded_year: foundedYear,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .limit(1);

    if (updateError) {
      console.error('Supabase update error (update company):', updateError);
      return res.status(500).json({ error: 'Database update error' });
    }

    if (!updateData || updateData.length === 0) {
      return res.status(404).json({
        error: 'Company profile not found'
      });
    }

    const updatedCompany = updateData[0];

    res.json({
      message: 'Company updated successfully',
      company: {
        id: updatedCompany.id,
        companyName: updatedCompany.company_name,
        companyType: updatedCompany.company_type,
        industry: updatedCompany.industry,
        registrationNumber: updatedCompany.registration_number,
        taxId: updatedCompany.tax_id,
        address: updatedCompany.address,
        city: updatedCompany.city,
        state: updatedCompany.state,
        country: updatedCompany.country,
        postalCode: updatedCompany.postal_code,
        website: updatedCompany.website,
        description: updatedCompany.description,
        logoUrl: updatedCompany.logo_url,
        bannerUrl: updatedCompany.banner_url,
        employeeCount: updatedCompany.employee_count,
        foundedYear: updatedCompany.founded_year,
        isVerified: updatedCompany.is_verified,
        updatedAt: updatedCompany.updated_at
      }
    });
  } catch (error) {
    console.error('Company update error:', error);
    res.status(500).json({ error: 'Internal server error during company update' });
  }
};

export const getCompanyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get company profile
    const { data: companyData, error: companyError } = await supabase
      .from('company_profiles')
      .select('*')
      .eq('user_id', userId)
      .limit(1);

    if (companyError) {
      console.error('Supabase select error (company profile):', companyError);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!companyData || companyData.length === 0) {
      return res.status(404).json({
        error: 'Company profile not found'
      });
    }

    const profile = companyData[0];

    // Fetch user info separately
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, phone_number, email_verified, phone_verified')
      .eq('id', userId)
      .limit(1);

    if (userError) {
      console.error('Supabase select error (user):', userError);
      return res.status(500).json({ error: 'Database error fetching user' });
    }

    const userRow = userData?.[0] || {};

    res.json({
      user: {
        id: userId,
        email: userRow.email,
        firstName: userRow.first_name,
        lastName: userRow.last_name,
        phoneNumber: userRow.phone_number,
        emailVerified: userRow.email_verified,
        phoneVerified: userRow.phone_verified
      },
      company: {
        id: profile.id,
        companyName: profile.company_name,
        companyType: profile.company_type,
        industry: profile.industry,
        registrationNumber: profile.registration_number,
        taxId: profile.tax_id,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        country: profile.country,
        postalCode: profile.postal_code,
        website: profile.website,
        description: profile.description,
        logoUrl: profile.logo_url,
        bannerUrl: profile.banner_url,
        employeeCount: profile.employee_count,
        foundedYear: profile.founded_year,
        isVerified: profile.is_verified,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at
      }
    });
  } catch (error) {
    console.error('Get company profile error:', error);
    res.status(500).json({ error: 'Internal server error while fetching profile' });
  }
};
