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
                        <span className="stat-value count-up">0</span>
                        <span className="stat-label">Enrolled Courses</span>
                    </div>
                </div>
                <div className="stat-card card">
                    <Award className="stat-icon text-accent" size={32} />
                    <div className="stat-info">
                        <span className="stat-value count-up">0</span>
                        <span className="stat-label">Certificates</span>
                    </div>
                </div>
                <div className="stat-card card">
                    <Clock className="stat-icon text-primary" size={32} />
                    <div className="stat-info">
                        <span className="stat-value count-up">0</span>
                        <span className="stat-label">Hours Learned</span>
                    </div>
                </div>
            </div>

            <section className="learning-section">
                <h2 className="section-subtitle">Continue Learning</h2>
                <div className="course-list">
                    <p className="text-muted text-center py-6 card">You are not enrolled in any continuous courses yet.</p>
                </div>
            </section>
        </div>
    );
}
