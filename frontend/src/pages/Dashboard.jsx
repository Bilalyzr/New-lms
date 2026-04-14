import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './Dashboard.css';
import { BookOpen, Award, Clock, PlayCircle, ArrowRight } from 'lucide-react';

export default function Dashboard() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [courses, setCourses] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.token) { setLoading(false); return; }
            try {
                const [coursesRes, certsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/learn/my-courses', {
                        headers: { 'x-auth-token': user.token }
                    }),
                    axios.get('http://localhost:5000/api/learn/my-certificates', {
                        headers: { 'x-auth-token': user.token }
                    })
                ]);
                setCourses(coursesRes.data);
                setCertificates(certsRes.data);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const inProgressCourses = courses.filter(c => c.progress_percentage > 0 && c.progress_percentage < 100);
    const completedCount = courses.filter(c => c.progress_percentage === 100).length;

    return (
        <div className="dashboard-page container animate-fade-up">
            <header className="dashboard-header">
                <h1 className="dashboard-title">Student Dashboard</h1>
                <p className="text-muted">Welcome back{user?.full_name ? `, ${user.full_name}` : ''}! Here's your progress.</p>
            </header>

            <div className="stats-grid">
                <div className="stat-card card">
                    <BookOpen className="stat-icon text-primary" size={32} />
                    <div className="stat-info">
                        <span className="stat-value count-up">{loading ? '-' : courses.length}</span>
                        <span className="stat-label">Enrolled Courses</span>
                    </div>
                </div>
                <div className="stat-card card">
                    <Award className="stat-icon text-accent" size={32} />
                    <div className="stat-info">
                        <span className="stat-value count-up">{loading ? '-' : certificates.length}</span>
                        <span className="stat-label">Certificates</span>
                    </div>
                </div>
                <div className="stat-card card">
                    <Clock className="stat-icon text-primary" size={32} />
                    <div className="stat-info">
                        <span className="stat-value count-up">{loading ? '-' : completedCount}</span>
                        <span className="stat-label">Completed</span>
                    </div>
                </div>
            </div>

            <section className="learning-section">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="section-subtitle" style={{marginBottom: 0}}>Continue Learning</h2>
                    {courses.length > 0 && (
                        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/my-courses')}>
                            View All <ArrowRight size={14} />
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="card text-center p-6 text-muted">Loading your courses...</div>
                ) : inProgressCourses.length > 0 ? (
                    <div className="grid-responsive">
                        {inProgressCourses.slice(0, 3).map(course => (
                            <div key={course.id} className="card p-0 overflow-hidden flex flex-col">
                                <div className="bg-light relative" style={{ height: '140px' }}>
                                    {course.image_url ? (
                                        <img src={course.image_url} alt={course.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center" style={{background: '#F1F5F9'}}>
                                            <PlayCircle size={40} className="text-muted" style={{opacity: 0.3}} />
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 flex flex-col flex-1">
                                    <h3 className="font-bold mb-1 leading-tight" style={{fontSize: '15px'}}>{course.title}</h3>
                                    <p className="text-sm text-muted mb-3">{course.instructor}</p>
                                    <div className="mt-auto">
                                        <div className="flex justify-between items-center text-xs font-bold mb-1">
                                            <span>{course.progress_percentage}% Complete</span>
                                        </div>
                                        <div className="progress-bar-container bg-light w-full h-2 rounded-full mb-3">
                                            <div
                                                className="progress-fill-player bg-primary h-full rounded-full"
                                                style={{ width: `${course.progress_percentage}%` }}
                                            ></div>
                                        </div>
                                        <button
                                            className="btn btn-primary w-full btn-sm"
                                            onClick={() => navigate(`/learn/${course.id}`)}
                                        >
                                            Continue Learning
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : courses.length > 0 ? (
                    <div className="card text-center p-6">
                        <p className="text-muted mb-3">You haven't started any courses yet. Pick one and begin!</p>
                        <button className="btn btn-primary btn-sm" onClick={() => navigate('/my-courses')}>Go to My Courses</button>
                    </div>
                ) : (
                    <div className="card text-center p-6">
                        <p className="text-muted mb-3">You are not enrolled in any courses yet.</p>
                        <button className="btn btn-primary btn-sm" onClick={() => navigate('/courses')}>Browse Courses</button>
                    </div>
                )}
            </section>
        </div>
    );
}
