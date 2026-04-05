const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// =====================================================
// IMPORTANT: Specific/named routes MUST come BEFORE
// dynamic routes like /:id to avoid conflicts in Express
// =====================================================

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

// @route   GET api/courses/quiz/:quizId
// @desc    Get a quiz and its questions
// @access  Private
router.get('/quiz/:quizId', auth, async (req, res) => {
    try {
        const { quizId } = req.params;
        const quizRes = await pool.query('SELECT * FROM quizzes WHERE id = $1', [quizId]);
        if (quizRes.rows.length === 0) return res.status(404).json({ message: 'Quiz not found' });
        
        const questionsRes = await pool.query('SELECT * FROM quiz_questions WHERE quiz_id = $1', [quizId]);
        
        res.json({
            ...quizRes.rows[0],
            questions: questionsRes.rows
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/courses/quiz/:quizId/questions
// @desc    Set questions for a quiz (replaces all existing)
// @access  Private (Instructor only)
router.post('/quiz/:quizId/questions', auth, async (req, res) => {
    if (req.user.role !== 'instructor') return res.status(403).json({ message: 'Access Denied: Instructors Only' });
    const client = await pool.connect();
    try {
        const { quizId } = req.params;
        const { questions } = req.body;
        
        await client.query('BEGIN');
        await client.query('DELETE FROM quiz_questions WHERE quiz_id = $1', [quizId]);

        if (questions && questions.length > 0) {
            for (let q of questions) {
                await client.query(
                    'INSERT INTO quiz_questions (quiz_id, question_text, correct_answer, options) VALUES ($1, $2, $3, $4)',
                    [quizId, q.question_text, q.correct_answer, JSON.stringify(q.options)]
                );
            }
        }

        await client.query('COMMIT');
        res.json({ message: 'Quiz questions saved successfully' });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Error saving quiz questions:", err.message);
        res.status(500).send('Server Error');
    } finally {
        client.release();
    }
});

// @route   POST api/courses
// @desc    Create a new course (Draft/Pending)
// @access  Private (Instructor only)
router.post('/', auth, async (req, res) => {
    if (req.user.role !== 'instructor') return res.status(403).json({ message: 'Access Denied: Instructors Only' });
    const client = await pool.connect();
    try {
        console.log("RECEIVED COURSE SAVE REQUEST:", req.body);
        const { title, category, price, description, status, image_url, curriculum } = req.body;
        
        if (!title) return res.status(400).json({ details: 'Course title is required' });
        if (!category) return res.status(400).json({ details: 'Course category is required' });

        let validPrice = 0.00;
        if (price !== undefined && price !== null && price !== '') {
            validPrice = parseFloat(price);
            if (isNaN(validPrice)) validPrice = 0.00;
        }

        await client.query('BEGIN');

        const newCourse = await client.query(
            'INSERT INTO courses (title, category, price, description, instructor_id, status, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [title, category, validPrice, description || '', req.user.id, status || 'Draft', image_url || '']
        );
        
        const courseId = newCourse.rows[0].id;

        if (curriculum && Array.isArray(curriculum)) {
            for (let sIndex = 0; sIndex < curriculum.length; sIndex++) {
                const section = curriculum[sIndex];
                const sectionInsert = await client.query(
                    'INSERT INTO sections (course_id, title, order_index) VALUES ($1, $2, $3) RETURNING id',
                    [courseId, section.title || `Section ${sIndex + 1}`, sIndex]
                );
                const sectionId = sectionInsert.rows[0].id;

                if (section.items && Array.isArray(section.items)) {
                    for (let lIndex = 0; lIndex < section.items.length; lIndex++) {
                        const item = section.items[lIndex];
                        if (item.type === 'video' || item.type === 'doc') {
                            await client.query(
                                'INSERT INTO lessons (section_id, title, video_url, order_index) VALUES ($1, $2, $3, $4)',
                                [sectionId, item.title || `Lesson ${lIndex + 1}`, item.link || '', lIndex]
                            );
                        } else if (item.type === 'quiz') {
                            await client.query(
                                'INSERT INTO quizzes (section_id, title, order_index) VALUES ($1, $2, $3)',
                                [sectionId, item.title || `Quiz ${lIndex + 1}`, lIndex]
                            );
                        }
                    }
                }
            }
        }

        await client.query('COMMIT');
        res.json(newCourse.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("POSTGRES COURSE INSERT ERROR: ", err.message);
        res.status(500).json({ message: 'Server Error', details: err.message });
    } finally {
        client.release();
    }
});

// =====================================================
// Dynamic routes (/:id) MUST come AFTER all named routes
// =====================================================

// @route   GET api/courses/:id
// @desc    Get single course details with full curriculum
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const courseRes = await pool.query(`
            SELECT c.*, u.full_name as instructor 
            FROM courses c 
            LEFT JOIN users u ON c.instructor_id = u.id 
            WHERE c.id = $1
        `, [id]);

        if (courseRes.rows.length === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const course = courseRes.rows[0];

        const sectionsRes = await pool.query('SELECT id, title, order_index FROM sections WHERE course_id = $1 ORDER BY order_index', [id]);
        const sections = sectionsRes.rows;

        for (let section of sections) {
            const lessonsRes = await pool.query('SELECT id, title, duration, order_index FROM lessons WHERE section_id = $1 ORDER BY order_index', [section.id]);
            section.lessons = lessonsRes.rows;

            const quizzesRes = await pool.query('SELECT id, title, order_index FROM quizzes WHERE section_id = $1 ORDER BY order_index', [section.id]);
            section.quizzes = quizzesRes.rows;
        }

        res.json({
            ...course,
            curriculum: sections
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/courses/:courseId/curriculum
// @desc    Get course curriculum (sections + quizzes) for instructor
// @access  Private (Instructor only)
router.get('/:courseId/curriculum', auth, async (req, res) => {
    if (req.user.role !== 'instructor') return res.status(403).json({ message: 'Access Denied: Instructors Only' });
    try {
        const { courseId } = req.params;
        const sectionsRes = await pool.query('SELECT id, title, order_index FROM sections WHERE course_id = $1 ORDER BY order_index', [courseId]);
        const sections = sectionsRes.rows;
        
        for (let section of sections) {
            const quizzesRes = await pool.query('SELECT id, title, order_index FROM quizzes WHERE section_id = $1 ORDER BY order_index', [section.id]);
            section.quizzes = quizzesRes.rows;
        }

        res.json(sections);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/courses/:id
// @desc    Update an existing course
// @access  Private (Instructor only)
router.put('/:id', auth, async (req, res) => {
    if (req.user.role !== 'instructor') return res.status(403).json({ message: 'Access Denied: Instructors Only' });
    try {
        const { title, category, price, description, status, image_url, level, requirements, target_audience, certificate_color, certificate_logo_url } = req.body;
        const validPrice = price !== undefined && price !== '' ? parseFloat(price) : null;
        
        const courseCheck = await pool.query('SELECT * FROM courses WHERE id = $1', [req.params.id]);
        if (courseCheck.rows.length === 0) return res.status(404).json({ message: 'Course not found' });
        if (courseCheck.rows[0].instructor_id !== req.user.id) return res.status(401).json({ message: 'Unauthorized' });

        const updatedCourse = await pool.query(
            `UPDATE courses 
             SET title = COALESCE($1, title), category = COALESCE($2, category), price = COALESCE($3, price), 
                 description = COALESCE($4, description), status = COALESCE($5, status), image_url = COALESCE($6, image_url),
                 level = COALESCE($7, level), requirements = COALESCE($8, requirements), target_audience = COALESCE($9, target_audience),
                 certificate_color = COALESCE($10, certificate_color), certificate_logo_url = COALESCE($11, certificate_logo_url)
             WHERE id = $12 RETURNING *`,
            [title, category, validPrice, description, status, image_url, level, requirements, target_audience, certificate_color, certificate_logo_url, req.params.id]
        );
        res.json(updatedCourse.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
