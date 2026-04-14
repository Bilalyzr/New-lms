import React, { useState, useEffect, useContext } from 'react';
import { Play, Check, Heart, Share2, Star, Clock, Globe, Award, AlertCircle } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './CourseDetails.css';

export default function CourseDetails() {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('curriculum');
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const toast = useToast();

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/courses/${id}`);
                setCourse(res.data);
            } catch (err) {
                console.error("Error fetching course", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    const handleEnroll = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        
        try {
            await axios.post(`http://localhost:5000/api/learn/${id}/enroll`, {}, {
                headers: { 'x-auth-token': user.token }
            });
            toast.success("Enrollment successful! Redirecting to course...");
            navigate(`/learn/${id}`);
        } catch (err) {
            if (err.response?.data?.message === 'Already enrolled in this course') {
                navigate(`/learn/${id}`);
            } else {
                toast.error(err.response?.data?.message || 'Error enrolling in course');
            }
        }
    };

    if (loading) return <div className="p-8 text-center text-muted">Loading course details...</div>;
    if (!course) return <div className="p-8 text-center text-red-500">Course not found.</div>;

    const totalLectures = course.curriculum?.reduce((sum, sec) => sum + (sec.lessons?.length || 0), 0) || 0;

    return (
        <div className="course-details-page bg-light">
            {/* Dark Header Hero */}
            <section className="course-hero relative">
                {course.status !== 'Published' && (
                    <div className="absolute top-0 left-0 w-full bg-accent text-white text-center py-2 font-bold z-10 flex justify-center items-center gap-2">
                        <AlertCircle size={18} /> {course.status === 'Pending' ? 'This course is pending admin approval.' : 'This course is a draft.'} Preview Mode.
                    </div>
                )}
                <div className={`container hero-grid ${course.status !== 'Published' ? 'mt-8' : ''}`}>
                    <div className="course-hero-content animate-fade-up">
                        <div className="breadcrumbs">
                            {course.category}
                        </div>
                        <h1 className="course-title-hero">{course.title}</h1>
                        <p className="course-subtitle-hero">
                            {course.description || "Master the concepts with practical, hands-on learning."}
                        </p>
                        <div className="course-meta-hero">
                            <span className="rating-badge"><Star size={16} fill="currentColor" /> {course.rating || '0.0'}</span>
                            <span>{course.students_enrolled || 0} students enrolled</span>
                        </div>
                        <div className="course-creator">
                            Created by <span className="instructor-name">{course.instructor || 'Hexoria Instructor'}</span>
                        </div>
                        <div className="course-icons-hero">
                            <span><Clock size={16} /> self-paced learning</span>
                            <span><Globe size={16} /> English</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Floating Enrollment Card & Main Content */}
            <div className="container details-layout">
                <div className="main-column">

                    {/* Navigation Tabs */}
                    <div className="details-tabs card mb-4">
                        <button
                            className={`tab-btn ${activeTab === 'curriculum' ? 'active' : ''}`}
                            onClick={() => setActiveTab('curriculum')}
                        >
                            Curriculum
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                            onClick={() => setActiveTab('overview')}
                        >
                            Overview
                        </button>
                    </div>

                    {/* Curriculum Section */}
                    {activeTab === 'curriculum' && (
                        <div className="tab-content card animate-fade-up">
                            <h2 className="section-title">Course Content</h2>
                            <div className="curriculum-summary text-muted mb-4">
                                {course.curriculum?.length || 0} sections • {totalLectures} lectures
                            </div>

                            <div className="accordion-list">
                                {course.curriculum?.map((section, idx) => (
                                    <div key={section.id} className="accordion-item expanded card mb-3">
                                        <div className="accordion-header">
                                            <h3>Section {idx + 1}: {section.title}</h3>
                                        </div>
                                        <div className="accordion-body">
                                            {(() => {
                                                const items = [
                                                    ...(section.lessons || []).map(l => ({...l, isQuiz: false})),
                                                    ...(section.quizzes || []).map(q => ({...q, isQuiz: true}))
                                                ].sort((a, b) => a.order_index - b.order_index);

                                                if (items.length === 0) return <p className="text-muted italic text-sm">Empty section.</p>;

                                                return items.map((item, iIdx) => (
                                                    <div className="lecture-row" key={`${item.isQuiz ? 'q':'l'}-${item.id}`}>
                                                        <div className="lecture-title flex items-center gap-2">
                                                            {item.isQuiz ? <Play size={14} className="text-muted" /> : <Play size={14} className="text-primary" />} 
                                                            {iIdx + 1}. {item.title}
                                                        </div>
                                                        <span className="lecture-time text-xs text-muted">{item.isQuiz ? 'Quiz' : 'Video'}</span>
                                                    </div>
                                                ));
                                            })()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Overview Section */}
                    {activeTab === 'overview' && (
                        <div className="tab-content card animate-fade-up">
                            <h2 className="section-title">Description</h2>
                            <p className="mb-6 whitespace-pre-line text-muted leading-relaxed">
                                {course.description || "No description provided."}
                            </p>
                            
                            <h2 className="section-title mt-4">Requirements</h2>
                            <ul className="requirements-list">
                                {course.requirements ? (
                                    course.requirements.split('\n').filter(r => r.trim()).map((req, i) => <li key={i}>{req}</li>)
                                ) : (
                                    <li>Basic knowledge assumed.</li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Floating Sidebar */}
                <div className="sidebar-column">
                    <div className="enrollment-card card floating-sidebar shrink-animation">
                        <div className="cover-img-placeholder relative bg-gray-200" style={course.image_url ? { backgroundImage: `url(${course.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                            {!course.image_url && <div className="play-overlay"><Play size={48} fill="white" /></div>}
                        </div>

                        <div className="enrollment-body">
                            <div className="price-tag text-primary">${Number(course.price).toFixed(2)}</div>

                            {user?.role === 'instructor' && user?.id === course.instructor_id ? (
                                <button
                                    className="btn btn-secondary w-full mb-3"
                                    onClick={() => navigate(`/build/${course.id}`)}
                                >
                                    Edit Course
                                </button>
                            ) : (
                                <button
                                    className="btn btn-primary w-full enroll-btn pulse-glow-btn mb-3"
                                    onClick={handleEnroll}
                                    disabled={course.status !== 'Published'}
                                >
                                    {course.status === 'Published' ? 'Enroll Now' : 'Currently Unavailable'}
                                </button>
                            )}

                            <div className="interaction-buttons mb-4">
                                <button
                                    className="btn btn-secondary flex-1 icon-btn wishlist-btn"
                                    onClick={() => setIsWishlisted(!isWishlisted)}
                                    title="Add to Wishlist"
                                >
                                    <Heart
                                        size={20}
                                        className={isWishlisted ? 'text-primary heart-active' : ''}
                                        fill={isWishlisted ? 'currentColor' : 'none'}
                                    />
                                </button>
                                <button
                                    className="btn btn-secondary flex-1 icon-btn"
                                    title="Share Course"
                                    onClick={() => { navigator.clipboard.writeText(window.location.href); toast.info('Link copied to clipboard!'); }}
                                >
                                    <Share2 size={20} />
                                </button>
                            </div>

                            <div className="course-includes text-muted">
                                <h4 className="text-dark mb-2 font-bold">This course includes:</h4>
                                <div className="include-item"><Check size={16} /> Self-paced curriculum</div>
                                <div className="include-item"><Award size={16} /> Certificate of completion</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
