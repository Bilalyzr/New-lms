import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { BookOpen, Award, Clock } from 'lucide-react';

export default function Dashboard() {
    const navigate = useNavigate();
    return (
        <div className="dashboard-page container">
            <header className="dashboard-header">
                <h1 className="dashboard-title">Student Dashboard</h1>
                <p className="text-muted">Welcome back, learner! Here's your progress.</p>
            </header>

            <div className="stats-grid">
                <div className="stat-card card">
                    <BookOpen className="stat-icon text-primary" size={32} />
                    <div className="stat-info">
                        <span className="stat-value count-up">12</span>
                        <span className="stat-label">Enrolled Courses</span>
                    </div>
                </div>
                <div className="stat-card card">
                    <Award className="stat-icon text-accent" size={32} />
                    <div className="stat-info">
                        <span className="stat-value count-up">4</span>
                        <span className="stat-label">Certificates</span>
                    </div>
                </div>
                <div className="stat-card card">
                    <Clock className="stat-icon text-primary" size={32} />
                    <div className="stat-info">
                        <span className="stat-value count-up">38</span>
                        <span className="stat-label">Hours Learned</span>
                    </div>
                </div>
            </div>

            <section className="learning-section">
                <h2 className="section-subtitle">Continue Learning</h2>
                <div className="course-list">
                    <div className="learning-card card">
                        <div className="learning-img"></div>
                        <div className="learning-content">
                            <h3 className="learning-title">Advanced React & Redux</h3>
                            <p className="learning-instructor">Instructor: John Doe</p>
                            <div className="progress-container">
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: '65%' }}></div>
                                </div>
                                <span className="progress-text">65% Complete</span>
                            </div>
                            <button
                                className="btn btn-primary btn-sm mt-3"
                                onClick={() => navigate('/learn/1/1')}
                            >
                                Resume Course
                            </button>
                        </div>
                    </div>

                    <div className="learning-card card">
                        <div className="learning-img"></div>
                        <div className="learning-content">
                            <h3 className="learning-title">UI/UX Design Masterclass</h3>
                            <p className="learning-instructor">Instructor: Jane Smith</p>
                            <div className="progress-container">
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: '30%' }}></div>
                                </div>
                                <span className="progress-text">30% Complete</span>
                            </div>
                            <button
                                className="btn btn-primary btn-sm mt-3"
                                onClick={() => navigate('/learn/2/1')}
                            >
                                Resume Course
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
