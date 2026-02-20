import React from 'react';
import { Play, TrendingUp, Users, Award, Star, BookOpen, Clock, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
    return (
        <div className="home-page">
            {/* Hero Section with 3D elements */}
            <section className="hero-section">
                <div className="hexagon-bg"></div>
                <div className="container hero-grid">
                    <div className="hero-content animate-fade-up glass-panel">
                        <div className="badge-pill mb-4"><TrendingUp size={16} /> #1 Premium Learning Platform</div>
                        <h1 className="hero-title">Unlock Your Potential with <span className="text-primary">Hexoria Academy</span></h1>
                        <p className="hero-subtitle">
                            The premium platform to learn, grow, and build your future.
                            Master the most sought-after skills with our industry-leading instructors and immersive 3D learning experiences.
                        </p>
                        <div className="hero-actions">
                            <Link to="/courses" className="btn btn-primary pulse-btn">Start Learning Now</Link>
                            <Link to="/courses" className="btn btn-secondary glass-btn flex items-center gap-2">
                                <Play size={20} fill="currentColor" /> View Courses
                            </Link>
                        </div>

                        <div className="hero-stats mt-8">
                            <div className="stat-item">
                                <span className="stat-number">10K+</span>
                                <span className="stat-text">Active Students</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">500+</span>
                                <span className="stat-text">Premium Courses</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">4.9/5</span>
                                <span className="stat-text">Average Rating</span>
                            </div>
                        </div>
                    </div>

                    {/* 3D Visual Floating Elements layout */}
                    <div className="hero-visual-3d hide-mobile scale-90">
                        <div className="scene-container">
                            <div className="floating-card-3d card-front animate-float-slow delay-1">
                                <div className="card-img" style={{ background: 'linear-gradient(135deg, #1E293B, #0F172A)' }}></div>
                                <div className="card-3d-overlay">
                                    <h4 className="font-bold">React Architecture</h4>
                                    <div className="progress-bar-small mt-2"><div style={{ width: '75%' }}></div></div>
                                </div>
                            </div>

                            <div className="floating-card-3d card-middle animate-float-medium delay-2 glass-panel-strong">
                                <ShieldCheck size={48} className="text-accent mb-2" />
                                <h3 className="text-xl font-bold">AWS Certified</h3>
                                <p className="text-sm text-gray mt-1">Hands-on Lab Active</p>
                            </div>

                            <div className="floating-card-3d card-back animate-float-fast delay-3">
                                <div className="card-img" style={{ background: 'linear-gradient(135deg, #6C4CF1, #00C2A8)' }}></div>
                                <div className="card-3d-play-btn"><Play size={24} fill="white" /></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Premium Features Section */}
            <section className="features-section bg-light py-12">
                <div className="container">
                    <div className="text-center mb-10">
                        <h2 className="section-title">Why choose Hexoria Academy?</h2>
                        <p className="text-muted max-w-2xl mx-auto">Experience a learning ecosystem built for tangible career results.</p>
                    </div>

                    <div className="feature-grid">
                        <div className="feature-card card hover-3d-tilt">
                            <div className="feature-icon-wrapper bg-primary-light text-primary"><Users size={28} /></div>
                            <h3 className="font-bold text-lg mt-4 mb-2">Expert Instructors</h3>
                            <p className="text-muted text-sm">Learn directly from Silicon Valley engineers and industry leaders.</p>
                        </div>
                        <div className="feature-card card hover-3d-tilt">
                            <div className="feature-icon-wrapper bg-accent-light text-accent"><Award size={28} /></div>
                            <h3 className="font-bold text-lg mt-4 mb-2">Verified Certificates</h3>
                            <p className="text-muted text-sm">Earn blockchain-verified certificates upon course completion.</p>
                        </div>
                        <div className="feature-card card hover-3d-tilt">
                            <div className="feature-icon-wrapper bg-secondary-light text-secondary"><BookOpen size={28} /></div>
                            <h3 className="font-bold text-lg mt-4 mb-2">Lifetime Access</h3>
                            <p className="text-muted text-sm">Buy a course once and own its continuously updated materials forever.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Detailed Featured Courses */}
            <section className="featured-section container py-12">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="section-title mb-1">Top Rated Programs</h2>
                        <p className="text-muted">Explore our most popular deeply-detailed courses.</p>
                    </div>
                    <Link to="/courses" className="btn-secondary btn-sm text-primary font-bold">See all courses &rarr;</Link>
                </div>

                <div className="course-grid">
                    {[
                        { id: 1, title: 'Full-Stack Cloud Applied Architecture', img: 'https://images.unsplash.com/photo-1662010021854-e67c538ea7a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', cat: 'Development', price: '99.00', rating: 4.8, students: '12K', hours: 45, inst: 'Dr. Angela Yu' },
                        { id: 2, title: 'Advanced UI/UX 3D Animations', img: 'https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', cat: 'Design', price: '120.00', rating: 4.9, students: '8K', hours: 32, inst: 'Jane Smith' },
                        { id: 3, title: 'Machine Learning & Python A-Z', img: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', cat: 'Data Science', price: '85.00', rating: 4.7, students: '25K', hours: 60, inst: 'Kirill Eremenko' }
                    ].map((course, index) => (
                        <div className="card course-card detailed-course-card animate-slide-up hover-lift shadow-glow" style={{ animationDelay: `${index * 150}ms` }} key={course.id}>
                            <div className="course-img-wrapper relative overflow-hidden">
                                <img src={course.img} alt={course.title} className="w-full h-48 object-cover transition-transform duration-500 hover-scale-img" />
                                <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded text-xs font-bold shadow-sm">{course.cat}</div>
                            </div>
                            <div className="course-content p-5">
                                <h3 className="course-title text-lg mb-2 line-clamp-2" title={course.title}>{course.title}</h3>
                                <p className="text-sm text-muted mb-3">By {course.inst}</p>

                                <div className="flex gap-4 text-xs font-medium text-gray mb-4 border-b pb-4">
                                    <span className="flex items-center gap-1"><Clock size={14} className="text-secondary" /> {course.hours}h</span>
                                    <span className="flex items-center gap-1"><Users size={14} className="text-primary" /> {course.students}</span>
                                    <span className="flex items-center gap-1 text-accent"><Star size={14} fill="currentColor" /> {course.rating}</span>
                                </div>

                                <div className="course-footer flex justify-between items-center mt-auto">
                                    <div className="course-price text-xl font-bold text-dark">${course.price}</div>
                                    <Link to={`/course/${course.id}`} className="btn btn-primary px-4 py-2 text-sm rounded-lg hover-glow">Enroll</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
