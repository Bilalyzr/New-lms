import React, { useState, useEffect, useContext } from 'react';
import { Users, BookOpen, AlertCircle, Database, Check, X, Clock, TrendingUp } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';
import './Dashboard.css';

export default function AdminDashboard() {
    const { user } = useContext(AuthContext);
    const [pendingCourses, setPendingCourses] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const toast = useToast();
    const confirm = useConfirm();

    useEffect(() => {
        if (user?.token) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [pendingRes, statsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/admin/courses/pending', {
                    headers: { 'x-auth-token': user?.token }
                }),
                axios.get('http://localhost:5000/api/admin/stats', {
                    headers: { 'x-auth-token': user?.token }
                })
            ]);
            setPendingCourses(pendingRes.data);
            setStats(statsRes.data);
        } catch (err) {
            console.error('Error fetching admin data:', err);
            setError(err.response?.data?.message || 'Failed to load admin data. Make sure you are logged in as admin.');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (courseId, courseTitle) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/courses/${courseId}/approve`, {}, {
                headers: { 'x-auth-token': user?.token }
            });
            toast.success(`Course "${courseTitle}" approved and published!`);
            fetchData();
        } catch (err) {
            console.error('Error approving course:', err);
            toast.error('Failed to approve course');
        }
    };

    const handleReject = async (courseId, courseTitle) => {
        const confirmed = await confirm({
            title: 'Reject Course',
            message: `Reject "${courseTitle}"? It will be sent back to the instructor as a draft for revision.`,
            confirmText: 'Reject',
            type: 'warning'
        });
        if (!confirmed) return;
        try {
            await axios.put(`http://localhost:5000/api/admin/courses/${courseId}/reject`, {}, {
                headers: { 'x-auth-token': user?.token }
            });
            toast.warning(`Course "${courseTitle}" rejected and sent back as draft.`);
            fetchData();
        } catch (err) {
            console.error('Error rejecting course:', err);
            toast.error('Failed to reject course');
        }
    };

    return (
        <div className="dashboard-page container animate-fade-up">
            <header className="dashboard-header mb-6">
                <h1 className="dashboard-title">Platform Administration</h1>
                <p className="text-muted">Manage courses, users, and platform health.</p>
            </header>

            {/* Stats Cards */}
            <div className="stats-grid mb-8">
                <div className="stat-card card admin-purple-card">
                    <Users className="stat-icon" size={32} color="white" />
                    <div className="stat-info">
                        <span className="stat-value count-up" style={{ color: 'white' }}>
                            {loading ? '-' : stats?.totalUsers || 0}
                        </span>
                        <span className="stat-label" style={{ color: 'rgba(255,255,255,0.8)' }}>Platform Users</span>
                    </div>
                </div>
                <div className="stat-card card admin-purple-card">
                    <BookOpen className="stat-icon" size={32} color="white" />
                    <div className="stat-info">
                        <span className="stat-value count-up" style={{ color: 'white' }}>
                            {loading ? '-' : stats?.publishedCourses || 0}
                        </span>
                        <span className="stat-label" style={{ color: 'rgba(255,255,255,0.8)' }}>Published Courses</span>
                    </div>
                </div>
                <div className="stat-card card admin-purple-card">
                    <TrendingUp className="stat-icon" size={32} color="white" />
                    <div className="stat-info">
                        <span className="stat-value count-up" style={{ color: 'white' }}>
                            {loading ? '-' : stats?.totalEnrollments || 0}
                        </span>
                        <span className="stat-label" style={{ color: 'rgba(255,255,255,0.8)' }}>Total Enrollments</span>
                    </div>
                </div>
            </div>

            <div className="grid-2-col">
                {/* Course Approvals */}
                <section className="card p-5 shrink-0">
                    <h2 className="section-title text-xl mb-4 text-dark">
                        Course Approvals
                        {!loading && pendingCourses.length > 0 && (
                            <span className="badge badge-amber" style={{marginLeft: '8px', fontSize: '12px'}}>{pendingCourses.length} pending</span>
                        )}
                    </h2>

                    {loading ? (
                        <p className="text-muted">Loading pending courses...</p>
                    ) : error ? (
                        <div className="p-4 bg-light border-radius text-sm" style={{color: '#DC2626'}}>
                            <strong>Error:</strong> {error}
                        </div>
                    ) : pendingCourses.length === 0 ? (
                        <p className="text-muted p-4 text-center bg-light border-radius">No courses pending approval. All clear!</p>
                    ) : (
                        pendingCourses.map(course => (
                            <div key={course.id} className="flagged-item mb-3 p-3 bg-light border-radius">
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-3">
                                        <AlertCircle className="text-accent mt-1" size={18} />
                                        <div>
                                            <h4 className="font-bold text-sm">{course.title}</h4>
                                            <p className="text-xs text-muted">
                                                By {course.instructor || 'Unknown Instructor'} &bull; {course.category}
                                                {course.price > 0 && ` • $${Number(course.price).toFixed(2)}`}
                                            </p>
                                            <p className="text-xs text-muted">
                                                Submitted: {new Date(course.created_at).toLocaleDateString()}
                                            </p>
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

                {/* Platform Overview */}
                <section className="card p-5 shrink-0">
                    <h2 className="section-title text-xl mb-4 text-dark">Platform Overview</h2>
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center p-3 bg-light border-radius">
                            <span className="text-sm font-bold">Total Courses</span>
                            <span className="text-sm">{loading ? '-' : stats?.totalCourses || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-light border-radius">
                            <span className="text-sm font-bold">Published</span>
                            <span className="text-sm badge badge-purple">{loading ? '-' : stats?.publishedCourses || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-light border-radius">
                            <span className="text-sm font-bold">Pending Approval</span>
                            <span className="text-sm badge badge-amber">{loading ? '-' : stats?.pendingCourses || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-light border-radius">
                            <span className="text-sm font-bold">Total Users</span>
                            <span className="text-sm">{loading ? '-' : stats?.totalUsers || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-light border-radius">
                            <span className="text-sm font-bold">Total Enrollments</span>
                            <span className="text-sm">{loading ? '-' : stats?.totalEnrollments || 0}</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
