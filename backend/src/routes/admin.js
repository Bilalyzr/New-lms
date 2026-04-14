const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access Denied: Admins Only' });
    }
    next();
};

// @route   GET api/admin/stats
// @desc    Get platform-wide statistics
// @access  Private (Admin only)
router.get('/stats', auth, isAdmin, async (req, res) => {
    try {
        const [usersRes, coursesRes, enrollmentsRes, publishedRes, pendingRes] = await Promise.all([
            pool.query('SELECT count(*) as total FROM users'),
            pool.query('SELECT count(*) as total FROM courses'),
            pool.query('SELECT count(*) as total FROM enrollments'),
            pool.query("SELECT count(*) as total FROM courses WHERE status = 'Published'"),
            pool.query("SELECT count(*) as total FROM courses WHERE status = 'Pending'")
        ]);
        res.json({
            totalUsers: parseInt(usersRes.rows[0].total),
            totalCourses: parseInt(coursesRes.rows[0].total),
            totalEnrollments: parseInt(enrollmentsRes.rows[0].total),
            publishedCourses: parseInt(publishedRes.rows[0].total),
            pendingCourses: parseInt(pendingRes.rows[0].total)
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/admin/courses/pending
// @desc    Get all pending courses for approval
// @access  Private (Admin only)
router.get('/courses/pending', auth, isAdmin, async (req, res) => {
    try {
        const courses = await pool.query(`
            SELECT c.*, u.full_name as instructor 
            FROM courses c 
            LEFT JOIN users u ON c.instructor_id = u.id 
            WHERE c.status = 'Pending'
            ORDER BY c.created_at ASC
        `);
        res.json(courses.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/admin/courses/:id/approve
// @desc    Approve a pending course (change status to Published)
// @access  Private (Admin only)
router.put('/courses/:id/approve', auth, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCourse = await pool.query(
            "UPDATE courses SET status = 'Published' WHERE id = $1 RETURNING *",
            [id]
        );
        
        if (updatedCourse.rows.length === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }
        
        res.json({ message: 'Course approved successfully', course: updatedCourse.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/admin/courses/:id/reject
// @desc    Reject a pending course (change status to Draft or Rejected)
// @access  Private (Admin only)
router.put('/courses/:id/reject', auth, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        // The PRD says Rejected -> Draft, let's just set it to 'Draft' so the instructor can fix it
        const updatedCourse = await pool.query(
            "UPDATE courses SET status = 'Draft' WHERE id = $1 RETURNING *",
            [id]
        );
        
        if (updatedCourse.rows.length === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }
        
        res.json({ message: 'Course rejected successfully', course: updatedCourse.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
