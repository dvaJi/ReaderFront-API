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

// Database
export const DB_USER = process.env.DB_USER;
export const DB_PASS = process.env.DB_PASS;
export const DB_NAME = process.env.DB_NAME;
export const DB_HOSTNAME = process.env.DB_HOSTNAME;
export const DB_DIALECT = process.env.DB_DIALECT;

// URL
export const APP_URL = process.env.APP_URL;
export const API_URL = process.env.API_URL;

// Email
export const EMAIL_HOST = process.env.EMAIL_HOST;
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
