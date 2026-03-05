import React, { useState, useEffect, useContext } from 'react';
import { DollarSign, BookOpen, Users, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './Dashboard.css';

export default function InstructorDashboard() {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchInstructorCourses = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/courses/instructor', {
                    headers: { 'x-auth-token': token }
                });
                setCourses(res.data);
            } catch (error) {
                console.error('Error fetching instructor courses:', error);
            }
        };

        if (token) fetchInstructorCourses();
    }, [token]);

    const activeCoursesCount = courses.filter(c => c.status === 'Published').length;

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

            {/* PRD requirement: Revenue & Course Tracking */}
            <div className="stats-grid mb-6">
                <div className="stat-card card">
                    <DollarSign className="stat-icon text-accent" size={32} />
                    <div className="stat-info">
                        {/* PRD: Teal for positive revenue growth */}
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
                        <span className="stat-value count-up">0</span>
                        <span className="stat-label">Total Students</span>
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
                            {courses.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-4 text-center text-muted">You have not created any courses yet.</td>
                                </tr>
                            ) : (
                                courses.map(course => (
                                    <tr key={course.id} className="border-bottom hover-row">
                                        <td className="p-4 font-bold">{course.title}</td>
                                        <td className="p-4">0</td>
                                        <td className="p-4">-</td>
                                        <td className="p-4">
                                            <span className={`badge ${course.status === 'Published' ? 'badge-purple' : 'badge-gray'}`}>
                                                {course.status || 'Draft'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => navigate(course.status === 'Published' ? `/course/${course.id}` : '/build')}
                                            >
                                                {course.status === 'Published' ? 'Edit' : 'Cont. Build'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section >
        </div >
    );
}
