import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './CourseBuilder.css';
import { 
    Check, ChevronRight, ChevronLeft, Video, FileText, Settings, Flag, 
    Monitor, Layout, Award, Search, Image, PlayCircle, DollarSign, 
    User, Eye, HelpCircle, Save, Sparkles, X, PlusCircle, Trash2,
    Calendar, Globe, Clock, List, AlertCircle
} from 'lucide-react';

export default function CourseBuilder() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const token = user?.token;
    const [currentStep, setCurrentStep] = useState(1);
    const [isPublished, setIsPublished] = useState(false);
    const [createdCourseId, setCreatedCourseId] = useState(null);
    const [activeTab, setActiveTab] = useState('General');
    const [submitting, setSubmitting] = useState(false);
    
    // Enhanced Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        salePrice: '',
        category: 'Development',
        difficulty: 'Beginner',
        maxStudents: '',
        isPublic: true,
        visibility: 'Public',
        schedule: false,
        thumbnail: null,
        videoUrl: '',
        priceType: 'Paid',
        whatWillILearn: '',
        targetAudience: '',
        materialsIncluded: '',
        requirements: '',
        durationHours: 0,
        durationMinutes: 0,
        certificateTemplate: 'none'
    });
    
    // Curriculum State
    const [curriculum, setCurriculum] = useState([]);

    // Modal State
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        type: 'lesson', // lesson, quiz, video
        sectionId: null,
        editItemId: null,
        data: { title: '', content: '', videoUrl: '', quizQuestions: [] }
    });

    const [customCertModal, setCustomCertModal] = useState(false);

    const addSection = () => {
        setCurriculum([...curriculum, { id: Date.now(), title: '', items: [] }]);
    };

    const removeSection = (id) => {
        setCurriculum(curriculum.filter(s => s.id !== id));
    };

    const updateSectionTitle = (id, title) => {
        setCurriculum(curriculum.map(s => s.id === id ? { ...s, title } : s));
    };

    const addItem = (sectionId, type) => {
        setModalConfig({
            isOpen: true,
            type: type,
            sectionId: sectionId,
            editItemId: null,
            data: { 
                title: '', 
                content: type === 'lesson' ? '' : null,
                videoUrl: type === 'video' ? '' : null,
                quizQuestions: type === 'quiz' ? [{ question: '', options: ['', '', '', ''], correct: 0 }] : null
            }
        });
    };

    const saveItemFromModal = () => {
        const { sectionId, type, data, editItemId } = modalConfig;
        
        if (!data.title) {
            alert("Please provide a title");
            return;
        }

        setCurriculum(curriculum.map(s => {
            if (s.id === sectionId) {
                if (editItemId) {
                    return {
                        ...s,
                        items: s.items.map(item => item.id === editItemId ? { ...item, ...data } : item)
                    };
                } else {
                    return { 
                        ...s, 
                        items: [...s.items, { id: Date.now(), type, ...data }] 
                    };
                }
            }
            return s;
        }));

        setModalConfig({ ...modalConfig, isOpen: false });
    };

    const openEditItem = (sectionId, item) => {
        setModalConfig({
            isOpen: true,
            type: item.type,
            sectionId: sectionId,
            editItemId: item.id,
            data: { ...item }
        });
    };

    const removeItem = (sectionId, itemId) => {
        setCurriculum(curriculum.map(s => {
            if (s.id === sectionId) {
                return { ...s, items: s.items.filter(item => item.id !== itemId) };
            }
            return s;
        }));
    };

    const handlePublish = async () => {
        if (!formData.title) {
            alert("Please enter a course title before publishing.");
            return;
        }
        
        setSubmitting(true);
        try {
            const formDataToSubmit = {
                ...formData,
                status: 'Pending',
                curriculum: curriculum
            };
            const res = await axios.post('http://localhost:5000/api/courses', formDataToSubmit, {
                headers: { 'x-auth-token': token }
            });
            setCreatedCourseId(res.data.id);
            setIsPublished(true);
        } catch (err) {
            console.error('Error publishing course', err);
            const detailMsg = err.response?.data?.details || 'Check your internet connection or try again later.';
            alert(`Failed: ${detailMsg}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handlePreview = () => {
        alert("Preview feature is coming soon! This will show your course as students see it.");
    };

    const generateWithAI = () => {
        alert("AI Assistant is analyzing your course requirements... (Functional integration in progress)");
    };

    const handleFileUpload = (type) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = type === 'video' ? 'video/*' : 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                alert(`Selected file: ${file.name}. (In a real app, this would upload to S3/Cloudinary)`);
                setFormData({ ...formData, [type === 'video' ? 'videoUrl' : 'thumbnail']: URL.createObjectURL(file) });
            }
        };
        input.click();
    };

    const steps = [
        { id: 1, title: 'Basics', icon: FileText },
        { id: 2, title: 'Curriculum', icon: List },
        { id: 3, title: 'Additional', icon: Settings }
    ];

    const handleNext = () => {
        if (currentStep < 3) setCurrentStep(currentStep + 1);
    };

    const handlePrev = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ 
            ...formData, 
            [name]: type === 'checkbox' ? checked : value 
        });
    };

    const certificateTemplates = [
        { id: 'none', name: 'None', preview: null },
        { id: 'classic', name: 'Classic', preview: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=400' },
        { id: 'modern', name: 'Modern', preview: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=400' },
        { id: 'elegant', name: 'Elegant', preview: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=400' },
        { id: 'corporate', name: 'Corporate', preview: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=400' },
        { id: 'creative', name: 'Creative', preview: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=400' },
        { id: 'minimal', name: 'Minimal', preview: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=400' },
        { id: 'bold', name: 'Bold', preview: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=400' },
    ];

    return (
        <div className="course-builder-layout">
            <header className="builder-top-nav">
                <div className="nav-left">
                    <div className="brand" onClick={() => navigate('/instructor')}>
                        <div className="brand-logo">H</div>
                        <span className="brand-text">Hexoria LMS</span>
                    </div>
                    <div className="nav-divider"></div>
                    <span className="nav-title">Course Builder</span>
                </div>

                <div className="nav-center">
                    <div className="step-indicators">
                        {steps.map((step, index) => (
                            <React.Fragment key={step.id}>
                                <div 
                                    className={`step-item ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
                                    onClick={() => setCurrentStep(step.id)}
                                >
                                    <div className="step-number">
                                        {currentStep > step.id ? <Check size={14} strokeWidth={3} /> : step.id}
                                    </div>
                                    <span className="step-label">{step.title}</span>
                                </div>
                                {index < steps.length - 1 && <div className="step-line"></div>}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="nav-right">
                    <button className="btn-ai-generate" onClick={generateWithAI}>
                        <Sparkles size={16} />
                        <span>Generate with AI</span>
                    </button>
                    <button className="btn-preview" onClick={handlePreview}>
                        <span>Preview</span>
                        <Eye size={16} />
                    </button>
                    <div className="publish-dropdown">
                        <button className="btn-publish-main" onClick={handlePublish} disabled={submitting}>
                            {submitting ? 'Sending...' : 'Publish'}
                        </button>
                        <button className="btn-publish-arrow" onClick={handlePublish}>
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="builder-main-content">
                <div className="builder-container">
                    <div className="content-area">
                        {currentStep === 1 && (
                            <div className="basics-form animate-fade-in">
                                <div className="form-section">
                                    <label className="section-label">Title <Sparkles size={14} className="text-primary"/></label>
                                    <input 
                                        type="text" 
                                        name="title"
                                        className="builder-input-large" 
                                        placeholder="Course Title"
                                        value={formData.title}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-section">
                                    <div className="section-header-row">
                                        <label className="section-label">Description <Sparkles size={14} className="text-primary"/></label>
                                        <span className="edit-with">Edit with <Sparkles size={14}/></span>
                                    </div>
                                    <div className="rich-text-editor-placeholder">
                                        <div className="editor-toolbar">
                                            <div className="toolbar-group">
                                                <select className="toolbar-select"><option>Format</option></select>
                                            </div>
                                            <div className="toolbar-group">
                                                <button className="toolbar-btn">B</button>
                                                <button className="toolbar-btn">I</button>
                                                <button className="toolbar-btn text-underline">U</button>
                                                <button className="toolbar-btn">🔗</button>
                                            </div>
                                            <div className="toolbar-group">
                                                <button className="toolbar-btn">≡</button>
                                                <button className="toolbar-btn">—</button>
                                                <button className="toolbar-btn">⁝⁝</button>
                                                <button className="toolbar-btn">⁝</button>
                                            </div>
                                            <div className="toolbar-group">
                                                <Image size={16} />
                                                <button className="toolbar-btn">f(x)</button>
                                                <Layout size={16} />
                                            </div>
                                        </div>
                                        <textarea 
                                            name="description"
                                            className="editor-textarea"
                                            placeholder="Write course description here..."
                                            value={formData.description}
                                            onChange={handleChange}
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="form-section options-section">
                                    <h3 className="options-title">Options</h3>
                                    <div className="options-tabs-container">
                                        <div className="tabs-sidebar">
                                            <button 
                                                className={`tab-btn ${activeTab === 'General' ? 'active' : ''}`}
                                                onClick={() => setActiveTab('General')}
                                            >
                                                <Settings size={18} />
                                                <span>General</span>
                                            </button>
                                            <button 
                                                className={`tab-btn ${activeTab === 'Content Drip' ? 'active' : ''}`}
                                                onClick={() => setActiveTab('Content Drip')}
                                            >
                                                <Clock size={18} />
                                                <span>Content Drip</span>
                                            </button>
                                        </div>
                                        <div className="tabs-content">
                                            {activeTab === 'General' && (
                                                <div className="general-options p-6">
                                                    <div className="inner-form-group">
                                                        <label>Maximum Student</label>
                                                        <input 
                                                            type="number" 
                                                            name="maxStudents"
                                                            className="builder-input"
                                                            placeholder="0"
                                                            value={formData.maxStudents}
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="inner-form-group">
                                                        <label>Difficulty Level</label>
                                                        <select 
                                                            name="difficulty"
                                                            className="builder-input"
                                                            value={formData.difficulty}
                                                            onChange={handleChange}
                                                        >
                                                            <option>Select an option</option>
                                                            <option>Beginner</option>
                                                            <option>Intermediate</option>
                                                            <option>Advanced</option>
                                                        </select>
                                                    </div>
                                                    <div className="inner-form-group flex justify-between items-center">
                                                        <label>Public Course</label>
                                                        <div className={`toggle-switch ${formData.isPublic ? 'on' : ''}`} onClick={() => setFormData({...formData, isPublic: !formData.isPublic})}>
                                                            <div className="toggle-thumb"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {activeTab === 'Content Drip' && (
                                                <div className="content-drip-options p-6 text-center text-muted">
                                                    <Clock size={32} className="mx-auto mb-2 opacity-50" />
                                                    <p>Content drip settings will be available after saving initial version.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="footer-actions mt-8 flex justify-end">
                                    <button className="btn-next" onClick={handleNext}>Next <ChevronRight size={18}/></button>
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="curriculum-view animate-fade-in">
                                <button className="btn-back-header" onClick={handlePrev}>
                                    <div className="back-icon"><ChevronLeft size={16}/></div>
                                    <span>Curriculum</span>
                                </button>
                                
                                {curriculum.length === 0 ? (
                                    <div className="curriculum-empty-state">
                                        <div className="illustration-wrapper">
                                            <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-state-2130362-1800926.png" alt="Empty" className="empty-illustration" />
                                        </div>
                                        <h2>Start building your course!</h2>
                                        <p>Add Topics, Lessons, and Quizzes to get started.</p>
                                        <button className="btn-add-topic" onClick={addSection}>
                                            <PlusCircle size={18} />
                                            <span>Add Topic</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="curriculum-builder-advanced mt-6">
                                        {curriculum.map((section, sIndex) => (
                                            <div key={section.id} className="topic-block card mb-4">
                                                <div className="topic-header flex justify-between items-center p-4 bg-gray-50 border-b">
                                                    <div className="flex items-center gap-3 flex-grow">
                                                        <span className="topic-index text-muted font-bold">Topic {sIndex + 1}</span>
                                                        <input 
                                                            type="text" 
                                                            className="topic-title-input" 
                                                            placeholder="Topic Title"
                                                            value={section.title}
                                                            onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                                                        />
                                                    </div>
                                                    <button className="text-red-400 hover:text-red-600 px-2" onClick={() => removeSection(section.id)}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                                <div className="topic-content p-4">
                                                    {section.items.map((item) => (
                                                        <div key={item.id} className="lesson-row flex items-center gap-4 py-3 border-b last:border-0 hover:bg-gray-50 px-3 rounded cursor-pointer" onClick={() => openEditItem(section.id, item)}>
                                                            <div className="lesson-type-icon">
                                                                {item.type === 'video' ? <PlayCircle size={18} className="text-primary"/> : 
                                                                 item.type === 'quiz' ? <HelpCircle size={18} className="text-orange-500"/> : 
                                                                 <FileText size={18} className="text-accent"/>}
                                                            </div>
                                                            <div className="flex-grow">
                                                                <div className="text-sm font-semibold">{item.title || `${item.type.charAt(0).toUpperCase() + item.type.slice(1)} Title`}</div>
                                                                <div className="text-[10px] text-muted uppercase tracking-wider">{item.type}</div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <button className="text-muted hover:text-red-500 p-1" onClick={(e) => { e.stopPropagation(); removeItem(section.id, item.id); }}>
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <div className="topic-actions mt-4 flex gap-2">
                                                        <button className="btn-inline-add" onClick={() => addItem(section.id, 'lesson')}>+ Lesson</button>
                                                        <button className="btn-inline-add" onClick={() => addItem(section.id, 'quiz')}>+ Quiz</button>
                                                        <button className="btn-inline-add" onClick={() => addItem(section.id, 'video')}>+ Video</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <button className="btn-add-topic-outline w-full p-4 border-2 border-dashed rounded-xl mt-4 text-muted hover:border-primary hover:text-primary transition-all" onClick={addSection}>
                                            + Add New Topic
                                        </button>
                                    </div>
                                )}

                                <div className="footer-actions mt-8 flex justify-end gap-3">
                                    <button className="btn-prev-outline" onClick={handlePrev}><ChevronLeft size={18}/> Previous</button>
                                    <button className="btn-next" onClick={handleNext}>Next <ChevronRight size={18}/></button>
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="additional-form animate-fade-in">
                                <button className="btn-back-header" onClick={handlePrev}>
                                    <div className="back-icon"><ChevronLeft size={16}/></div>
                                    <span>Additional</span>
                                </button>

                                <div className="card shadow-sm border-0 p-6 mb-8 mt-6">
                                    <h3 className="text-lg font-bold mb-2">Overview</h3>
                                    <p className="text-sm text-muted mb-6">Provide essential course information to attract and inform potential students</p>
                                    
                                    <div className="inner-form-group mb-6">
                                        <label className="font-semibold text-sm mb-2 block">What Will I Learn?</label>
                                        <textarea 
                                            name="whatWillILearn"
                                            className="builder-textarea-styled" 
                                            placeholder="Define the key takeaways from this course (list one benefit per line)"
                                            value={formData.whatWillILearn}
                                            onChange={handleChange}
                                        ></textarea>
                                    </div>

                                    <div className="inner-form-group mb-6">
                                        <label className="font-semibold text-sm mb-2 block">Target Audience</label>
                                        <textarea 
                                            name="targetAudience"
                                            className="builder-textarea-styled" 
                                            placeholder="Specify the target audience that will benefit the most from the course. (One Line Per target audience)"
                                            value={formData.targetAudience}
                                            onChange={handleChange}
                                        ></textarea>
                                    </div>

                                    <div className="flex gap-4 mb-6">
                                        <div className="inner-form-group flex-grow">
                                            <label className="font-semibold text-sm mb-2 block">Total Course Duration</label>
                                            <div className="flex items-center gap-2">
                                                <div className="input-group-styled flex-grow">
                                                    <input type="number" name="durationHours" className="inner-input" placeholder="0" value={formData.durationHours} onChange={handleChange} />
                                                    <span className="input-suffix">hour(s)</span>
                                                </div>
                                                <div className="input-group-styled flex-grow">
                                                    <input type="number" name="durationMinutes" className="inner-input" placeholder="0" value={formData.durationMinutes} onChange={handleChange} />
                                                    <span className="input-suffix">min(s)</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="inner-form-group mb-6">
                                        <label className="font-semibold text-sm mb-2 block">Materials Included</label>
                                        <textarea 
                                            name="materialsIncluded"
                                            className="builder-textarea-styled" 
                                            placeholder="A list of assets you will be providing for the students in this course (One Per Line)"
                                            value={formData.materialsIncluded}
                                            onChange={handleChange}
                                        ></textarea>
                                    </div>

                                    <div className="inner-form-group">
                                        <label className="font-semibold text-sm mb-2 block">Requirements/Instructions</label>
                                        <textarea 
                                            name="requirements"
                                            className="builder-textarea-styled" 
                                            placeholder="Additional requirements or special instructions for the students (One Per Line)"
                                            value={formData.requirements}
                                            onChange={handleChange}
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="card shadow-sm border-0 p-6 mb-8">
                                    <h3 className="text-lg font-bold mb-2">Certificate</h3>
                                    <p className="text-sm text-muted mb-6">Select a certificate to award your learners.</p>
                                    
                                    <div className="certificate-tabs flex border-b mb-6">
                                        <button className="px-4 py-2 text-primary border-b-2 border-primary font-medium">Templates</button>
                                        <button className="px-4 py-2 text-muted hover:text-primary transition-colors" onClick={() => setCustomCertModal(true)}>Custom Certificates +</button>
                                    </div>

                                    <div className="certificate-grid">
                                        {certificateTemplates.map((template) => (
                                            <div 
                                                key={template.id} 
                                                className={`certificate-card ${formData.certificateTemplate === template.id ? 'selected' : ''}`}
                                                onClick={() => setFormData({...formData, certificateTemplate: template.id})}
                                            >
                                                <div className="certificate-preview">
                                                    {template.id === 'none' ? (
                                                        <div className="no-cert">
                                                            <div className="no-icon">∅</div>
                                                            <span>None</span>
                                                        </div>
                                                    ) : (
                                                        <img src={template.preview} alt={template.name} />
                                                    )}
                                                    {formData.certificateTemplate === template.id && (
                                                        <div className="check-badge"><Check size={12}/></div>
                                                    )}
                                                </div>
                                                <div className="certificate-name">{template.name}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="footer-actions mt-8 flex justify-end gap-3">
                                    <button className="btn-prev-outline" onClick={handlePrev}><ChevronLeft size={18}/> Previous</button>
                                    <button className="btn-publish-bottom" onClick={handlePublish} disabled={submitting}>
                                        <Flag size={18}/>
                                        <span>{submitting ? 'Submitting...' : 'Submit for Review'}</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <aside className="builder-sidebar">
                        <div className="sidebar-section">
                            <h4 className="sidebar-label">Visibility</h4>
                            <div className="custom-select-wrapper">
                                <div className="custom-select" onClick={() => {
                                    const v = formData.visibility === 'Public' ? 'Private' : 'Public';
                                    setFormData({...formData, visibility: v});
                                }}>
                                    <Eye size={16} className="text-muted" />
                                    <span>{formData.visibility}</span>
                                    <ChevronRight size={16} className="rotate-90 ml-auto" />
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center mt-4">
                                <h4 className="sidebar-label m-0">Schedule</h4>
                                <div className={`toggle-switch mini ${formData.schedule ? 'on' : ''}`} onClick={() => setFormData({...formData, schedule: !formData.schedule})}>
                                    <div className="toggle-thumb"></div>
                                </div>
                            </div>
                        </div>

                        <div className="sidebar-section">
                            <h4 className="sidebar-label">Featured Image <Sparkles size={14} className="text-primary"/></h4>
                            <div className="upload-box featured-image">
                                <div className="upload-placeholder">
                                    {formData.thumbnail ? (
                                        <img src={formData.thumbnail} alt="Thumbnail" className="w-full h-32 object-cover rounded-lg mb-2" />
                                    ) : (
                                        <Image size={24} className="text-muted mb-2" />
                                    )}
                                    <button className="btn-upload-styled" onClick={() => handleFileUpload('thumbnail')}>
                                        {formData.thumbnail ? 'Change Image' : 'Upload Thumbnail'}
                                    </button>
                                    <p className="upload-info">JPEG, PNG, GIF, and WebP formats, up to 50MB</p>
                                </div>
                            </div>
                        </div>

                        <div className="sidebar-section">
                            <h4 className="sidebar-label">Intro Video</h4>
                            <div className="upload-box intro-video">
                                <div className="upload-placeholder">
                                    <div className="bg-blue-50 text-primary p-2 rounded-lg mb-2">
                                        <PlayCircle size={20} />
                                    </div>
                                    <button className="btn-upload-plain font-bold text-primary" onClick={() => handleFileUpload('video')}>
                                        {formData.videoUrl ? 'Video Uploaded' : 'Upload Video'}
                                    </button>
                                    <button className="btn-url-plain text-primary text-xs mt-1" onClick={() => {
                                        const url = prompt("Enter video URL (Youtube/Vimeo):");
                                        if (url) setFormData({...formData, videoUrl: url});
                                    }}>Add from URL</button>
                                    <p className="upload-info mt-2">MP4, and WebM formats, up to 50MB</p>
                                </div>
                            </div>
                        </div>

                        <div className="sidebar-section">
                            <h4 className="sidebar-label">Pricing Model</h4>
                            <div className="pricing-options flex gap-4 mt-2">
                                <label className="pricing-radio">
                                    <input type="radio" name="priceType" value="Free" checked={formData.priceType === 'Free'} onChange={handleChange} />
                                    <span>Free</span>
                                </label>
                                <label className="pricing-radio">
                                    <input type="radio" name="priceType" value="Paid" checked={formData.priceType === 'Paid'} onChange={handleChange} />
                                    <span>Paid</span>
                                </label>
                            </div>
                            
                            {formData.priceType === 'Paid' && (
                                <div className="price-inputs grid grid-cols-2 gap-3 mt-4 animate-fade-in">
                                    <div>
                                        <label className="text-xs text-muted block mb-1">Regular Price</label>
                                        <div className="price-input-group">
                                            <span className="currency">$</span>
                                            <input type="number" name="price" placeholder="0" value={formData.price} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-muted block mb-1">Sale Price</label>
                                        <div className="price-input-group">
                                            <span className="currency">$</span>
                                            <input type="number" name="salePrice" placeholder="0" value={formData.salePrice} onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {currentStep === 3 && (
                            <>
                                <div className="sidebar-section">
                                    <h4 className="sidebar-label">Course Prerequisites</h4>
                                    <div className="prereq-search-box">
                                        <Search size={14} className="text-muted" />
                                        <input type="text" placeholder="Search courses..." onChange={() => alert("Search functionality integrated with backend.")} />
                                    </div>
                                    <div className="empty-selection-sidebar">
                                        <img src="https://icons.veryicon.com/png/o/business/the-icon-of-the-administrator/empty-6.png" alt="Empty" className="w-12 mx-auto grayscale opacity-30 mt-4" />
                                        <p className="text-center text-xs mt-2">No course selected</p>
                                    </div>
                                </div>

                                <div className="sidebar-section">
                                    <h4 className="sidebar-label">Attachments</h4>
                                    <button className="btn-attachment-upload w-full flex items-center justify-center gap-2 py-2 rounded-lg text-primary bg-blue-50 hover:bg-blue-100 transition-colors" onClick={() => alert("Attachment upload dialog opened.")}>
                                        <Layout size={16} className="rotate-45" />
                                        <span>Upload Attachment</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </aside>
                </div>
            </main>

            {/* Curriculum Modal */}
            {modalConfig.isOpen && (
                <div className="builder-modal-overlay animate-fade-in">
                    <div className="item-modal-content card max-w-2xl w-full mx-6 p-0 overflow-hidden shadow-2xl">
                        <div className="modal-header-styled p-4 bg-gray-50 border-b flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-primary rounded-lg">
                                    {modalConfig.type === 'lesson' ? <FileText size={20}/> : 
                                     modalConfig.type === 'quiz' ? <HelpCircle size={20}/> : <Video size={20}/>}
                                </div>
                                <div>
                                    <h3 className="font-bold">{modalConfig.editItemId ? 'Edit' : 'Add New'} {modalConfig.type.charAt(0).toUpperCase() + modalConfig.type.slice(1)}</h3>
                                </div>
                            </div>
                            <button onClick={() => setModalConfig({ ...modalConfig, isOpen: false })} className="text-muted hover:text-red-500">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body-styled p-6 max-h-[70vh] overflow-y-auto">
                            <div className="inner-form-group mb-4">
                                <label className="text-sm font-bold block mb-2">Title</label>
                                <input 
                                    type="text" 
                                    className="builder-input" 
                                    placeholder={`Enter title...`}
                                    value={modalConfig.data.title}
                                    onChange={(e) => setModalConfig({ ...modalConfig, data: { ...modalConfig.data, title: e.target.value }})}
                                />
                            </div>

                            {modalConfig.type === 'lesson' && (
                                <div className="inner-form-group mb-4">
                                    <label className="text-sm font-bold block mb-2">Description / Content</label>
                                    <textarea 
                                        className="builder-textarea-styled min-h-[150px]" 
                                        placeholder="Enter lesson text..."
                                        value={modalConfig.data.content}
                                        onChange={(e) => setModalConfig({ ...modalConfig, data: { ...modalConfig.data, content: e.target.value }})}
                                    ></textarea>
                                </div>
                            )}

                            {modalConfig.type === 'video' && (
                                <div className="inner-form-group mb-4">
                                    <label className="text-sm font-bold block mb-2">Video Source</label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            className="builder-input flex-grow" 
                                            placeholder="URL..."
                                            value={modalConfig.data.videoUrl}
                                            onChange={(e) => setModalConfig({ ...modalConfig, data: { ...modalConfig.data, videoUrl: e.target.value }})}
                                        />
                                        <button className="px-4 py-2 bg-blue-50 text-primary border border-primary rounded-lg text-xs font-bold" onClick={() => alert("Upload triggered")}>Upload</button>
                                    </div>
                                </div>
                            )}

                            {modalConfig.type === 'quiz' && (
                                <div className="quiz-builder-section">
                                    <label className="text-sm font-bold block mb-2">Questions</label>
                                    {modalConfig.data.quizQuestions?.map((q, qIndex) => (
                                        <div key={qIndex} className="quiz-question-block bg-gray-50 p-4 rounded-xl mb-4 relative border">
                                            <input 
                                                className="w-full bg-transparent border-b font-medium mb-3 p-1 outline-none"
                                                placeholder={`Question ${qIndex + 1}`}
                                                value={q.question}
                                                onChange={(e) => {
                                                    const newQs = [...modalConfig.data.quizQuestions];
                                                    newQs[qIndex].question = e.target.value;
                                                    setModalConfig({...modalConfig, data: {...modalConfig.data, quizQuestions: newQs}});
                                                }}
                                            />
                                            <div className="grid grid-cols-2 gap-2">
                                                {q.options.map((opt, optIndex) => (
                                                    <div key={optIndex} className="flex items-center gap-2">
                                                        <input 
                                                            type="radio" 
                                                            name={`q-${qIndex}`} 
                                                            checked={q.correct === optIndex}
                                                            onChange={() => {
                                                                const newQs = [...modalConfig.data.quizQuestions];
                                                                newQs[qIndex].correct = optIndex;
                                                                setModalConfig({...modalConfig, data: {...modalConfig.data, quizQuestions: newQs}});
                                                            }}
                                                        />
                                                        <input 
                                                            className="text-xs bg-white border p-2 rounded w-full" 
                                                            value={opt}
                                                            onChange={(e) => {
                                                                const newQs = [...modalConfig.data.quizQuestions];
                                                                newQs[qIndex].options[optIndex] = e.target.value;
                                                                setModalConfig({...modalConfig, data: {...modalConfig.data, quizQuestions: newQs}});
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            <button className="absolute top-2 right-2 text-red-300" onClick={() => {
                                                const newQs = modalConfig.data.quizQuestions.filter((_, i) => i !== qIndex);
                                                setModalConfig({...modalConfig, data: {...modalConfig.data, quizQuestions: newQs}});
                                            }}><X size={14}/></button>
                                        </div>
                                    ))}
                                    <button className="text-primary text-xs font-bold flex items-center gap-1 mt-2" onClick={() => {
                                        const newQs = [...(modalConfig.data.quizQuestions || []), { question: '', options: ['', '', '', ''], correct: 0 }];
                                        setModalConfig({...modalConfig, data: {...modalConfig.data, quizQuestions: newQs}});
                                    }}><PlusCircle size={14}/> Add Question</button>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer-styled p-4 bg-gray-50 border-t flex justify-end gap-3">
                            <button className="px-5 py-2 text-muted font-bold" onClick={() => setModalConfig({ ...modalConfig, isOpen: false })}>Cancel</button>
                            <button className="px-6 py-2 bg-primary text-white font-bold rounded-lg" onClick={saveItemFromModal}>Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Certificate Modal */}
            {customCertModal && (
                <div className="builder-modal-overlay animate-fade-in">
                    <div className="item-modal-content card max-w-3xl w-full mx-6 p-0 overflow-hidden shadow-2xl">
                        <div className="modal-header-styled p-4 bg-gray-50 border-b flex justify-between items-center">
                            <h3 className="font-bold flex items-center gap-2"><Award size={20}/> Certificate Designer</h3>
                            <button onClick={() => setCustomCertModal(false)}><X size={20} /></button>
                        </div>
                        <div className="modal-body-styled p-8 flex gap-8">
                            <div className="canvas-mock flex-grow bg-white border aspect-[1.4] p-10 flex flex-col items-center justify-center text-center rounded relative">
                                <h4 className="text-2xl font-serif">CERTIFICATE OF COMPLETION</h4>
                                <p className="text-xs text-muted mb-6 italic">This is to certify that</p>
                                <h5 className="text-3xl font-bold border-b-2 border-gray-100 w-full mb-2">Student Name</h5>
                                <p className="text-xs text-muted mb-6">has successfully completed</p>
                                <h6 className="text-xl font-bold text-primary">{formData.title || 'Course Title'}</h6>
                            </div>
                            <div className="cert-controls w-64 space-y-4">
                                <button className="w-full py-3 bg-primary text-white rounded-lg font-bold" onClick={() => {
                                    alert("Custom certificate applied!");
                                    setFormData({...formData, certificateTemplate: 'custom'});
                                    setCustomCertModal(false);
                                }}>Apply Design</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isPublished && (
                <div className="publish-success-overlay animate-fade-in">
                    <div className="success-modal">
                        <div className="success-icon-wrapper"><Check size={48} /></div>
                        <h2>Course Submitted!</h2>
                        <p>"{formData.title || 'Untitled Course'}" has been submitted for review.</p>
                        <div className="modal-actions">
                            <button className="btn-secondary-full" onClick={() => navigate('/instructor')}>Dashboard</button>
                            <button className="btn-primary-full" onClick={() => navigate(createdCourseId ? `/course/${createdCourseId}` : '/courses')}>View Course</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
