const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// @route   GET api/courses
// @desc    Get all published courses with instructor names
// @access  Public
router.get('/', async (req, res) => {
    try {
        const courses = await pool.query(`
            SELECT c.*, u.full_name as instructor 
            FROM courses c 
            LEFT JOIN users u ON c.instructor_id = u.id 
            WHERE c.status = 'Published'
            ORDER BY c.created_at DESC
        `);
        res.json(courses.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/courses/instructor
// @desc    Get courses created by the logged-in instructor
// @access  Private (Instructor only)
router.get('/instructor', auth, async (req, res) => {
    if (req.user.role !== 'instructor') return res.status(403).json({ message: 'Access Denied: Instructors Only' });
    try {
        const courses = await pool.query(
            'SELECT * FROM courses WHERE instructor_id = $1 ORDER BY created_at DESC',
            [req.user.id]
        );
        res.json(courses.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/courses
// @desc    Create a new course (Draft)
// @access  Private (Instructor only)
router.post('/', auth, async (req, res) => {
    if (req.user.role !== 'instructor') return res.status(403).json({ message: 'Access Denied: Instructors Only' });
    try {
        const { title, category, price, description, status, image_url } = req.body;

        const newCourse = await pool.query(
            'INSERT INTO courses (title, category, price, description, instructor_id, status, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [title, category, price, description, req.user.id, status || 'Draft', image_url || '']
        );
        res.json(newCourse.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
