const pool = require('./src/config/db');
const fs = require('fs');
const path = require('path');

async function migrate() {
    try {
        console.log("Adding columns to courses...");
        await pool.query(`ALTER TABLE courses ADD COLUMN IF NOT EXISTS level VARCHAR(50) DEFAULT 'Intermediate'`);
        await pool.query(`ALTER TABLE courses ADD COLUMN IF NOT EXISTS requirements TEXT`);
        await pool.query(`ALTER TABLE courses ADD COLUMN IF NOT EXISTS target_audience TEXT`);
        await pool.query(`ALTER TABLE courses ADD COLUMN IF NOT EXISTS certificate_color VARCHAR(20) DEFAULT '#6C4CF1'`);
        await pool.query(`ALTER TABLE courses ADD COLUMN IF NOT EXISTS certificate_logo_url TEXT`);
        
        console.log("Running database.sql schema...");
        const sql = fs.readFileSync(path.join(__dirname, 'database.sql')).toString();
        await pool.query(sql);
        
        console.log("Migration complete");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
migrate();
