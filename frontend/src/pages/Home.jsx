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
                    <Link to="/courses" className="btn btn-secondary btn-sm text-primary font-bold">See all courses &rarr;</Link>
                </div>

                <div className="course-grid">
                    <p className="text-muted p-4 col-span-full">No top rated programs available at the moment.</p>
                </div>
            </section>
        </div>
    );
}
