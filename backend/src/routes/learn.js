const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// @route   GET api/learn/my-courses
// @desc    Get all courses the logged-in student is enrolled in
// @access  Private (Student)
router.get('/my-courses', auth, async (req, res) => {
    try {
        const studentId = req.user.id;
        const myCourses = await pool.query(`
            SELECT c.id, c.title, c.image_url, c.instructor_id, u.full_name as instructor, e.progress_percentage
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            LEFT JOIN users u ON c.instructor_id = u.id
            WHERE e.student_id = $1
            ORDER BY e.enrolled_at DESC
        `, [studentId]);
        res.json(myCourses.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/learn/my-certificates
// @desc    Get all certificates earned by the logged-in user
// @access  Private
router.get('/my-certificates', auth, async (req, res) => {
    try {
        const studentId = req.user.id;
        const certs = await pool.query(`
            SELECT cert.certificate_code, cert.issued_at, c.title as course_title, u.full_name as instructor
            FROM certificates cert
            JOIN courses c ON cert.course_id = c.id
            LEFT JOIN users u ON c.instructor_id = u.id
            WHERE cert.user_id = $1
            ORDER BY cert.issued_at DESC
        `, [studentId]);
        res.json(certs.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/learn/:courseId/enroll
// @desc    Enroll logged-in user in a course
// @access  Private (Student)
router.post('/:courseId/enroll', auth, async (req, res) => {
    try {
        const { courseId } = req.params;
        const studentId = req.user.id;

        // Check if course exists and is published
        const courseRes = await pool.query("SELECT * FROM courses WHERE id = $1 AND status = 'Published'", [courseId]);
        if (courseRes.rows.length === 0) {
            return res.status(404).json({ message: 'Course not found or not available' });
        }

        // Check if already enrolled
        const checkEnrolled = await pool.query('SELECT * FROM enrollments WHERE student_id = $1 AND course_id = $2', [studentId, courseId]);
        if (checkEnrolled.rows.length > 0) {
            return res.status(400).json({ message: 'Already enrolled in this course' });
        }

        const newEnrollment = await pool.query(
            'INSERT INTO enrollments (student_id, course_id, progress_percentage) VALUES ($1, $2, 0) RETURNING *',
            [studentId, courseId]
        );

        // Update students_enrolled count in courses table
        await pool.query('UPDATE courses SET students_enrolled = students_enrolled + 1 WHERE id = $1', [courseId]);

        res.json(newEnrollment.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/learn/:courseId
// @desc    Get course curriculum and student progress
// @access  Private
router.get('/:courseId', auth, async (req, res) => {
    try {
        const { courseId } = req.params;
        const studentId = req.user.id;

        // Verify enrollment
        const enrollCheck = await pool.query('SELECT * FROM enrollments WHERE student_id = $1 AND course_id = $2', [studentId, courseId]);
        if (enrollCheck.rows.length === 0) {
            return res.status(403).json({ message: 'You must enroll first' });
        }
        const enrollment = enrollCheck.rows[0];

        // Get Course Info
        const courseRes = await pool.query("SELECT title, description, instructor_id FROM courses WHERE id = $1 AND status = 'Published'", [courseId]);
        
        if (courseRes.rows.length === 0) {
            return res.status(404).json({ message: 'Course not found or is not currently available.' });
        }

        const course = courseRes.rows[0];

        // Get Sections
        const sectionsRes = await pool.query('SELECT id, title, order_index FROM sections WHERE course_id = $1 ORDER BY order_index', [courseId]);
        const sections = sectionsRes.rows;

        // Get Lessons and Quizzes grouped by section
        const progressRes = await pool.query('SELECT lesson_id FROM lesson_progress WHERE user_id = $1 AND completed = TRUE', [studentId]);
        const completedLessons = progressRes.rows.map(r => r.lesson_id);

        for (let section of sections) {
            const lessonsRes = await pool.query('SELECT id, title, video_url, order_index FROM lessons WHERE section_id = $1 ORDER BY order_index', [section.id]);
            section.lessons = lessonsRes.rows.map(l => ({
                ...l,
                completed: completedLessons.includes(l.id)
            }));

            const quizzesRes = await pool.query('SELECT id, title, order_index FROM quizzes WHERE section_id = $1 ORDER BY order_index', [section.id]);
            section.quizzes = quizzesRes.rows;
        }

        res.json({
            course,
            enrollment,
            curriculum: sections
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/learn/:courseId/progress/:lessonId
// @desc    Mark a lesson as completed and recalculate course progress
// @access  Private
router.post('/:courseId/progress/:lessonId', auth, async (req, res) => {
    try {
        const { courseId, lessonId } = req.params;
        const studentId = req.user.id;

        // Mark lesson completed (upsert)
        await pool.query(
            `INSERT INTO lesson_progress (user_id, lesson_id, completed) VALUES ($1, $2, TRUE) 
             ON CONFLICT (user_id, lesson_id) DO UPDATE SET completed = EXCLUDED.completed`,
            [studentId, lessonId]
        );

        // Recalculate course progress
        const totalLessonsRes = await pool.query(
            `SELECT count(l.id) as total FROM lessons l 
             JOIN sections s ON l.section_id = s.id 
             WHERE s.course_id = $1`, [courseId]
        );
        const totalLessons = parseInt(totalLessonsRes.rows[0].total) || 1; // avoid div by 0

        const completedRes = await pool.query(
            `SELECT count(lp.id) as completed FROM lesson_progress lp 
             JOIN lessons l ON lp.lesson_id = l.id 
             JOIN sections s ON l.section_id = s.id 
             WHERE s.course_id = $1 AND lp.user_id = $2 AND lp.completed = TRUE`,
             [courseId, studentId]
        );
        const completedLessons = parseInt(completedRes.rows[0].completed) || 0;

        let newProgress = Math.floor((completedLessons / totalLessons) * 100);
        if (newProgress > 100) newProgress = 100;

        // Update enrollment progress
        await pool.query('UPDATE enrollments SET progress_percentage = $1 WHERE student_id = $2 AND course_id = $3', [newProgress, studentId, courseId]);

        res.json({ message: 'Progress updated', progress: newProgress });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/learn/:courseId/certificate
// @desc    Generate certificate if course is completed
// @access  Private
router.post('/:courseId/certificate', auth, async (req, res) => {
    try {
        const { courseId } = req.params;
        const studentId = req.user.id;

        const enrollRes = await pool.query('SELECT progress_percentage FROM enrollments WHERE student_id = $1 AND course_id = $2', [studentId, courseId]);
        if (enrollRes.rows.length === 0) return res.status(403).json({ message: 'Not enrolled' });
        
        if (enrollRes.rows[0].progress_percentage < 100) {
            return res.status(400).json({ message: 'Course is not fully completed yet' });
        }

        // Check if certificate already exists
        const certCheck = await pool.query('SELECT * FROM certificates WHERE user_id = $1 AND course_id = $2', [studentId, courseId]);
        if (certCheck.rows.length > 0) {
            return res.json(certCheck.rows[0]);
        }

        // Generate mock certificate
        const certCode = 'CERT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        
        const newCert = await pool.query(
            'INSERT INTO certificates (user_id, course_id, certificate_code) VALUES ($1, $2, $3) RETURNING *',
            [studentId, courseId, certCode]
        );

        res.json(newCert.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
