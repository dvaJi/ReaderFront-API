// Imports
import dotenv from 'dotenv';

// Load .env
dotenv.config();

// Environment
export const NODE_ENV = process.env.NODE_ENV.trim();

// Port
export const PORT = process.env.PORT || 8000;

// Security
export const SECRET_KEY = process.env.SECRET_KEY;

// URL
export const APP_URL = process.env.APP_URL;
export const API_URL = process.env.API_URL;
export const REACT_APP_APP_TITLE = process.env.REACT_APP_APP_TITLE;

// Email
export const SENDGRID_API = process.env.SENDGRID_API;
export const EMAIL = process.env.EMAIL;
