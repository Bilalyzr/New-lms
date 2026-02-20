import React, { useState } from 'react';
import { Play, Check, Heart, Share2, Star, Clock, Globe, Award } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './CourseDetails.css';

export default function CourseDetails() {
    const [activeTab, setActiveTab] = useState('curriculum');
    const [isWishlisted, setIsWishlisted] = useState(false);
    const navigate = useNavigate();

    const handleEnroll = () => {
        navigate('/cart');
    };

    return (
        <div className="course-details-page bg-light">
            {/* Dark Header Hero */}
            <section className="course-hero">
                <div className="container hero-grid">
                    <div className="course-hero-content animate-fade-up">
                        <div className="breadcrumbs">
                            Development &gt; Web Development
                        </div>
                        <h1 className="course-title-hero">Full-Stack Cloud Applied Architecture</h1>
                        <p className="course-subtitle-hero">
                            Master the art of building scalable, cloud-native SaaS platforms using React, Node.js, and AWS.
                        </p>
                        <div className="course-meta-hero">
                            <span className="rating-badge"><Star size={16} fill="currentColor" /> 4.8</span>
                            <span>(12,344 ratings)</span>
                            <span>45,112 students enrolled</span>
                        </div>
                        <div className="course-creator">
                            Created by <span className="instructor-name">Dr. Angela Yu</span>
                        </div>
                        <div className="course-icons-hero">
                            <span><Clock size={16} /> 45 hours on-demand video</span>
                            <span><Globe size={16} /> English, Spanish, French</span>
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
                        <button
                            className={`tab-btn ${activeTab === 'instructor' ? 'active' : ''}`}
                            onClick={() => setActiveTab('instructor')}
                        >
                            Instructor
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                            onClick={() => setActiveTab('reviews')}
                        >
                            Reviews
                        </button>
                    </div>

                    {/* Curriculum Section */}
                    {activeTab === 'curriculum' && (
                        <div className="tab-content card animate-fade-up">
                            <h2 className="section-title">Course Content</h2>
                            <div className="curriculum-summary text-muted mb-4">
                                15 sections • 142 lectures • 45h 22m total length
                            </div>

                            <div className="accordion-list">
                                <div className="accordion-item expanded card">
                                    <div className="accordion-header">
                                        <h3>Section 1: Introduction to Cloud Architecture</h3>
                                        <span>5 lectures • 42min</span>
                                    </div>
                                    <div className="accordion-body">
                                        <div className="lecture-row">
                                            <div className="lecture-title"><Play size={16} className="text-primary" /> 1. Welcome to the Course</div>
                                            <span className="lecture-time text-accent text-sm font-bold">Preview</span>
                                        </div>
                                        <div className="lecture-row">
                                            <div className="lecture-title"><Play size={16} className="text-muted" /> 2. Setting up your environment</div>
                                            <span className="lecture-time">10:22</span>
                                        </div>
                                        <div className="lecture-row">
                                            <div className="lecture-title"><Play size={16} className="text-muted" /> 3. AWS Architecture Overview</div>
                                            <span className="lecture-time">15:45</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="accordion-item card collapsed">
                                    <div className="accordion-header">
                                        <h3>Section 2: Building the Frontend Layer</h3>
                                        <span>12 lectures • 3h 15min</span>
                                    </div>
                                </div>

                                <div className="accordion-item card collapsed">
                                    <div className="accordion-header">
                                        <h3>Section 3: Designing the API Server</h3>
                                        <span>8 lectures • 2h 05min</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Overview Section */}
                    {activeTab === 'overview' && (
                        <div className="tab-content card animate-fade-up">
                            <h2 className="section-title">What you'll learn</h2>
                            <ul className="learning-outcomes mb-4">
                                <li><Check size={20} className="text-accent" /> Build completely custom, full-stack applications</li>
                                <li><Check size={20} className="text-accent" /> Deploy scalable systems on Amazon Web Services</li>
                                <li><Check size={20} className="text-accent" /> Implement JWT User Authentication and Roles</li>
                                <li><Check size={20} className="text-accent" /> Master modern UI design with responsive CSS</li>
                            </ul>
                            <h2 className="section-title mt-4">Requirements</h2>
                            <ul className="requirements-list">
                                <li>Basic understanding of HTML, CSS, and JavaScript.</li>
                                <li>A functional computer setup (Windows/Mac/Linux).</li>
                                <li>No prior cloud experience required.</li>
                            </ul>
                        </div>
                    )}
                </div>

                {/* Floating Sidebar */}
                <div className="sidebar-column">
                    <div className="enrollment-card card floating-sidebar shrink-animation">
                        <div className="cover-img-placeholder relative">
                            <div className="play-overlay"><Play size={48} fill="white" /></div>
                        </div>

                        <div className="enrollment-body">
                            <div className="price-tag text-primary">$99.00</div>

                            <button
                                className="btn btn-primary w-full enroll-btn pulse-glow-btn mb-3"
                                onClick={handleEnroll}
                            >
                                Add to Cart
                            </button>

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
                                    onClick={() => alert(`Link copied to clipboard: https://hexoria.app/course/1`)}
                                >
                                    <Share2 size={20} />
                                </button>
                            </div>

                            <div className="course-includes text-muted">
                                <h4 className="text-dark mb-2 font-bold">This course includes:</h4>
                                <div className="include-item"><Play size={16} /> 45 hours on-demand video</div>
                                <div className="include-item"><Check size={16} /> 15 Downloadable resources</div>
                                <div className="include-item"><Award size={16} /> Certificate of completion</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
