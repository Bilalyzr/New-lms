import React, { useState, useEffect, useContext } from 'react';
import { Users, Server, AlertCircle, Database, Check, X } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './Dashboard.css';

export default function AdminDashboard() {
    const { user } = useContext(AuthContext);
    const [pendingCourses, setPendingCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user?.token) {
            fetchPendingCourses();
        }
    }, [user]);

    const fetchPendingCourses = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get('http://localhost:5000/api/admin/courses/pending', {
                headers: { 'x-auth-token': user?.token }
            });
            setPendingCourses(res.data);
        } catch (err) {
            console.error('Error fetching pending courses:', err);
            setError(err.response?.data?.message || 'Failed to load pending courses. Make sure you are logged in as admin.');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (courseId, courseTitle) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/courses/${courseId}/approve`, {}, {
                headers: { 'x-auth-token': user?.token }
            });
            alert(`Course "${courseTitle}" approved successfully!`);
            fetchPendingCourses(); // Refresh list
        } catch (err) {
            console.error('Error approving course:', err);
            alert('Failed to approve course');
        }
    };

    const handleReject = async (courseId, courseTitle) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/courses/${courseId}/reject`, {}, {
                headers: { 'x-auth-token': user?.token }
            });
            alert(`Course "${courseTitle}" rejected.`);
            fetchPendingCourses(); // Refresh list
        } catch (err) {
            console.error('Error rejecting course:', err);
            alert('Failed to reject course');
        }
    };

    const handleAction = (e, message) => {
        e.preventDefault();
        alert(message);
    };

    return (
        <div className="dashboard-page container animate-fade-up">
            <header className="dashboard-header mb-6">
                <h1 className="dashboard-title">Platform Administration</h1>
                <p className="text-muted">Manage global users, verify transactions, and view platform health.</p>
            </header>

            {/* PRD 148: Admin Dashboard Purple gradient cards */}
            <div className="stats-grid mb-8">
                <div className="stat-card card admin-purple-card">
                    <Users className="stat-icon" size={32} color="white" />
                    <div className="stat-info">
                        <span className="stat-value count-up text-white" style={{ color: 'white' }}>12,504</span>
                        <span className="stat-label text-white" style={{ color: 'rgba(255,255,255,0.8)' }}>Platform Users</span>
                    </div>
                </div>
                <div className="stat-card card admin-purple-card">
                    <Server className="stat-icon" size={32} color="white" />
                    <div className="stat-info">
                        <span className="stat-value count-up text-white" style={{ color: 'white' }}>99.9%</span>
                        <span className="stat-label" style={{ color: 'rgba(255,255,255,0.8)' }}>System Uptime</span>
                    </div>
                </div>
                <div className="stat-card card admin-purple-card">
                    <Database className="stat-icon" size={32} color="white" />
                    <div className="stat-info">
                        <span className="stat-value count-up text-white" style={{ color: 'white' }}>AWS RDS</span>
                        <span className="stat-label" style={{ color: 'rgba(255,255,255,0.8)' }}>Storage Health</span>
                    </div>
                </div>
            </div>

            <div className="grid-2-col">
                {/* User Management Module */}
                <section className="card p-5 shrink-0">
                    <h2 className="section-title text-xl mb-4 text-dark">Course Approvals ({pendingCourses.length})</h2>
                    
                    {loading ? (
                        <p className="text-muted">Loading pending courses...</p>
                    ) : error ? (
                        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                            <strong>Error:</strong> {error}
                        </div>
                    ) : pendingCourses.length === 0 ? (
                        <p className="text-muted p-4 text-center bg-light border-radius">No courses pending approval. ✅</p>
                    ) : (
                        pendingCourses.map(course => (
                            <div key={course.id} className="flagged-item mb-3 p-3 bg-light border-radius">
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-3">
                                        <AlertCircle className="text-accent mt-1" size={18} />
                                        <div>
                                            <h4 className="font-bold text-sm">{course.title}</h4>
                                            <p className="text-xs text-muted">By {course.instructor || 'Unknown Instructor'} • {course.category}</p>
                                            <p className="text-xs text-muted">Status: <span className="font-semibold text-accent">{course.status}</span></p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            className="btn-secondary btn-sm text-red hover-red-bg border-red flex items-center justify-center p-2" 
                                            onClick={() => handleReject(course.id, course.title)}
                                            title="Reject Course"
                                        >
                                            <X size={16} />
                                        </button>
                                        <button 
                                            className="btn btn-primary btn-sm flex items-center justify-center p-2" 
                                            onClick={() => handleApprove(course.id, course.title)}
                                            title="Approve Course"
                                        >
                                            <Check size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </section>

                {/* Global Configuration Module */}
                <section className="card p-5 shrink-0">
                    <h2 className="section-title text-xl mb-4 text-dark">Quick Configs</h2>
                    <form onSubmit={(e) => handleAction(e, 'Global System Settings successfully updated and deployed to production!')}>
                        <div className="form-group">
                            <label className="text-sm font-bold text-muted mb-2 block">Platform Commission Rate (%)</label>
                            <input type="number" defaultValue={20} className="form-control" />
                        </div>
                        <button type="submit" className="btn btn-primary mt-3 w-full">Update Global Settings</button>
                    </form>
                </section>
            </div>

        </div>
    );
}
