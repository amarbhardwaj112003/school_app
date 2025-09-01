// lib/db.js
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',        // usually localhost
  user: 'root',             // your MySQL username
  password: 'amar@112003',// your MySQL password
  database: 'school_db' // the database you created
});

export default pool;
