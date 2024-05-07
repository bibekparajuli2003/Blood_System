const mysql = require('mysql2');
const dbConfig = require('./config/dbConfig.js');

// Create a new connection pool using the dbConfig settings
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "", // Provide your database password
  database: "bloodbank",
  waitForConnections: true,
  connectionLimit: dbConfig.pool.max,
  queueLimit: 0
});

// Test the connection
pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections.');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused.');
    }
  } else {
    console.log('Database connection successful!');
    connection.release(); // Release the connection
  }
});

module.exports = pool;