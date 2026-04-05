import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PlayCircle, Clock } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import './Dashboard.css';

export default function MyCourses() {
    const { user } = useContext(AuthContext);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyCourses = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/learn/my-courses', {
                    headers: { 'x-auth-token': user?.token }
                });
                setCourses(res.data);
            } catch (err) {
                console.error('Error fetching my courses:', err);
            } finally {
                setLoading(false);
            }
        };

        if (user?.token) {
            fetchMyCourses();
        }
    }, [user]);

    if (loading) return <div className="p-8 text-center text-muted">Loading your courses...</div>;

    return (
        <div className="dashboard-page container animate-fade-up">
            <header className="dashboard-header mb-6">
                <h1 className="dashboard-title">My Learning</h1>
                <p className="text-muted">Pick up where you left off and finish your courses.</p>
            </header>

            {courses.length === 0 ? (
                <div className="card text-center p-8">
                    <h3 className="text-xl font-bold mb-2">You aren't enrolled in any courses yet.</h3>
                    <p className="text-muted mb-4">Start exploring the platform to find your next skill!</p>
                    <Link to="/courses" className="btn btn-primary">Browse Courses</Link>
                </div>
            ) : (
                <div className="grid-responsive">
                    {courses.map(course => (
                        <div key={course.id} className="card p-0 overflow-hidden flex flex-col">
                            <div className="bg-light relative" style={{ height: '160px' }}>
                                {course.image_url ? (
                                    <img src={course.image_url} alt={course.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                                        <PlayCircle size={48} className="text-muted opacity-50" />
                                    </div>
                                )}
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                                <h3 className="font-bold text-lg mb-1 leading-tight">{course.title}</h3>
                                <p className="text-sm text-muted mb-3 flex-1">{course.instructor}</p>
                                
                                <div className="mt-auto">
                                    <div className="flex justify-between items-center text-xs font-bold mb-1">
                                        <span>{course.progress_percentage}% Complete</span>
                                        {course.progress_percentage === 100 && <span className="text-accent">Finished 🎉</span>}
                                    </div>
                                    <div className="progress-bar-container bg-light w-full h-2 rounded-full mb-4">
                                        <div 
                                            className="progress-fill-player bg-primary h-full rounded-full" 
                                            style={{ width: `${course.progress_percentage}%` }}
                                        ></div>
                                    </div>
                                    <button 
                                        className="btn btn-primary w-full"
                                        onClick={() => navigate(`/learn/${course.id}`)}
                                    >
                                        {course.progress_percentage === 0 ? 'Start Course' : course.progress_percentage === 100 ? 'Review Course' : 'Continue Learning'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
