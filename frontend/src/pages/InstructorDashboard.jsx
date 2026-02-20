import React from 'react';
import { DollarSign, BookOpen, Users, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export default function InstructorDashboard() {
    const navigate = useNavigate();

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
                        <span className="stat-value count-up text-accent">$4,520</span>
                        <span className="stat-label">Total Revenue</span>
                    </div>
                </div>
                <div className="stat-card card">
                    <BookOpen className="stat-icon text-primary" size={32} />
                    <div className="stat-info">
                        <span className="stat-value count-up">5</span>
                        <span className="stat-label">Active Courses</span>
                    </div>
                </div>
                <div className="stat-card card">
                    <Users className="stat-icon text-secondary" size={32} />
                    <div className="stat-info">
                        <span className="stat-value count-up">1,248</span>
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
                                <th className="p-4">Course Name</th>
                                <th className="p-4">Enrollments</th>
                                <th className="p-4">Rating</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-bottom hover-row">
                                <td className="p-4 font-bold">Advanced Cloud Architecture</td>
                                <td className="p-4">842</td>
                                <td className="p-4">⭐ 4.8</td>
                                <td className="p-4">
                                    {/* PRD: Published -> Purple */}
                                    <span className="badge badge-purple">Published</span>
                                </td>
                                <td className="p-4"><button className="btn-secondary btn-sm" onClick={() => navigate('/course/1')}>Edit</button></td>
                            </tr>
                            <tr className="border-bottom hover-row">
                                <td className="p-4 font-bold">Basic React Foundations</td>
                                <td className="p-4">406</td>
                                <td className="p-4">⭐ 4.6</td>
                                <td className="p-4">
                                    <span className="badge badge-purple">Published</span>
                                </td>
                                <td className="p-4"><button className="btn-secondary btn-sm" onClick={() => navigate('/course/1')}>Edit</button></td>
                            </tr>
                            <tr className="hover-row">
                                <td className="p-4 font-bold">Machine Learning for Beginners</td>
                                <td className="p-4">0</td>
                                <td className="p-4">-</td>
                                <td className="p-4">
                                    {/* PRD: Draft -> Gray */}
                                    <span className="badge badge-gray">Draft</span>
                                </td>
                                <td className="p-4"><button className="btn-secondary btn-sm mt-0" onClick={() => navigate('/build')}>Cont. Build</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
