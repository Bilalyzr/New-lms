import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CourseBuilder.css';
import { Check, ChevronRight, Video, FileText, Settings, Flag } from 'lucide-react';

export default function CourseBuilder() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [isPublished, setIsPublished] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: 'Development',
    });

    const handlePublish = () => {
        setIsPublished(true);
    };

    const steps = [
        { id: 1, title: 'Basics', icon: FileText },
        { id: 2, title: 'Curriculum', icon: Video },
        { id: 3, title: 'Additional', icon: Settings },
        { id: 4, title: 'Publish', icon: Flag },
    ];

    const handleNext = () => {
        if (currentStep < 4) setCurrentStep(currentStep + 1);
    };

    const handlePrev = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="course-builder-page container">
            <div className="builder-header">
                <h1 className="page-title">Course Builder</h1>
                <p className="text-muted">Create your next masterpiece</p>
            </div>

            <div className="builder-card card">
                {/* Wizard Progress Bar */}
                <div className="wizard-progress">
                    {steps.map((step, index) => {
                        const StepIcon = step.icon;
                        const isActive = currentStep === step.id;
                        const isCompleted = currentStep > step.id;

                        return (
                            <div key={step.id} className="progress-step-container">
                                <div className={`progress-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                                    <div className="step-icon-wrapper">
                                        {isCompleted ? <Check size={18} /> : <StepIcon size={18} />}
                                    </div>
                                    <span className="step-title">{step.title}</span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`progress-line ${isCompleted ? 'completed-line' : ''}`}></div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Wizard Form Content */}
                <div className="wizard-content animate-fade-up">
                    {currentStep === 1 && (
                        <div className="form-step">
                            <h2 className="step-heading">Basic Information</h2>

                            <div className="form-group">
                                <label>Course Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    className="form-control"
                                    placeholder="e.g. Advanced AI Programming"
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Course Description</label>
                                <textarea
                                    className="form-control"
                                    name="description"
                                    rows={4}
                                    placeholder="What will students learn?"
                                    value={formData.description}
                                    onChange={handleChange}
                                ></textarea>
                            </div>

                            <div className="form-row">
                                <div className="form-group half">
                                    <label>Price ($)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        className="form-control"
                                        placeholder="99.99"
                                        value={formData.price}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group half">
                                    <label>Category</label>
                                    <select
                                        className="form-control"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                    >
                                        <option>Development</option>
                                        <option>Business</option>
                                        <option>Design</option>
                                        <option>Marketing</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="form-step">
                            <h2 className="step-heading">Curriculum</h2>
                            <p className="text-muted pb-4">Start putting together your course by creating sections and lectures.</p>

                            <div className="curriculum-builder">
                                <div className="curriculum-section card">
                                    <div className="section-header">
                                        <h4>Section 1: Introduction</h4>
                                    </div>
                                    <div className="lesson-item">
                                        <Video size={16} className="text-primary" />
                                        <span>1. Welcome to the course</span>
                                    </div>
                                    <div className="lesson-item">
                                        <Video size={16} className="text-primary" />
                                        <span>2. Setup & Installation</span>
                                    </div>
                                    <button
                                        className="btn-secondary add-lesson-btn mt-3"
                                        onClick={(e) => { e.preventDefault(); alert('Opening lesson upload modal...'); }}
                                    >
                                        + Add Lesson
                                    </button>
                                </div>

                                <button
                                    className="btn-secondary add-section-btn w-full mt-4"
                                    onClick={(e) => { e.preventDefault(); alert('Created new section framework.'); }}
                                >
                                    + Add New Section
                                </button>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="form-step">
                            <h2 className="step-heading">Additional Information</h2>

                            <div className="form-group">
                                <label>Requirements</label>
                                <textarea className="form-control" rows={3} placeholder="Basic knowledge of HTML..."></textarea>
                            </div>
                            <div className="form-group">
                                <label>Target Audience</label>
                                <textarea className="form-control" rows={3} placeholder="Who is this course for?"></textarea>
                            </div>
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="form-step text-center publish-step">
                            <Flag size={64} className="text-accent publish-icon mb-4 mx-auto" />
                            <h2 className="step-heading">Review & Publish</h2>
                            <p className="text-muted pb-4">You're almost there. Review your course settings and hit publish.</p>
                            <div className="course-summary-box card">
                                <h3>{formData.title || 'Untitled Course'}</h3>
                                <p>Category: <strong>{formData.category}</strong></p>
                                <p>Price: <strong className="text-accent">${formData.price || '0.00'}</strong></p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Wizard Footer Actions */}
                <div className="wizard-footer">
                    <button
                        className="btn btn-secondary"
                        onClick={handlePrev}
                        disabled={currentStep === 1}
                        style={{ opacity: currentStep === 1 ? 0 : 1 }}
                    >
                        Previous
                    </button>

                    {currentStep < 4 ? (
                        <button className="btn btn-primary" onClick={handleNext}>
                            Next Step <ChevronRight size={18} className="ml-2" />
                        </button>
                    ) : (
                        <button className="btn bg-accent text-white publish-btn-final flex items-center gap-2 px-6 py-2 rounded-lg" onClick={handlePublish}>
                            <Flag size={18} fill="currentColor" /> Publish Course
                        </button>
                    )}
                </div>

                {/* Publish Success Overlay */}
                {isPublished && (
                    <div className="publish-success-overlay animate-fade-in absolute inset-0 bg-white z-50 rounded-2xl flex flex-col items-center justify-center text-center p-8">
                        <div className="success-icon-large bg-accent-light text-accent rounded-full p-6 mb-6 inline-block scale-in">
                            <Check size={48} strokeWidth={3} />
                        </div>
                        <h2 className="text-3xl font-bold text-dark mb-2">Course Published!</h2>
                        <p className="text-muted text-lg mb-8 max-w-md">"{formData.title || 'Untitled Course'}" is now live and available for students to enroll.</p>

                        <div className="flex gap-4">
                            <button className="btn btn-secondary px-6" onClick={() => navigate('/instructor')}>Return to Dashboard</button>
                            <button className="btn btn-primary px-6" onClick={() => navigate(`/course/1`)}>View Course</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
