const pool = require('./src/config/db');
async function migrate() {
    try {
        await pool.query(`ALTER TABLE courses ADD COLUMN IF NOT EXISTS level VARCHAR(50) DEFAULT 'Intermediate'`);
        await pool.query(`ALTER TABLE courses ADD COLUMN IF NOT EXISTS requirements TEXT`);
        await pool.query(`ALTER TABLE courses ADD COLUMN IF NOT EXISTS target_audience TEXT`);
        console.log("Migration complete");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
migrate();
