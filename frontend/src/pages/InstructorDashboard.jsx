import React, { useState, useEffect, useContext } from 'react';
import { DollarSign, BookOpen, Users, TrendingUp, Clock, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';
import './Dashboard.css';

export default function InstructorDashboard() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const token = user?.token;
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();
    const confirm = useConfirm();

    useEffect(() => {
        const fetchInstructorCourses = async () => {
            setLoading(true);
            try {
                const res = await axios.get('http://localhost:5000/api/courses/instructor', {
                    headers: { 'x-auth-token': token }
                });
                setCourses(res.data);
            } catch (error) {
                console.error('Error fetching instructor courses:', error);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchInstructorCourses();
    }, [token]);

    const activeCoursesCount = courses.filter(c => c.status === 'Published').length;
    const pendingCount = courses.filter(c => c.status === 'Pending').length;
    const draftCount = courses.filter(c => c.status === 'Draft').length;
    const totalStudents = courses.reduce((sum, c) => sum + (c.students_enrolled || 0), 0);

    const handleDelete = async (courseId, courseTitle) => {
        const confirmed = await confirm({
            title: 'Delete Course',
            message: `Are you sure you want to delete "${courseTitle}"? This cannot be undone. All sections, lessons, quizzes, and enrollments will be permanently removed.`,
            confirmText: 'Delete',
            type: 'danger'
        });
        if (!confirmed) return;
        try {
            await axios.delete(`http://localhost:5000/api/courses/${courseId}`, {
                headers: { 'x-auth-token': token }
            });
            setCourses(prev => prev.filter(c => c.id !== courseId));
            toast.success(`"${courseTitle}" has been deleted.`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete course.');
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Published':
                return <span className="badge badge-purple"><CheckCircle size={12} /> Published</span>;
            case 'Pending':
                return <span className="badge badge-amber"><Clock size={12} /> Pending Approval</span>;
            case 'Draft':
            default:
                return <span className="badge badge-gray"><AlertCircle size={12} /> Draft</span>;
        }
    };

    return (
        <div className="dashboard-page container animate-fade-up">
            <header className="dashboard-header flex justify-between items-center mb-6">
                <div>
                    <h1 className="dashboard-title">Instructor Dashboard</h1>
                    <p className="text-muted">Track your courses, students, and platform revenue.</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/build')}
                >
                    + Create New Course
                </button>
            </header>

            <div className="stats-grid mb-6">
                <div className="stat-card card">
                    <DollarSign className="stat-icon text-accent" size={32} />
                    <div className="stat-info">
                        <span className="stat-value count-up text-accent">$0</span>
                        <span className="stat-label">Total Revenue</span>
                    </div>
                </div>
                <div className="stat-card card">
                    <BookOpen className="stat-icon text-primary" size={32} />
                    <div className="stat-info">
                        <span className="stat-value count-up">{activeCoursesCount}</span>
                        <span className="stat-label">Active Courses</span>
                    </div>
                </div>
                <div className="stat-card card">
                    <Users className="stat-icon text-secondary" size={32} />
                    <div className="stat-info">
                        <span className="stat-value count-up">{totalStudents}</span>
                        <span className="stat-label">Total Students</span>
                    </div>
                </div>
                <div className="stat-card card">
                    <Clock className="stat-icon" size={32} style={{color: '#F59E0B'}} />
                    <div className="stat-info">
                        <span className="stat-value count-up">{pendingCount}</span>
                        <span className="stat-label">Pending Approval</span>
                    </div>
                </div>
            </div>

            <section className="mt-8">
                <h2 className="section-subtitle">Your Courses</h2>

                <div className="card padding-0 mt-4 overflow-hidden">
                    <table className="data-table w-full">
                        <thead className="bg-light text-left text-muted text-sm border-bottom">
                            <tr>
                                <th className="p-4 w-full">Course Name</th>
                                <th className="p-4">Enrollments</th>
                                <th className="p-4">Rating</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-4 text-center text-muted">Loading your courses...</td>
                                </tr>
                            ) : courses.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-4 text-center text-muted">
                                        You have not created any courses yet.
                                        <br/>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            style={{marginTop: '12px'}}
                                            onClick={() => navigate('/build')}
                                        >
                                            + Create Your First Course
                                        </button>
                                    </td>
                                </tr>
                            ) : (
                                courses.map(course => (
                                    <tr key={course.id} className="border-bottom hover-row">
                                        <td className="p-4 font-bold">
                                            {course.title}
                                            {course.category && (
                                                <span className="text-xs text-muted" style={{display: 'block', fontWeight: 400, marginTop: 2}}>{course.category}</span>
                                            )}
                                        </td>
                                        <td className="p-4">{course.students_enrolled || 0}</td>
                                        <td className="p-4">{course.rating > 0 ? `${course.rating} ★` : '-'}</td>
                                        <td className="p-4">
                                            {getStatusBadge(course.status)}
                                        </td>
                                        <td className="p-4 flex gap-2">
                                            {course.status === 'Published' ? (
                                                <button
                                                    className="btn btn-secondary btn-sm"
                                                    onClick={() => navigate(`/course/${course.id}`)}
                                                >
                                                    View
                                                </button>
                                            ) : course.status === 'Pending' ? (
                                                <div className="flex flex-col gap-1">
                                                    <button
                                                        className="btn btn-secondary btn-sm"
                                                        onClick={() => navigate(`/course/${course.id}`)}
                                                    >
                                                        Preview
                                                    </button>
                                                    <span style={{fontSize: '10px', color: '#F59E0B', fontStyle: 'italic'}}>⏳ Under Review</span>
                                                </div>
                                            ) : (
                                                <button
                                                    className="btn btn-secondary btn-sm"
                                                    onClick={() => navigate(`/build/${course.id}`)}
                                                >
                                                    Cont. Build
                                                </button>
                                            )}
                                            <button
                                                className="btn btn-primary btn-sm ml-2"
                                                onClick={() => navigate(`/quiz-manager/${course.id}`)}
                                            >
                                                Quizzes
                                            </button>
                                            <button
                                                className="btn-delete-course"
                                                onClick={() => handleDelete(course.id, course.title)}
                                                title="Delete Course"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
