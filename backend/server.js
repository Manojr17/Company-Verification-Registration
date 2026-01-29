import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { supabase } from './config/supabaseclient.js'; // using Supabase client
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import helmet from "helmet";
import compression from "compression";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security and middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.cloudinary.com"],
    },
  },
}));

// Allow preview domains during development; keep strict in production
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? (process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : 'https://company-registration-app.vercel.app')
    : true, // allow any origin while developing (preview URLs will be allowed)
  credentials: true,
}));

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Supabase Connection Test
(async () => {
  try {
    const { error } = await supabase.from("users").select("id").limit(1);
    if (error) {
      console.warn("⚠️ Supabase connection test warning:", error.message || error);
    } else {
      console.log("🗄️ Supabase connected successfully ✅");
    }
  } catch (err) {
    console.error("🚨 Supabase connection error:", err?.message || err);
  }
})();

// JWT middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "Backend running successfully ✅",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Register user
app.post("/api/auth/register", async (req, res) => {
  const { email, password, firstName, lastName, phoneNumber } = req.body;

  try {
    // Check if user already exists
    const { data: existingUser, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single()
      .catch(e => ({ data: null, error: e })); // prevent unhandled rejection

    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email" });
    }

    // If userError exists and it's not the "no rows" situation, throw
    if (userError && userError.code && userError.code !== "PGRST116") {
      throw userError;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert new user
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          email,
          password: hashedPassword,
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          firebase_uid: `local_${Date.now()}`,
          email_verified: false,
          phone_verified: false,
        },
      ])
      .select()
      .single();

    if (insertError) throw insertError;

    // Generate JWT token
    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        firebaseUid: newUser.firebase_uid,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "90d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        phoneNumber: newUser.phone_number,
        emailVerified: newUser.email_verified,
        phoneVerified: newUser.phone_verified,
        createdAt: newUser.created_at,
      },
      token,
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
});

// Login user
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single()
      .catch(e => ({ data: null, error: e }));

    if (userError || !user) {
      return res.status(400).json({ error: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        firebaseUid: user.firebase_uid,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "90d" }
    );

    // Update last login
    await supabase
      .from("users")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", user.id);

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phoneNumber: user.phone_number,
        emailVerified: user.email_verified,
        phoneVerified: user.phone_verified,
        createdAt: user.created_at,
      },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

// Register company
app.post("/api/company/register", authenticateToken, async (req, res) => {
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
    foundedYear,
  } = req.body;

  const userId = req.user.id;

  try {
    const { data: existingCompany, error: existingError } = await supabase
      .from("company_profiles")
      .select("id")
      .eq("user_id", userId)
      .single()
      .catch(e => ({ data: null, error: e }));

    if (existingCompany) {
      return res.status(400).json({
        error: "Company profile already exists for this user",
      });
    }

    if (existingError && existingError.code && existingError.code !== "PGRST116") {
      throw existingError;
    }

    const { data: newCompany, error } = await supabase
      .from("company_profiles")
      .insert([
        {
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
          founded_year: foundedYear,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: "Company registered successfully",
      company: newCompany,
    });
  } catch (err) {
    console.error("Company registration error:", err);
    res.status(500).json({ error: "Company registration failed. Please try again." });
  }
});

// Get company profile
app.get("/api/company/profile", authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const { data: profile, error } = await supabase
      .from("company_profiles")
      .select(`
        *,
        users (
          email,
          first_name,
          last_name,
          phone_number,
          email_verified,
          phone_verified
        )
      `)
      .eq("user_id", userId)
      .single();

    if (error || !profile) {
      return res.status(404).json({ error: "Company profile not found" });
    }

    res.json({ profile });
  } catch (err) {
    console.error("Get company profile error:", err);
    res.status(500).json({ error: "Failed to fetch company profile" });
  }
});

// List all companies (public)
app.get("/api/company/list", async (req, res) => {
  try {
    const { data: companies, error } = await supabase
      .from("company_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({ companies });
  } catch (err) {
    console.error("List companies error:", err);
    res.status(500).json({ error: "Failed to fetch companies" });
  }
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === "production" ? "Something went wrong!" : err.message,
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});

export default app;
