// Imports
import { Sequelize } from 'sequelize';

// App Imports
import {
  DB_DIALECT,
  DB_HOSTNAME,
  DB_NAME,
  DB_PASS,
  DB_USER
} from '../config/env';

// Create new database connection
const connection = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOSTNAME,
  dialect: DB_DIALECT,
  //logging: NODE_ENV === 'development' ? console.info : false,
  operatorsAliases: Sequelize.Op
});

// Test connection
console.info('SETUP - Connecting database...');

connection
  .authenticate()
  .then(() => {
    console.info('INFO - Database connected.');
  })
  .catch(err => {
    console.error('ERROR - Unable to connect to the database:', err);
  });

export default connection;
