import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './CourseBuilder.css';
import {
    Check, ChevronRight, ChevronLeft, Video, FileText, Settings, Flag,
    Image, PlayCircle, DollarSign, Eye, HelpCircle, Sparkles, X,
    Trash2, Globe, Clock, Plus, GripVertical, Play, Edit3, ChevronDown,
    ArrowLeft, Upload, Link, Paperclip, Search, ToggleLeft, ToggleRight,
    BookOpen, ClipboardList, Save
} from 'lucide-react';

const certificateTemplates = [
    { id: 'none', name: 'None' },
    { id: 'classic', name: 'Classic Blue' },
    { id: 'modern', name: 'Modern Minimal' },
    { id: 'vibrant', name: 'Vibrant Color' },
    { id: 'elegant', name: 'Elegant Script' },
    { id: 'premium', name: 'Premium Gold' }
];

// SVG certificate preview renders
const CertPreview = ({ templateId }) => {
    switch (templateId) {
        case 'classic':
            return (
                <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="cb-cert-svg">
                    <rect width="200" height="140" rx="4" fill="#F8FAFC"/>
                    <rect x="8" y="8" width="184" height="124" rx="2" stroke="#4361EE" strokeWidth="1.5" strokeDasharray="4 2"/>
                    <rect x="14" y="14" width="172" height="112" rx="1" stroke="#4361EE" strokeWidth="0.5" opacity="0.3"/>
                    <text x="100" y="36" textAnchor="middle" fill="#4361EE" fontSize="8" fontWeight="600" fontFamily="serif">CERTIFICATE</text>
                    <text x="100" y="48" textAnchor="middle" fill="#64748B" fontSize="5" fontFamily="serif">OF ACHIEVEMENT</text>
                    <line x1="50" y1="55" x2="150" y2="55" stroke="#E2E8F0" strokeWidth="0.5"/>
                    <text x="100" y="68" textAnchor="middle" fill="#94A3B8" fontSize="5">This is to certify that</text>
                    <rect x="60" y="74" width="80" height="6" rx="1" fill="#E8EDFB"/>
                    <text x="100" y="92" textAnchor="middle" fill="#94A3B8" fontSize="4.5">has successfully completed</text>
                    <rect x="55" y="97" width="90" height="5" rx="1" fill="#E8EDFB"/>
                    <line x1="30" y1="115" x2="80" y2="115" stroke="#CBD5E1" strokeWidth="0.5"/>
                    <line x1="120" y1="115" x2="170" y2="115" stroke="#CBD5E1" strokeWidth="0.5"/>
                    <text x="55" y="122" textAnchor="middle" fill="#94A3B8" fontSize="3.5">Instructor</text>
                    <text x="145" y="122" textAnchor="middle" fill="#94A3B8" fontSize="3.5">Date</text>
                    <circle cx="100" cy="115" r="8" fill="none" stroke="#4361EE" strokeWidth="0.5" opacity="0.4"/>
                </svg>
            );
        case 'modern':
            return (
                <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="cb-cert-svg">
                    <rect width="200" height="140" rx="4" fill="#FFFFFF"/>
                    <rect x="0" y="0" width="6" height="140" fill="#1E293B"/>
                    <rect x="6" y="0" width="2" height="140" fill="#4361EE"/>
                    <text x="24" y="30" fill="#1E293B" fontSize="6" fontWeight="300" fontFamily="sans-serif" letterSpacing="3">CERTIFICATE</text>
                    <text x="24" y="40" fill="#4361EE" fontSize="4.5" fontFamily="sans-serif" letterSpacing="1">OF COMPLETION</text>
                    <line x1="24" y1="48" x2="80" y2="48" stroke="#4361EE" strokeWidth="1"/>
                    <text x="24" y="62" fill="#94A3B8" fontSize="4">Awarded to</text>
                    <rect x="24" y="67" width="100" height="7" rx="1" fill="#F1F5F9"/>
                    <text x="24" y="88" fill="#94A3B8" fontSize="4">For completing</text>
                    <rect x="24" y="93" width="120" height="6" rx="1" fill="#F1F5F9"/>
                    <rect x="24" y="118" width="50" height="4" rx="1" fill="#E2E8F0"/>
                    <rect x="90" y="118" width="50" height="4" rx="1" fill="#E2E8F0"/>
                    <text x="49" y="128" textAnchor="middle" fill="#94A3B8" fontSize="3">Signature</text>
                    <text x="115" y="128" textAnchor="middle" fill="#94A3B8" fontSize="3">Date</text>
                </svg>
            );
        case 'vibrant':
            return (
                <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="cb-cert-svg">
                    <rect width="200" height="140" rx="4" fill="#FFFFFF"/>
                    <polygon points="0,0 60,0 0,60" fill="#4361EE" opacity="0.9"/>
                    <polygon points="200,0 160,0 200,40" fill="#F59E0B" opacity="0.9"/>
                    <polygon points="200,140 200,100 160,140" fill="#EF4444" opacity="0.7"/>
                    <polygon points="0,140 0,110 30,140" fill="#22C55E" opacity="0.7"/>
                    <text x="100" y="38" textAnchor="middle" fill="#1E293B" fontSize="9" fontWeight="700" fontFamily="sans-serif">Certificate</text>
                    <text x="100" y="50" textAnchor="middle" fill="#4361EE" fontSize="5" fontFamily="sans-serif">OF ACHIEVEMENT</text>
                    <text x="100" y="66" textAnchor="middle" fill="#94A3B8" fontSize="4">This certifies that</text>
                    <rect x="55" y="71" width="90" height="7" rx="2" fill="#EEF0FF"/>
                    <text x="100" y="90" textAnchor="middle" fill="#94A3B8" fontSize="4">has completed the course</text>
                    <rect x="50" y="95" width="100" height="6" rx="2" fill="#FEF3C7"/>
                    <circle cx="100" cy="118" r="10" fill="none" stroke="#F59E0B" strokeWidth="1"/>
                    <text x="100" y="121" textAnchor="middle" fill="#F59E0B" fontSize="7">&#9733;</text>
                </svg>
            );
        case 'elegant':
            return (
                <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="cb-cert-svg">
                    <rect width="200" height="140" rx="4" fill="#FFFBF5"/>
                    <rect x="10" y="10" width="180" height="120" rx="2" stroke="#D4A574" strokeWidth="1"/>
                    <rect x="14" y="14" width="172" height="112" rx="1" stroke="#D4A574" strokeWidth="0.3"/>
                    <path d="M80 22 Q100 18 120 22" stroke="#D4A574" strokeWidth="0.5" fill="none"/>
                    <path d="M80 24 Q100 28 120 24" stroke="#D4A574" strokeWidth="0.5" fill="none"/>
                    <text x="100" y="40" textAnchor="middle" fill="#8B6914" fontSize="9" fontWeight="400" fontFamily="serif" fontStyle="italic">Certificate</text>
                    <text x="100" y="52" textAnchor="middle" fill="#B8860B" fontSize="5" fontFamily="serif" letterSpacing="2">of Excellence</text>
                    <line x1="60" y1="58" x2="140" y2="58" stroke="#D4A574" strokeWidth="0.3"/>
                    <text x="100" y="70" textAnchor="middle" fill="#94A3B8" fontSize="4" fontFamily="serif">Presented to</text>
                    <rect x="55" y="75" width="90" height="7" rx="1" fill="#FEF7ED"/>
                    <text x="100" y="94" textAnchor="middle" fill="#94A3B8" fontSize="4" fontFamily="serif">in recognition of completing</text>
                    <rect x="50" y="98" width="100" height="6" rx="1" fill="#FEF7ED"/>
                    <path d="M90 112 L95 118 L100 108 L105 118 L110 112" stroke="#D4A574" strokeWidth="0.8" fill="none"/>
                    <line x1="30" y1="120" x2="75" y2="120" stroke="#D4A574" strokeWidth="0.3"/>
                    <line x1="125" y1="120" x2="170" y2="120" stroke="#D4A574" strokeWidth="0.3"/>
                </svg>
            );
        case 'premium':
            return (
                <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="cb-cert-svg">
                    <rect width="200" height="140" rx="4" fill="#1E293B"/>
                    <rect x="6" y="6" width="188" height="128" rx="2" stroke="#F59E0B" strokeWidth="1" opacity="0.6"/>
                    <rect x="10" y="10" width="180" height="120" rx="1" stroke="#F59E0B" strokeWidth="0.5" opacity="0.3"/>
                    <line x1="0" y1="0" x2="30" y2="0" stroke="#F59E0B" strokeWidth="3"/>
                    <line x1="0" y1="0" x2="0" y2="30" stroke="#F59E0B" strokeWidth="3"/>
                    <line x1="200" y1="0" x2="170" y2="0" stroke="#F59E0B" strokeWidth="3"/>
                    <line x1="200" y1="0" x2="200" y2="30" stroke="#F59E0B" strokeWidth="3"/>
                    <line x1="0" y1="140" x2="30" y2="140" stroke="#F59E0B" strokeWidth="3"/>
                    <line x1="0" y1="140" x2="0" y2="110" stroke="#F59E0B" strokeWidth="3"/>
                    <line x1="200" y1="140" x2="170" y2="140" stroke="#F59E0B" strokeWidth="3"/>
                    <line x1="200" y1="140" x2="200" y2="110" stroke="#F59E0B" strokeWidth="3"/>
                    <text x="100" y="32" textAnchor="middle" fill="#F59E0B" fontSize="8" fontWeight="700" fontFamily="serif" letterSpacing="3">CERTIFICATE</text>
                    <text x="100" y="44" textAnchor="middle" fill="#FCD34D" fontSize="5" fontFamily="serif" letterSpacing="1">OF DISTINCTION</text>
                    <line x1="60" y1="50" x2="140" y2="50" stroke="#F59E0B" strokeWidth="0.5" opacity="0.5"/>
                    <text x="100" y="64" textAnchor="middle" fill="#94A3B8" fontSize="4">This is proudly presented to</text>
                    <rect x="55" y="69" width="90" height="7" rx="1" fill="#334155"/>
                    <text x="100" y="88" textAnchor="middle" fill="#94A3B8" fontSize="4">for outstanding completion of</text>
                    <rect x="50" y="92" width="100" height="6" rx="1" fill="#334155"/>
                    <circle cx="100" cy="114" r="10" fill="none" stroke="#F59E0B" strokeWidth="1"/>
                    <text x="100" y="117" textAnchor="middle" fill="#F59E0B" fontSize="8">&#9733;</text>
                    <line x1="25" y1="126" x2="70" y2="126" stroke="#F59E0B" strokeWidth="0.3"/>
                    <line x1="130" y1="126" x2="175" y2="126" stroke="#F59E0B" strokeWidth="0.3"/>
                </svg>
            );
        default:
            return null;
    }
};

export default function CourseBuilder() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const toast = useToast();
    const token = user?.token;
    const [currentStep, setCurrentStep] = useState('basics');
    const [loading, setLoading] = useState(false);
    const [activeOptionsTab, setActiveOptionsTab] = useState('General');

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        salePrice: '',
        category: 'Development',
        difficulty: '',
        maxStudents: '',
        isPublic: true,
        visibility: 'Public',
        schedule: false,
        thumbnail: null,
        promoVideo: null,
        priceType: 'Free',
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
        show: false,
        type: 'lesson',
        topicIdx: null,
        itemIdx: null,
        data: {}
    });

    // Video URL state
    const [videoUrlInput, setVideoUrlInput] = useState({ show: false, target: null, value: '' });
    // target: 'intro' for basics sidebar, 'lesson' for lesson modal

    // Quiz modal state
    const [quizTab, setQuizTab] = useState('details');
    const [questionTypeDropdown, setQuestionTypeDropdown] = useState(false);
    const [selectedQuestionIdx, setSelectedQuestionIdx] = useState(null);

    // Quiz settings defaults
    const defaultQuizSettings = {
        timeLimit: 0,
        timeLimitUnit: 'Minutes',
        feedbackMode: 'default',
        attemptsAllowed: 10,
        passingPercentage: 80,
        maxQuestions: 0,
        autoStart: false,
        questionLayout: 'single',
        questionOrder: 'random',
        hideQuizTime: false,
        shortAnswerCharLimit: 200,
    };

    const steps = [
        { id: 'basics', label: 'Basics', num: 1 },
        { id: 'curriculum', label: 'Curriculum', num: 2 },
        { id: 'additional', label: 'Additional', num: 3 }
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileUpload = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, [type]: URL.createObjectURL(file) }));
        }
    };

    // Convert YouTube/Vimeo/direct URLs to embeddable format
    const parseVideoUrl = (url) => {
        if (!url) return null;
        url = url.trim();

        // YouTube: various formats
        let match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        if (match) return { type: 'youtube', embedUrl: `https://www.youtube.com/embed/${match[1]}`, id: match[1] };

        // Vimeo
        match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
        if (match) return { type: 'vimeo', embedUrl: `https://player.vimeo.com/video/${match[1]}`, id: match[1] };

        // Direct video URL (mp4, webm, etc.)
        if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url) || url.startsWith('blob:')) {
            return { type: 'direct', embedUrl: url };
        }

        // Treat any other URL as a direct video source (user may paste a CDN link)
        return { type: 'direct', embedUrl: url };
    };

    const openVideoUrlInput = (target) => {
        setVideoUrlInput({ show: true, target, value: '' });
    };

    const submitVideoUrl = () => {
        const { target, value } = videoUrlInput;
        const parsed = parseVideoUrl(value);
        if (!parsed) {
            setVideoUrlInput(prev => ({ ...prev, show: false }));
            return;
        }

        if (target === 'intro') {
            setFormData(prev => ({
                ...prev,
                promoVideo: parsed.embedUrl,
                promoVideoType: parsed.type
            }));
        } else if (target === 'lesson') {
            setModalConfig(prev => ({
                ...prev,
                data: {
                    ...prev.data,
                    videoUrl: parsed.embedUrl,
                    videoType: parsed.type
                }
            }));
        }
        setVideoUrlInput({ show: false, target: null, value: '' });
    };

    const removeVideo = (target) => {
        if (target === 'intro') {
            setFormData(prev => ({ ...prev, promoVideo: null, promoVideoType: null }));
        } else if (target === 'lesson') {
            setModalConfig(prev => ({
                ...prev,
                data: { ...prev.data, videoUrl: null, videoType: null }
            }));
        }
    };

    // Render a video player based on type
    const renderVideoPlayer = (url, type, className) => {
        if (!url) return null;
        if (type === 'youtube' || type === 'vimeo') {
            return (
                <iframe
                    src={url}
                    className={className}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Video"
                ></iframe>
            );
        }
        return <video src={url} className={className} controls />;
    };

    const handleStepChange = (stepId) => {
        setCurrentStep(stepId);
    };

    const handleNext = () => {
        const currentIndex = steps.findIndex(s => s.id === currentStep);
        if (currentIndex < steps.length - 1) {
            setCurrentStep(steps[currentIndex + 1].id);
        }
    };

    const handlePrev = () => {
        const currentIndex = steps.findIndex(s => s.id === currentStep);
        if (currentIndex > 0) {
            setCurrentStep(steps[currentIndex - 1].id);
        }
    };

    // Curriculum Actions
    const addTopic = () => {
        setCurriculum([...curriculum, { id: Date.now(), title: '', items: [] }]);
    };

    const removeTopic = (idx) => {
        setCurriculum(curriculum.filter((_, i) => i !== idx));
    };

    const updateTopicTitle = (idx, title) => {
        const updated = [...curriculum];
        updated[idx].title = title;
        setCurriculum(updated);
    };

    const addItem = (topicIdx, type) => {
        const newItem = { id: Date.now(), type, title: '', content: '' };
        if (type === 'assignment') {
            newItem.timeLimit = 0;
            newItem.timeLimitUnit = 'Weeks';
            newItem.totalPoints = 10;
            newItem.passPoints = 5;
            newItem.fileUploadLimit = 1;
            newItem.maxFileSize = 2;
            newItem.allowResubmission = true;
            newItem.maxResubmissions = 5;
        }
        if (type === 'lesson') {
            newItem.videoPlaybackHour = 0;
            newItem.videoPlaybackMin = 0;
            newItem.videoPlaybackSec = 0;
        }
        if (type === 'quiz') {
            newItem.questions = [];
        }
        const updated = [...curriculum];
        updated[topicIdx].items.push(newItem);
        setCurriculum(updated);
    };

    const removeItem = (topicIdx, itemIdx) => {
        const updated = [...curriculum];
        updated[topicIdx].items.splice(itemIdx, 1);
        setCurriculum(updated);
    };

    const updateItemTitle = (topicIdx, itemIdx, title) => {
        const updated = [...curriculum];
        updated[topicIdx].items[itemIdx].title = title;
        setCurriculum(updated);
    };

    // Modal Actions
    const openModal = (topicIdx, itemIdx, type) => {
        setModalConfig({
            show: true,
            type,
            topicIdx,
            itemIdx,
            data: { ...curriculum[topicIdx].items[itemIdx] }
        });
        if (type === 'quiz') {
            setQuizTab('details');
            setQuestionTypeDropdown(false);
        }
    };

    const closeModal = () => {
        setModalConfig({ show: false, type: 'lesson', topicIdx: null, itemIdx: null, data: {} });
    };

    const saveModalData = () => {
        const { topicIdx, itemIdx, data } = modalConfig;
        const updated = [...curriculum];
        updated[topicIdx].items[itemIdx] = { ...updated[topicIdx].items[itemIdx], ...data };
        setCurriculum(updated);
        closeModal();
    };

    const updateModalData = (field, value) => {
        setModalConfig(prev => ({
            ...prev,
            data: { ...prev.data, [field]: value }
        }));
    };

    const handlePublish = async (saveStatus = 'Draft') => {
        if (!formData.title.trim()) {
            toast.warning('Please enter a course title.');
            setCurrentStep('basics');
            return;
        }

        // "Publish" sends to admin for approval (Pending), not directly Published
        const actualStatus = saveStatus === 'Published' ? 'Pending' : 'Draft';

        setLoading(true);
        try {
            // Map curriculum to the format the backend expects
            const mappedCurriculum = curriculum.map(topic => ({
                title: topic.title,
                items: topic.items.map(item => {
                    if (item.type === 'lesson') {
                        return {
                            type: 'video',
                            title: item.title,
                            link: item.videoUrl || ''
                        };
                    } else if (item.type === 'quiz') {
                        return {
                            type: 'quiz',
                            title: item.title,
                            quizQuestions: (item.questions || []).map(q => ({
                                question_text: q.text,
                                correct_answer: q.type === 'tf'
                                    ? (q.answers?.find(a => a.correct)?.text || 'True')
                                    : q.type === 'mc'
                                        ? String(q.answers?.findIndex(a => a.correct) ?? 0)
                                        : (q.answer || ''),
                                options: q.type === 'mc'
                                    ? (q.answers || []).map(a => a.text)
                                    : q.type === 'tf'
                                        ? ['True', 'False']
                                        : []
                            }))
                        };
                    } else {
                        // assignment → stored as doc type
                        return {
                            type: 'doc',
                            title: item.title,
                            link: ''
                        };
                    }
                })
            }));

            const payload = {
                title: formData.title.trim(),
                category: formData.category || 'Development',
                price: formData.priceType === 'Paid' ? parseFloat(formData.price) || 0 : 0,
                description: formData.description,
                status: actualStatus,
                image_url: formData.thumbnail || '',
                curriculum: mappedCurriculum
            };

            const res = await axios.post(
                'http://localhost:5000/api/courses',
                payload,
                { headers: { 'x-auth-token': token } }
            );

            if (res.data && res.data.id) {
                if (actualStatus === 'Pending') {
                    toast.success('Course submitted for admin approval! You can track its status on your dashboard.');
                } else {
                    toast.success('Course saved as draft successfully!');
                }
                navigate('/instructor/courses');
            }
        } catch (err) {
            console.error('Course save error:', err);
            const msg = err.response?.data?.details || err.response?.data?.message || 'Failed to save course. Please try again.';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    // ==================== RENDER BASICS ====================
    const renderBasics = () => (
        <div className="cb-two-column animate-fade-in">
            <div className="cb-main-col">
                {/* Title */}
                <div className="cb-field">
                    <label className="cb-label">Title <Sparkles size={14} className="cb-ai-icon" /></label>
                    <input
                        type="text"
                        name="title"
                        className="cb-input"
                        placeholder="Enter course title..."
                        value={formData.title}
                        onChange={handleChange}
                    />
                </div>

                {/* Description */}
                <div className="cb-field">
                    <div className="cb-label-row">
                        <label className="cb-label">Description <Sparkles size={14} className="cb-ai-icon" /></label>
                        <span className="cb-edit-with">Edit with <Sparkles size={12} /></span>
                    </div>
                    <div className="cb-editor">
                        <div className="cb-editor-toolbar">
                            <select className="cb-toolbar-select">
                                <option>Format</option>
                                <option>Heading 1</option>
                                <option>Heading 2</option>
                                <option>Paragraph</option>
                            </select>
                            <div className="cb-toolbar-divider"></div>
                            <button className="cb-toolbar-btn"><strong>B</strong></button>
                            <button className="cb-toolbar-btn"><em>I</em></button>
                            <button className="cb-toolbar-btn" style={{textDecoration: 'underline'}}>U</button>
                            <button className="cb-toolbar-btn">🔗</button>
                            <div className="cb-toolbar-divider"></div>
                            <button className="cb-toolbar-btn">≡</button>
                            <button className="cb-toolbar-btn">☰</button>
                            <button className="cb-toolbar-btn">⇒</button>
                            <button className="cb-toolbar-btn">⇐</button>
                            <div className="cb-toolbar-divider"></div>
                            <button className="cb-toolbar-btn">🖼</button>
                            <button className="cb-toolbar-btn">f(x)</button>
                            <button className="cb-toolbar-btn">⤢</button>
                        </div>
                        <textarea
                            name="description"
                            className="cb-editor-area"
                            placeholder="Write your course description..."
                            value={formData.description}
                            onChange={handleChange}
                        ></textarea>
                    </div>
                </div>

                {/* Options Section */}
                <div className="cb-options-box">
                    <h3 className="cb-options-title">Options</h3>
                    <div className="cb-options-body">
                        <div className="cb-options-tabs">
                            <button
                                className={`cb-opt-tab ${activeOptionsTab === 'General' ? 'active' : ''}`}
                                onClick={() => setActiveOptionsTab('General')}
                            >
                                <Settings size={16} /> General
                            </button>
                            <button
                                className={`cb-opt-tab ${activeOptionsTab === 'ContentDrip' ? 'active' : ''}`}
                                onClick={() => setActiveOptionsTab('ContentDrip')}
                            >
                                <Clock size={16} /> Content Drip
                            </button>
                        </div>
                        <div className="cb-options-content">
                            {activeOptionsTab === 'General' && (
                                <>
                                    <div className="cb-field">
                                        <label className="cb-label-sm">Maximum Student</label>
                                        <input
                                            type="number"
                                            name="maxStudents"
                                            className="cb-input-sm"
                                            value={formData.maxStudents}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="cb-field">
                                        <label className="cb-label-sm">Difficulty Level</label>
                                        <select
                                            name="difficulty"
                                            className="cb-select"
                                            value={formData.difficulty}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select an option</option>
                                            <option>Beginner</option>
                                            <option>Intermediate</option>
                                            <option>Advanced</option>
                                        </select>
                                    </div>
                                    <div className="cb-toggle-row">
                                        <label className="cb-label-sm">Public Course</label>
                                        <button
                                            className={`cb-toggle ${formData.isPublic ? 'on' : ''}`}
                                            onClick={() => setFormData(prev => ({...prev, isPublic: !prev.isPublic}))}
                                        >
                                            <span className="cb-toggle-thumb"></span>
                                        </button>
                                    </div>
                                </>
                            )}
                            {activeOptionsTab === 'ContentDrip' && (
                                <div className="cb-empty-tab">
                                    <p>Content drip settings allow you to schedule when content becomes available to students.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Next Button */}
                <div className="cb-step-nav" style={{justifyContent: 'flex-end'}}>
                    <button className="cb-btn-next" onClick={handleNext}>
                        Next <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="cb-sidebar-col">
                {/* Visibility */}
                <div className="cb-sidebar-card">
                    <label className="cb-label-sm">Visibility</label>
                    <select
                        name="visibility"
                        className="cb-select"
                        value={formData.visibility}
                        onChange={handleChange}
                    >
                        <option value="Public">🌐 Public</option>
                        <option value="Private">🔒 Private</option>
                        <option value="Password">🔑 Password Protected</option>
                    </select>
                    <div className="cb-toggle-row" style={{marginTop: '16px'}}>
                        <label className="cb-label-sm" style={{marginBottom: 0}}>Schedule</label>
                        <button
                            className={`cb-toggle ${formData.schedule ? 'on' : ''}`}
                            onClick={() => setFormData(prev => ({...prev, schedule: !prev.schedule}))}
                        >
                            <span className="cb-toggle-thumb"></span>
                        </button>
                    </div>
                </div>

                {/* Featured Image */}
                <div className="cb-sidebar-card">
                    <label className="cb-label-sm">Featured Image <Sparkles size={12} className="cb-ai-icon" /></label>
                    <div className="cb-upload-box" onClick={() => document.getElementById('thumb-input').click()}>
                        {formData.thumbnail ? (
                            <img src={formData.thumbnail} alt="Thumbnail" className="cb-upload-preview" />
                        ) : (
                            <>
                                <div className="cb-upload-icon"><Image size={28} color="#94A3B8" /></div>
                                <button className="cb-btn-upload" type="button">Upload Thumbnail</button>
                                <span className="cb-upload-hint">JPEG, PNG, GIF, and WebP formats, up to 50MB</span>
                            </>
                        )}
                        <input id="thumb-input" type="file" accept="image/*" hidden onChange={(e) => handleFileUpload(e, 'thumbnail')} />
                    </div>
                </div>

                {/* Intro Video */}
                <div className="cb-sidebar-card">
                    <label className="cb-label-sm">Intro Video</label>
                    {formData.promoVideo ? (
                        <div className="cb-video-preview-wrap">
                            {renderVideoPlayer(formData.promoVideo, formData.promoVideoType, 'cb-video-player')}
                            <button className="cb-btn-remove-video" onClick={() => removeVideo('intro')}>
                                <X size={14} /> Remove
                            </button>
                        </div>
                    ) : (
                        <div className="cb-upload-box">
                            <button className="cb-btn-upload-video" type="button" onClick={() => document.getElementById('video-input').click()}>
                                <Play size={14} /> Upload Video
                            </button>
                            <button className="cb-link-btn" onClick={() => openVideoUrlInput('intro')}>
                                Add from URL
                            </button>
                            <span className="cb-upload-hint">MP4, and WebM formats, up to 50MB</span>
                            <input id="video-input" type="file" accept="video/*" hidden onChange={(e) => handleFileUpload(e, 'promoVideo')} />
                        </div>
                    )}
                    {videoUrlInput.show && videoUrlInput.target === 'intro' && (
                        <div className="cb-url-input-bar">
                            <input
                                type="url"
                                className="cb-url-input"
                                placeholder="Paste YouTube, Vimeo, or direct video URL..."
                                value={videoUrlInput.value}
                                onChange={(e) => setVideoUrlInput(prev => ({ ...prev, value: e.target.value }))}
                                onKeyDown={(e) => e.key === 'Enter' && submitVideoUrl()}
                                autoFocus
                            />
                            <button className="cb-url-submit" onClick={submitVideoUrl}>Add</button>
                            <button className="cb-url-cancel" onClick={() => setVideoUrlInput({ show: false, target: null, value: '' })}>
                                <X size={14} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Pricing Model */}
                <div className="cb-sidebar-card">
                    <label className="cb-label-sm">Pricing Model</label>
                    <div className="cb-radio-group">
                        <label className="cb-radio">
                            <input type="radio" name="priceType" value="Free" checked={formData.priceType === 'Free'} onChange={handleChange} />
                            <span>Free</span>
                        </label>
                        <label className="cb-radio">
                            <input type="radio" name="priceType" value="Paid" checked={formData.priceType === 'Paid'} onChange={handleChange} />
                            <span>Paid</span>
                        </label>
                    </div>
                    {formData.priceType === 'Paid' && (
                        <div className="cb-price-row">
                            <div className="cb-price-field">
                                <label className="cb-label-xs">Regular Price</label>
                                <div className="cb-price-input">
                                    <span className="cb-currency">$</span>
                                    <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="0" />
                                </div>
                            </div>
                            <div className="cb-price-field">
                                <label className="cb-label-xs">Sale Price</label>
                                <div className="cb-price-input">
                                    <span className="cb-currency">$</span>
                                    <input type="number" name="salePrice" value={formData.salePrice} onChange={handleChange} placeholder="0" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    // ==================== RENDER CURRICULUM ====================
    const renderCurriculum = () => (
        <div className="cb-curriculum animate-fade-in">
            <button className="cb-back-btn" onClick={handlePrev}>
                <ArrowLeft size={20} />
            </button>
            <h2 className="cb-page-title">Curriculum</h2>

            {curriculum.length === 0 ? (
                <div className="cb-empty-state">
                    <div className="cb-empty-illustration">
                        <svg width="200" height="160" viewBox="0 0 200 160" fill="none">
                            <ellipse cx="100" cy="140" rx="80" ry="12" fill="#E8EDFB" />
                            <circle cx="90" cy="70" r="45" fill="#4361EE" />
                            <circle cx="90" cy="55" r="8" fill="white" />
                            <circle cx="75" cy="55" r="8" fill="white" />
                            <circle cx="82" cy="56" r="3" fill="#1E293B" />
                            <circle cx="96" cy="56" r="3" fill="#1E293B" />
                            <rect x="60" y="80" width="60" height="8" rx="2" fill="#FFC107" />
                            <rect x="60" y="92" width="60" height="6" rx="2" fill="#FFC107" opacity="0.7" />
                            <rect x="60" y="102" width="60" height="5" rx="2" fill="#FFC107" opacity="0.5" />
                            <circle cx="145" cy="85" r="20" fill="#4361EE" opacity="0.8" />
                            <circle cx="143" cy="80" r="4" fill="white" />
                            <circle cx="150" cy="80" r="4" fill="white" />
                            <circle cx="144" cy="81" r="1.5" fill="#1E293B" />
                            <circle cx="151" cy="81" r="1.5" fill="#1E293B" />
                        </svg>
                    </div>
                    <h2>Start building your course!</h2>
                    <p>Add Topics, Lessons, and Quizzes to get started.</p>
                    <button className="cb-btn-add-topic" onClick={addTopic}>
                        <Plus size={16} /> Add Topic
                    </button>
                </div>
            ) : (
                <div className="cb-topics-list">
                    {curriculum.map((topic, topicIdx) => (
                        <div key={topic.id} className="cb-topic-block">
                            <div className="cb-topic-header">
                                <div className="cb-topic-title-area">
                                    <GripVertical size={16} className="cb-drag-handle" />
                                    <input
                                        type="text"
                                        className="cb-topic-title-input"
                                        value={topic.title}
                                        placeholder={`Topic ${topicIdx + 1}`}
                                        onChange={(e) => updateTopicTitle(topicIdx, e.target.value)}
                                    />
                                </div>
                                <div className="cb-topic-actions">
                                    <button className="cb-icon-btn" onClick={() => removeTopic(topicIdx)}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="cb-topic-items">
                                {topic.items.map((item, itemIdx) => (
                                    <div key={item.id} className="cb-item-row">
                                        <div className="cb-item-left">
                                            <GripVertical size={14} className="cb-drag-handle" />
                                            <span className="cb-item-icon">
                                                {item.type === 'lesson' ? <PlayCircle size={16} /> :
                                                 item.type === 'quiz' ? <HelpCircle size={16} /> :
                                                 <ClipboardList size={16} />}
                                            </span>
                                            <input
                                                type="text"
                                                className="cb-item-title-input"
                                                value={item.title}
                                                placeholder={`${item.type.charAt(0).toUpperCase() + item.type.slice(1)} title...`}
                                                onChange={(e) => updateItemTitle(topicIdx, itemIdx, e.target.value)}
                                            />
                                            <span className="cb-item-type-badge">{item.type}</span>
                                        </div>
                                        <div className="cb-item-right">
                                            <button className="cb-btn-edit-item" onClick={() => openModal(topicIdx, itemIdx, item.type)}>
                                                <Edit3 size={14} /> Edit
                                            </button>
                                            <button className="cb-icon-btn danger" onClick={() => removeItem(topicIdx, itemIdx)}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <div className="cb-add-items-row">
                                    <button className="cb-btn-add-item" onClick={() => addItem(topicIdx, 'lesson')}>
                                        <Plus size={14} /> Lesson
                                    </button>
                                    <button className="cb-btn-add-item" onClick={() => addItem(topicIdx, 'quiz')}>
                                        <Plus size={14} /> Quiz
                                    </button>
                                    <button className="cb-btn-add-item" onClick={() => addItem(topicIdx, 'assignment')}>
                                        <Plus size={14} /> Assignment
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button className="cb-btn-add-topic outline" onClick={addTopic}>
                        <Plus size={16} /> Add Topic
                    </button>
                </div>
            )}

            {/* Step Navigation */}
            <div className="cb-step-nav">
                <button className="cb-btn-back" onClick={handlePrev}>
                    <ChevronLeft size={16} />
                </button>
                <button className="cb-btn-next" onClick={handleNext}>
                    Next <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );

    // ==================== RENDER ADDITIONAL ====================
    const renderAdditional = () => (
        <div className="cb-two-column animate-fade-in">
            <div className="cb-main-col">
                <button className="cb-back-btn" onClick={handlePrev}>
                    <ArrowLeft size={20} />
                </button>
                <h2 className="cb-page-title">Additional</h2>

                <div className="cb-card">
                    <div className="cb-card-header">
                        <h3>Overview</h3>
                        <p>Provide essential course information to attract and inform potential students</p>
                    </div>

                    <div className="cb-field">
                        <label className="cb-label-sm">What Will I Learn?</label>
                        <textarea
                            name="whatWillILearn"
                            className="cb-textarea"
                            placeholder="Define the key takeaways from this course (list one benefit per line)"
                            value={formData.whatWillILearn}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div className="cb-field">
                        <label className="cb-label-sm">Target Audience</label>
                        <textarea
                            name="targetAudience"
                            className="cb-textarea"
                            placeholder="Specify the target audience that will benefit the most from the course. (One Line Per target audience)"
                            value={formData.targetAudience}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div className="cb-field">
                        <label className="cb-label-sm">Total Course Duration</label>
                        <div className="cb-duration-row">
                            <div className="cb-duration-input">
                                <input
                                    type="number"
                                    name="durationHours"
                                    value={formData.durationHours}
                                    onChange={handleChange}
                                    min="0"
                                />
                                <span>hour(s)</span>
                            </div>
                            <div className="cb-duration-input">
                                <input
                                    type="number"
                                    name="durationMinutes"
                                    value={formData.durationMinutes}
                                    onChange={handleChange}
                                    min="0" max="59"
                                />
                                <span>min(s)</span>
                            </div>
                        </div>
                    </div>

                    <div className="cb-field">
                        <label className="cb-label-sm">Materials Included</label>
                        <textarea
                            name="materialsIncluded"
                            className="cb-textarea"
                            placeholder="A list of assets you will be providing for the students in this course (One Per Line)"
                            value={formData.materialsIncluded}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div className="cb-field">
                        <label className="cb-label-sm">Requirements/Instructions</label>
                        <textarea
                            name="requirements"
                            className="cb-textarea"
                            placeholder="Additional requirements or special instructions for the students (One Per Line)"
                            value={formData.requirements}
                            onChange={handleChange}
                        ></textarea>
                    </div>
                </div>

                {/* Certificate Section */}
                <div className="cb-card" style={{marginTop: '24px'}}>
                    <div className="cb-card-header">
                        <h3>Certificate</h3>
                        <p>Select a certificate to award your learners.</p>
                    </div>
                    <div className="cb-cert-tabs">
                        <button className="cb-cert-tab active">Templates</button>
                        <button className="cb-cert-tab">Custom Certificates</button>
                    </div>
                    <div className="cb-cert-grid">
                        {certificateTemplates.map((template) => (
                            <div
                                key={template.id}
                                className={`cb-cert-card ${formData.certificateTemplate === template.id ? 'selected' : ''}`}
                                onClick={() => setFormData({...formData, certificateTemplate: template.id})}
                            >
                                {formData.certificateTemplate === template.id && (
                                    <div className="cb-cert-check"><Check size={12} /></div>
                                )}
                                <div className="cb-cert-preview">
                                    {template.id === 'none' ? (
                                        <div className="cb-cert-none">
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="4" y1="4" x2="20" y2="20"/></svg>
                                            <span>None</span>
                                        </div>
                                    ) : (
                                        <CertPreview templateId={template.id} />
                                    )}
                                </div>
                                <div className="cb-cert-name">{template.name}</div>
                                {formData.certificateTemplate === template.id && template.id !== 'none' && (
                                    <div className="cb-cert-actions">
                                        <button className="cb-cert-action-btn" onClick={(e) => { e.stopPropagation(); toast.info(`Previewing: ${template.name}`); }}>Preview</button>
                                        <button className="cb-cert-action-btn primary" onClick={(e) => e.stopPropagation()}>Select</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit */}
                <div className="cb-step-nav">
                    <button className="cb-btn-back" onClick={handlePrev}>
                        <ChevronLeft size={16} />
                    </button>
                    <button className="cb-btn-publish" onClick={() => handlePublish('Published')} disabled={loading}>
                        <Check size={16} />
                        {loading ? 'Processing...' : 'Publish'}
                    </button>
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="cb-sidebar-col">
                {/* Course Prerequisites */}
                <div className="cb-sidebar-card">
                    <label className="cb-label-sm">Course Prerequisites</label>
                    <div className="cb-search-box">
                        <Search size={16} />
                        <input type="text" placeholder="Search courses for prerequisites" />
                    </div>
                    <div className="cb-prereq-empty">
                        <div className="cb-prereq-icon">🔑</div>
                        <p>No course selected</p>
                        <span>Select a course to add as a prerequisite.</span>
                    </div>
                </div>

                {/* Attachments */}
                <div className="cb-sidebar-card">
                    <label className="cb-label-sm">Attachments</label>
                    <button className="cb-btn-upload-attach">
                        <Paperclip size={16} /> Upload Attachment
                    </button>
                </div>
            </div>
        </div>
    );

    // ==================== RENDER LESSON MODAL ====================
    const renderLessonModal = () => (
        <div className="cb-modal-overlay" onClick={closeModal}>
            <div className="cb-modal" onClick={(e) => e.stopPropagation()}>
                <div className="cb-modal-header">
                    <div className="cb-modal-header-left">
                        <BookOpen size={20} />
                        <span className="cb-modal-title">Lesson</span>
                        <span className="cb-modal-divider">|</span>
                        <span className="cb-modal-subtitle">Topic: {curriculum[modalConfig.topicIdx]?.title || `Topic ${modalConfig.topicIdx + 1}`}</span>
                    </div>
                    <button className="cb-modal-close" onClick={closeModal}><X size={18} /></button>
                </div>
                <div className="cb-modal-body two-col">
                    <div className="cb-modal-left">
                        <div className="cb-field">
                            <label className="cb-label-sm">Name</label>
                            <input
                                type="text"
                                className="cb-input"
                                placeholder="Enter Lesson Name"
                                value={modalConfig.data.title || ''}
                                onChange={(e) => updateModalData('title', e.target.value)}
                            />
                        </div>
                        <div className="cb-field">
                            <label className="cb-label-sm">Content</label>
                            <div className="cb-editor compact">
                                <div className="cb-editor-toolbar">
                                    <button className="cb-toolbar-btn add-media">🖼 Add media</button>
                                    <div style={{flex: 1}}></div>
                                    <button className="cb-toolbar-btn">Visual</button>
                                    <button className="cb-toolbar-btn">Code</button>
                                </div>
                                <div className="cb-editor-toolbar">
                                    <select className="cb-toolbar-select"><option>Paragraph</option></select>
                                    <div className="cb-toolbar-divider"></div>
                                    <button className="cb-toolbar-btn"><strong>B</strong></button>
                                    <button className="cb-toolbar-btn"><em>I</em></button>
                                    <button className="cb-toolbar-btn" style={{textDecoration: 'underline'}}>U</button>
                                    <div className="cb-toolbar-divider"></div>
                                    <button className="cb-toolbar-btn">☰</button>
                                    <button className="cb-toolbar-btn">⁝</button>
                                    <button className="cb-toolbar-btn">❝</button>
                                    <div className="cb-toolbar-divider"></div>
                                    <button className="cb-toolbar-btn">≡</button>
                                    <button className="cb-toolbar-btn">≡</button>
                                    <button className="cb-toolbar-btn">≡</button>
                                    <button className="cb-toolbar-btn">≡</button>
                                    <div className="cb-toolbar-divider"></div>
                                    <button className="cb-toolbar-btn">🔗</button>
                                    <button className="cb-toolbar-btn">✂</button>
                                    <button className="cb-toolbar-btn">⊞</button>
                                    <button className="cb-toolbar-btn">{'{}'}</button>
                                    <button className="cb-toolbar-btn">⊞</button>
                                </div>
                                <textarea
                                    className="cb-editor-area"
                                    placeholder="Write lesson content..."
                                    value={modalConfig.data.content || ''}
                                    onChange={(e) => updateModalData('content', e.target.value)}
                                ></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="cb-modal-right">
                        <div className="cb-field">
                            <label className="cb-label-sm">Featured Image</label>
                            <div className="cb-upload-box small">
                                <div className="cb-upload-icon"><Image size={24} color="#94A3B8" /></div>
                                <button className="cb-btn-upload" type="button">Upload Image</button>
                                <span className="cb-upload-hint">JPEG, PNG, GIF, and WebP formats, up to 2.93 GB</span>
                            </div>
                        </div>
                        <div className="cb-field">
                            <label className="cb-label-sm">Video</label>
                            {modalConfig.data.videoUrl ? (
                                <div className="cb-video-preview-wrap small">
                                    {renderVideoPlayer(modalConfig.data.videoUrl, modalConfig.data.videoType, 'cb-video-player')}
                                    <button className="cb-btn-remove-video" onClick={() => removeVideo('lesson')}>
                                        <X size={14} /> Remove
                                    </button>
                                </div>
                            ) : (
                                <div className="cb-upload-box small">
                                    <button className="cb-btn-upload-video" type="button">
                                        <Play size={14} /> Upload Video
                                    </button>
                                    <button className="cb-link-btn" onClick={() => openVideoUrlInput('lesson')}>
                                        Add from URL
                                    </button>
                                    <span className="cb-upload-hint">MP4, and WebM formats, up to 2.93 GB</span>
                                </div>
                            )}
                            {videoUrlInput.show && videoUrlInput.target === 'lesson' && (
                                <div className="cb-url-input-bar">
                                    <input
                                        type="url"
                                        className="cb-url-input"
                                        placeholder="Paste YouTube, Vimeo, or direct video URL..."
                                        value={videoUrlInput.value}
                                        onChange={(e) => setVideoUrlInput(prev => ({ ...prev, value: e.target.value }))}
                                        onKeyDown={(e) => e.key === 'Enter' && submitVideoUrl()}
                                        autoFocus
                                    />
                                    <button className="cb-url-submit" onClick={submitVideoUrl}>Add</button>
                                    <button className="cb-url-cancel" onClick={() => setVideoUrlInput({ show: false, target: null, value: '' })}>
                                        <X size={14} />
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="cb-field">
                            <label className="cb-label-sm">Video Playback Time</label>
                            <div className="cb-playback-row">
                                <div className="cb-playback-input">
                                    <input type="number" value={modalConfig.data.videoPlaybackHour || 0} onChange={(e) => updateModalData('videoPlaybackHour', e.target.value)} min="0" />
                                    <span>hour</span>
                                </div>
                                <div className="cb-playback-input">
                                    <input type="number" value={modalConfig.data.videoPlaybackMin || 0} onChange={(e) => updateModalData('videoPlaybackMin', e.target.value)} min="0" />
                                    <span>min</span>
                                </div>
                                <div className="cb-playback-input">
                                    <input type="number" value={modalConfig.data.videoPlaybackSec || 0} onChange={(e) => updateModalData('videoPlaybackSec', e.target.value)} min="0" />
                                    <span>sec</span>
                                </div>
                            </div>
                        </div>
                        <div className="cb-field">
                            <label className="cb-label-sm">Exercise Files</label>
                            <button className="cb-btn-upload-attach">
                                <Paperclip size={16} /> Upload Attachment
                            </button>
                        </div>
                    </div>
                </div>
                <div className="cb-modal-footer">
                    <button className="cb-btn-cancel" onClick={closeModal}>Cancel</button>
                    <button className="cb-btn-save" onClick={saveModalData}>Save</button>
                </div>
            </div>
        </div>
    );

    // ==================== RENDER ASSIGNMENT MODAL ====================
    const renderAssignmentModal = () => (
        <div className="cb-modal-overlay" onClick={closeModal}>
            <div className="cb-modal" onClick={(e) => e.stopPropagation()}>
                <div className="cb-modal-header">
                    <div className="cb-modal-header-left">
                        <ClipboardList size={20} />
                        <span className="cb-modal-title">Assignment</span>
                        <span className="cb-modal-divider">|</span>
                        <span className="cb-modal-subtitle">Topic: {curriculum[modalConfig.topicIdx]?.title || `Topic ${modalConfig.topicIdx + 1}`}</span>
                    </div>
                    <button className="cb-modal-close" onClick={closeModal}><X size={18} /></button>
                </div>
                <div className="cb-modal-body two-col">
                    <div className="cb-modal-left">
                        <div className="cb-field">
                            <label className="cb-label-sm">Title</label>
                            <input
                                type="text"
                                className="cb-input"
                                placeholder="Enter Assignment Title"
                                value={modalConfig.data.title || ''}
                                onChange={(e) => updateModalData('title', e.target.value)}
                            />
                        </div>
                        <div className="cb-field">
                            <label className="cb-label-sm">Content</label>
                            <div className="cb-editor compact">
                                <div className="cb-editor-toolbar">
                                    <button className="cb-toolbar-btn add-media">🖼 Add media</button>
                                    <div style={{flex: 1}}></div>
                                    <button className="cb-toolbar-btn">Visual</button>
                                    <button className="cb-toolbar-btn">Code</button>
                                </div>
                                <div className="cb-editor-toolbar">
                                    <select className="cb-toolbar-select"><option>Paragraph</option></select>
                                    <div className="cb-toolbar-divider"></div>
                                    <button className="cb-toolbar-btn"><strong>B</strong></button>
                                    <button className="cb-toolbar-btn"><em>I</em></button>
                                    <button className="cb-toolbar-btn" style={{textDecoration: 'underline'}}>U</button>
                                    <div className="cb-toolbar-divider"></div>
                                    <button className="cb-toolbar-btn">☰</button>
                                    <button className="cb-toolbar-btn">⁝</button>
                                    <button className="cb-toolbar-btn">❝</button>
                                    <div className="cb-toolbar-divider"></div>
                                    <button className="cb-toolbar-btn">≡</button>
                                    <button className="cb-toolbar-btn">≡</button>
                                    <button className="cb-toolbar-btn">≡</button>
                                    <button className="cb-toolbar-btn">≡</button>
                                    <div className="cb-toolbar-divider"></div>
                                    <button className="cb-toolbar-btn">🔗</button>
                                    <button className="cb-toolbar-btn">✂</button>
                                    <button className="cb-toolbar-btn">⊞</button>
                                    <button className="cb-toolbar-btn">{'{}'}</button>
                                    <button className="cb-toolbar-btn">⊞</button>
                                </div>
                                <textarea
                                    className="cb-editor-area"
                                    placeholder="Write assignment content..."
                                    value={modalConfig.data.content || ''}
                                    onChange={(e) => updateModalData('content', e.target.value)}
                                ></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="cb-modal-right">
                        <div className="cb-field">
                            <label className="cb-label-sm">Attachments</label>
                            <button className="cb-btn-upload-attach full">
                                <Paperclip size={16} /> Upload Attachment
                            </button>
                        </div>
                        <div className="cb-field">
                            <label className="cb-label-sm">Time Limit</label>
                            <div className="cb-inline-row">
                                <input
                                    type="number"
                                    className="cb-input-sm"
                                    value={modalConfig.data.timeLimit || 0}
                                    onChange={(e) => updateModalData('timeLimit', e.target.value)}
                                    min="0"
                                />
                                <select
                                    className="cb-select-sm"
                                    value={modalConfig.data.timeLimitUnit || 'Weeks'}
                                    onChange={(e) => updateModalData('timeLimitUnit', e.target.value)}
                                >
                                    <option>Weeks</option>
                                    <option>Days</option>
                                    <option>Hours</option>
                                </select>
                            </div>
                        </div>
                        <div className="cb-toggle-row">
                            <label className="cb-label-sm" style={{marginBottom: 0}}>Set Deadline From Assignment Start Time</label>
                            <button className={`cb-toggle ${modalConfig.data.setDeadline ? 'on' : ''}`} onClick={() => updateModalData('setDeadline', !modalConfig.data.setDeadline)}>
                                <span className="cb-toggle-thumb"></span>
                            </button>
                        </div>
                        <div className="cb-field">
                            <label className="cb-label-sm">Total Points</label>
                            <input type="number" className="cb-input-sm" value={modalConfig.data.totalPoints || 10} onChange={(e) => updateModalData('totalPoints', e.target.value)} />
                        </div>
                        <div className="cb-field">
                            <label className="cb-label-sm">Minimum Pass Points</label>
                            <input type="number" className="cb-input-sm" value={modalConfig.data.passPoints || 5} onChange={(e) => updateModalData('passPoints', e.target.value)} />
                        </div>
                        <div className="cb-field">
                            <label className="cb-label-sm">File Upload Limit</label>
                            <input type="number" className="cb-input-sm" value={modalConfig.data.fileUploadLimit || 1} onChange={(e) => updateModalData('fileUploadLimit', e.target.value)} />
                        </div>
                        <div className="cb-field">
                            <label className="cb-label-sm">Maximum File Size Limit</label>
                            <div className="cb-inline-row">
                                <input type="number" className="cb-input-sm" value={modalConfig.data.maxFileSize || 2} onChange={(e) => updateModalData('maxFileSize', e.target.value)} />
                                <span className="cb-unit">MB</span>
                            </div>
                        </div>
                        <div className="cb-toggle-row">
                            <label className="cb-label-sm" style={{marginBottom: 0}}>Allow Assignment Resubmission</label>
                            <button className={`cb-toggle ${modalConfig.data.allowResubmission ? 'on' : ''}`} onClick={() => updateModalData('allowResubmission', !modalConfig.data.allowResubmission)}>
                                <span className="cb-toggle-thumb"></span>
                            </button>
                        </div>
                        {modalConfig.data.allowResubmission && (
                            <div className="cb-field">
                                <label className="cb-label-sm">Maximum Resubmission Attempts</label>
                                <input type="number" className="cb-input-sm" value={modalConfig.data.maxResubmissions || 5} onChange={(e) => updateModalData('maxResubmissions', e.target.value)} />
                            </div>
                        )}
                    </div>
                </div>
                <div className="cb-modal-footer">
                    <button className="cb-btn-cancel" onClick={closeModal}>Cancel</button>
                    <button className="cb-btn-save" onClick={saveModalData}>Save</button>
                </div>
            </div>
        </div>
    );

    // ==================== RENDER QUIZ MODAL ====================
    const renderQuizModal = () => {
        const questionTypes = [
            { id: 'tf', label: 'True/False', color: '#4361EE', icon: <svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" fill="#4361EE"/><text x="10" y="14" textAnchor="middle" fill="white" fontSize="10" fontWeight="700">TF</text></svg> },
            { id: 'mc', label: 'Multiple Choice', color: '#22C55E', icon: <svg width="20" height="20" viewBox="0 0 20 20"><rect x="1" y="1" width="18" height="18" rx="4" fill="#22C55E"/><path d="M6 10l3 3 5-6" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg> },
            { id: 'essay', label: 'Open Ended/Essay', color: '#EF4444', icon: <svg width="20" height="20" viewBox="0 0 20 20"><rect x="1" y="1" width="18" height="18" rx="4" fill="#FECACA"/><rect x="5" y="6" width="10" height="2" rx="1" fill="#EF4444"/><rect x="5" y="10" width="8" height="2" rx="1" fill="#EF4444" opacity="0.6"/></svg> },
            { id: 'fill', label: 'Fill in the Blanks', color: '#F59E0B', icon: <svg width="20" height="20" viewBox="0 0 20 20"><rect x="1" y="1" width="18" height="18" rx="4" fill="#FEF3C7"/><rect x="5" y="9" width="10" height="3" rx="1" fill="#F59E0B"/></svg> },
            { id: 'short', label: 'Short Answer', color: '#8B5CF6', icon: <svg width="20" height="20" viewBox="0 0 20 20"><rect x="1" y="1" width="18" height="18" rx="4" fill="#EDE9FE"/><text x="10" y="14" textAnchor="middle" fill="#8B5CF6" fontSize="12" fontWeight="700">Aa</text></svg> },
            { id: 'match', label: 'Matching', color: '#6366F1', icon: <svg width="20" height="20" viewBox="0 0 20 20"><rect x="1" y="1" width="18" height="18" rx="4" fill="#E0E7FF"/><rect x="4" y="5" width="5" height="4" rx="1" fill="#6366F1"/><rect x="11" y="11" width="5" height="4" rx="1" fill="#6366F1"/><line x1="9" y1="7" x2="11" y2="13" stroke="#6366F1" strokeWidth="1.5"/></svg> },
            { id: 'image', label: 'Image Answering', color: '#10B981', icon: <svg width="20" height="20" viewBox="0 0 20 20"><rect x="1" y="1" width="18" height="18" rx="4" fill="#D1FAE5"/><rect x="4" y="5" width="12" height="8" rx="2" fill="#10B981" opacity="0.5"/><circle cx="8" cy="8" r="2" fill="#10B981"/></svg> },
            { id: 'order', label: 'Ordering', color: '#3B82F6', icon: <svg width="20" height="20" viewBox="0 0 20 20"><rect x="1" y="1" width="18" height="18" rx="4" fill="#DBEAFE"/><text x="7" y="9" fill="#3B82F6" fontSize="5" fontWeight="700">1</text><text x="12" y="9" fill="#3B82F6" fontSize="5" fontWeight="700">↕</text><text x="7" y="16" fill="#3B82F6" fontSize="5" fontWeight="700">2</text></svg> }
        ];

        const questions = modalConfig.data.questions || [];
        const selectedQ = selectedQuestionIdx !== null && questions[selectedQuestionIdx] ? questions[selectedQuestionIdx] : null;
        const settings = modalConfig.data.settings || defaultQuizSettings;

        const updateQuestionField = (field, value) => {
            if (selectedQuestionIdx === null) return;
            const updated = [...questions];
            updated[selectedQuestionIdx] = { ...updated[selectedQuestionIdx], [field]: value };
            updateModalData('questions', updated);
        };

        const updateSettings = (field, value) => {
            updateModalData('settings', { ...settings, [field]: value });
        };

        const addQuestion = (qt) => {
            const newQ = {
                id: Date.now(),
                type: qt.id,
                label: qt.label,
                text: '',
                points: 1,
                answers: qt.id === 'tf' ? [
                    { id: 1, text: 'True', correct: true },
                    { id: 2, text: 'False', correct: false }
                ] : qt.id === 'mc' ? [
                    { id: 1, text: '', correct: false },
                    { id: 2, text: '', correct: false }
                ] : []
            };
            const updated = [...questions, newQ];
            updateModalData('questions', updated);
            setSelectedQuestionIdx(updated.length - 1);
            setQuestionTypeDropdown(false);
        };

        const removeQuestion = (idx) => {
            const updated = questions.filter((_, i) => i !== idx);
            updateModalData('questions', updated);
            if (selectedQuestionIdx === idx) setSelectedQuestionIdx(null);
            else if (selectedQuestionIdx > idx) setSelectedQuestionIdx(selectedQuestionIdx - 1);
        };

        // Render the center panel for Question Details or Settings
        const renderCenterPanel = () => {
            if (quizTab === 'settings') {
                return (
                    <div className="quiz-settings-panel">
                        <h3 className="quiz-settings-title">Quiz Settings</h3>
                        <div className="quiz-settings-grid">
                            <div className="cb-field">
                                <label className="cb-label-sm">Time Limit</label>
                                <div className="cb-inline-row">
                                    <input type="number" className="cb-input-sm" value={settings.timeLimit} onChange={(e) => updateSettings('timeLimit', e.target.value)} min="0" />
                                    <select className="cb-select-sm" value={settings.timeLimitUnit} onChange={(e) => updateSettings('timeLimitUnit', e.target.value)}>
                                        <option>Minutes</option>
                                        <option>Hours</option>
                                        <option>Days</option>
                                    </select>
                                </div>
                            </div>
                            <div className="cb-field">
                                <label className="cb-label-sm">Feedback Mode</label>
                                <select className="cb-select" value={settings.feedbackMode} onChange={(e) => updateSettings('feedbackMode', e.target.value)}>
                                    <option value="default">Default (show at end)</option>
                                    <option value="reveal">Reveal after each question</option>
                                    <option value="retry">Retry mode</option>
                                </select>
                            </div>
                            <div className="cb-field">
                                <label className="cb-label-sm">Attempts Allowed</label>
                                <input type="number" className="cb-input-sm" value={settings.attemptsAllowed} onChange={(e) => updateSettings('attemptsAllowed', e.target.value)} min="0" />
                            </div>
                            <div className="cb-field">
                                <label className="cb-label-sm">Passing Percentage (%)</label>
                                <input type="number" className="cb-input-sm" value={settings.passingPercentage} onChange={(e) => updateSettings('passingPercentage', e.target.value)} min="0" max="100" />
                            </div>
                            <div className="cb-field">
                                <label className="cb-label-sm">Max Questions to Show</label>
                                <input type="number" className="cb-input-sm" value={settings.maxQuestions} onChange={(e) => updateSettings('maxQuestions', e.target.value)} min="0" placeholder="0 = all" />
                            </div>
                            <div className="cb-field">
                                <label className="cb-label-sm">Question Layout</label>
                                <select className="cb-select" value={settings.questionLayout} onChange={(e) => updateSettings('questionLayout', e.target.value)}>
                                    <option value="single">Single question</option>
                                    <option value="pagination">Pagination</option>
                                    <option value="all">Show all</option>
                                </select>
                            </div>
                            <div className="cb-field">
                                <label className="cb-label-sm">Question Order</label>
                                <select className="cb-select" value={settings.questionOrder} onChange={(e) => updateSettings('questionOrder', e.target.value)}>
                                    <option value="random">Random</option>
                                    <option value="sequential">Sequential</option>
                                </select>
                            </div>
                            <div className="cb-toggle-row">
                                <label className="cb-label-sm" style={{marginBottom: 0}}>Hide Quiz Time</label>
                                <button className={`cb-toggle ${settings.hideQuizTime ? 'on' : ''}`} onClick={() => updateSettings('hideQuizTime', !settings.hideQuizTime)}>
                                    <span className="cb-toggle-thumb"></span>
                                </button>
                            </div>
                            <div className="cb-toggle-row">
                                <label className="cb-label-sm" style={{marginBottom: 0}}>Auto Start</label>
                                <button className={`cb-toggle ${settings.autoStart ? 'on' : ''}`} onClick={() => updateSettings('autoStart', !settings.autoStart)}>
                                    <span className="cb-toggle-thumb"></span>
                                </button>
                            </div>
                            <div className="cb-field">
                                <label className="cb-label-sm">Short Answer Character Limit</label>
                                <input type="number" className="cb-input-sm" value={settings.shortAnswerCharLimit} onChange={(e) => updateSettings('shortAnswerCharLimit', e.target.value)} min="0" />
                            </div>
                        </div>
                    </div>
                );
            }

            // Question Details tab
            if (!selectedQ) {
                return (
                    <div className="cb-quiz-empty-center">
                        <svg width="160" height="130" viewBox="0 0 160 130" fill="none">
                            {/* Speech bubble */}
                            <path d="M50 20 C50 12 56 6 64 6 L120 6 C128 6 134 12 134 20 L134 80 C134 88 128 94 120 94 L90 94 L80 110 L74 94 L64 94 C56 94 50 88 50 80 Z" fill="#E8EDFB" />
                            {/* Option circles A, B, C, D with lines */}
                            <circle cx="72" cy="30" r="6" fill="none" stroke="#CBD5E1" strokeWidth="1.5" />
                            <text x="72" y="33" textAnchor="middle" fill="#94A3B8" fontSize="7" fontWeight="600">A</text>
                            <rect x="84" y="27" width="36" height="5" rx="2.5" fill="#CBD5E1" />
                            <circle cx="72" cy="48" r="6" fill="none" stroke="#CBD5E1" strokeWidth="1.5" />
                            <text x="72" y="51" textAnchor="middle" fill="#94A3B8" fontSize="7" fontWeight="600">B</text>
                            <rect x="84" y="45" width="30" height="5" rx="2.5" fill="#CBD5E1" />
                            <circle cx="72" cy="66" r="6" fill="none" stroke="#CBD5E1" strokeWidth="1.5" />
                            <text x="72" y="69" textAnchor="middle" fill="#94A3B8" fontSize="7" fontWeight="600">C</text>
                            <rect x="84" y="63" width="34" height="5" rx="2.5" fill="#CBD5E1" />
                            <circle cx="72" cy="84" r="6" fill="none" stroke="#CBD5E1" strokeWidth="1.5" />
                            <text x="72" y="87" textAnchor="middle" fill="#94A3B8" fontSize="7" fontWeight="600">D</text>
                            <rect x="84" y="81" width="28" height="5" rx="2.5" fill="#CBD5E1" />
                        </svg>
                        <p>Enter a quiz title to begin. Choose from a variety of<br/>question types to keep things interesting!</p>
                    </div>
                );
            }

            // Editing a selected question
            return (
                <div className="quiz-question-editor">
                    <div className="quiz-qe-header">
                        <span className="quiz-qe-badge">{selectedQ.label}</span>
                        <span className="quiz-qe-num">Question {selectedQuestionIdx + 1}</span>
                    </div>
                    <div className="cb-field">
                        <label className="cb-label-sm">Question Text</label>
                        <textarea
                            className="cb-textarea"
                            placeholder="Enter your question..."
                            value={selectedQ.text || ''}
                            onChange={(e) => updateQuestionField('text', e.target.value)}
                            rows={3}
                        ></textarea>
                    </div>

                    {/* Answer options for True/False */}
                    {selectedQ.type === 'tf' && (
                        <div className="cb-field">
                            <label className="cb-label-sm">Correct Answer</label>
                            <div className="quiz-tf-options">
                                {selectedQ.answers.map((ans) => (
                                    <label key={ans.id} className={`quiz-tf-option ${ans.correct ? 'correct' : ''}`}>
                                        <input
                                            type="radio"
                                            name={`tf-${selectedQ.id}`}
                                            checked={ans.correct}
                                            onChange={() => {
                                                const updated = selectedQ.answers.map(a => ({ ...a, correct: a.id === ans.id }));
                                                updateQuestionField('answers', updated);
                                            }}
                                        />
                                        <span>{ans.text}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Answer options for Multiple Choice */}
                    {selectedQ.type === 'mc' && (
                        <div className="cb-field">
                            <label className="cb-label-sm">Answer Options</label>
                            <div className="quiz-mc-options">
                                {(selectedQ.answers || []).map((ans, aIdx) => (
                                    <div key={ans.id} className={`quiz-mc-option ${ans.correct ? 'correct' : ''}`}>
                                        <input
                                            type="checkbox"
                                            checked={ans.correct}
                                            onChange={() => {
                                                const updated = selectedQ.answers.map((a, i) => i === aIdx ? { ...a, correct: !a.correct } : a);
                                                updateQuestionField('answers', updated);
                                            }}
                                        />
                                        <input
                                            type="text"
                                            className="quiz-mc-input"
                                            placeholder={`Option ${aIdx + 1}`}
                                            value={ans.text}
                                            onChange={(e) => {
                                                const updated = [...selectedQ.answers];
                                                updated[aIdx] = { ...updated[aIdx], text: e.target.value };
                                                updateQuestionField('answers', updated);
                                            }}
                                        />
                                        <button className="cb-icon-btn danger" onClick={() => {
                                            const updated = selectedQ.answers.filter((_, i) => i !== aIdx);
                                            updateQuestionField('answers', updated);
                                        }}><Trash2 size={12} /></button>
                                    </div>
                                ))}
                                <button className="cb-btn-add-item" onClick={() => {
                                    const updated = [...(selectedQ.answers || []), { id: Date.now(), text: '', correct: false }];
                                    updateQuestionField('answers', updated);
                                }}>
                                    <Plus size={14} /> Add Option
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Fill in the blanks */}
                    {selectedQ.type === 'fill' && (
                        <div className="cb-field">
                            <label className="cb-label-sm">Answer</label>
                            <input
                                type="text"
                                className="cb-input-sm"
                                placeholder="Correct answer for the blank"
                                value={selectedQ.answer || ''}
                                onChange={(e) => updateQuestionField('answer', e.target.value)}
                            />
                            <p className="cb-hint">Use {'{blank}'} in your question text to mark the blank position.</p>
                        </div>
                    )}

                    {/* Short answer */}
                    {selectedQ.type === 'short' && (
                        <div className="cb-field">
                            <label className="cb-label-sm">Expected Answer</label>
                            <textarea
                                className="cb-textarea"
                                placeholder="Enter the expected short answer..."
                                value={selectedQ.answer || ''}
                                onChange={(e) => updateQuestionField('answer', e.target.value)}
                                rows={2}
                            ></textarea>
                        </div>
                    )}

                    {/* Essay - no answer needed, just question text */}
                    {selectedQ.type === 'essay' && (
                        <div className="cb-field">
                            <p className="cb-hint">Students will provide a long-form written answer. This question type requires manual grading.</p>
                        </div>
                    )}

                    {/* Matching */}
                    {selectedQ.type === 'match' && (
                        <div className="cb-field">
                            <label className="cb-label-sm">Matching Pairs</label>
                            <div className="quiz-match-pairs">
                                {(selectedQ.pairs || []).map((pair, pIdx) => (
                                    <div key={pIdx} className="quiz-match-pair">
                                        <input
                                            type="text"
                                            className="cb-input-sm"
                                            placeholder="Left item"
                                            value={pair.left || ''}
                                            onChange={(e) => {
                                                const updated = [...(selectedQ.pairs || [])];
                                                updated[pIdx] = { ...updated[pIdx], left: e.target.value };
                                                updateQuestionField('pairs', updated);
                                            }}
                                        />
                                        <span className="quiz-match-arrow">→</span>
                                        <input
                                            type="text"
                                            className="cb-input-sm"
                                            placeholder="Right item"
                                            value={pair.right || ''}
                                            onChange={(e) => {
                                                const updated = [...(selectedQ.pairs || [])];
                                                updated[pIdx] = { ...updated[pIdx], right: e.target.value };
                                                updateQuestionField('pairs', updated);
                                            }}
                                        />
                                        <button className="cb-icon-btn danger" onClick={() => {
                                            const updated = (selectedQ.pairs || []).filter((_, i) => i !== pIdx);
                                            updateQuestionField('pairs', updated);
                                        }}><Trash2 size={12} /></button>
                                    </div>
                                ))}
                                <button className="cb-btn-add-item" onClick={() => {
                                    const updated = [...(selectedQ.pairs || []), { left: '', right: '' }];
                                    updateQuestionField('pairs', updated);
                                }}>
                                    <Plus size={14} /> Add Pair
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Ordering */}
                    {selectedQ.type === 'order' && (
                        <div className="cb-field">
                            <label className="cb-label-sm">Items (in correct order)</label>
                            <div className="quiz-order-items">
                                {(selectedQ.orderItems || []).map((item, oIdx) => (
                                    <div key={oIdx} className="quiz-order-item">
                                        <span className="quiz-order-num">{oIdx + 1}</span>
                                        <input
                                            type="text"
                                            className="cb-input-sm"
                                            placeholder={`Item ${oIdx + 1}`}
                                            value={item}
                                            onChange={(e) => {
                                                const updated = [...(selectedQ.orderItems || [])];
                                                updated[oIdx] = e.target.value;
                                                updateQuestionField('orderItems', updated);
                                            }}
                                        />
                                        <button className="cb-icon-btn danger" onClick={() => {
                                            const updated = (selectedQ.orderItems || []).filter((_, i) => i !== oIdx);
                                            updateQuestionField('orderItems', updated);
                                        }}><Trash2 size={12} /></button>
                                    </div>
                                ))}
                                <button className="cb-btn-add-item" onClick={() => {
                                    const updated = [...(selectedQ.orderItems || []), ''];
                                    updateQuestionField('orderItems', updated);
                                }}>
                                    <Plus size={14} /> Add Item
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Image Answering */}
                    {selectedQ.type === 'image' && (
                        <div className="cb-field">
                            <label className="cb-label-sm">Image</label>
                            <div className="cb-upload-box small">
                                <div className="cb-upload-icon"><Image size={24} color="#94A3B8" /></div>
                                <button className="cb-btn-upload" type="button">Upload Image</button>
                                <span className="cb-upload-hint">Upload an image for students to answer about</span>
                            </div>
                        </div>
                    )}
                </div>
            );
        };

        // Render right detail panel
        const renderDetailsPanel = () => {
            if (!selectedQ) {
                return <p className="cb-muted">Create/Select a question to view details</p>;
            }
            return (
                <div className="quiz-detail-fields">
                    <h4 className="quiz-detail-title">Question Details</h4>
                    <div className="cb-field">
                        <label className="cb-label-sm">Points</label>
                        <input
                            type="number"
                            className="cb-input-sm"
                            value={selectedQ.points || 1}
                            onChange={(e) => updateQuestionField('points', parseInt(e.target.value) || 1)}
                            min="1"
                        />
                    </div>
                    <div className="cb-field">
                        <label className="cb-label-sm">Explanation (shown after answer)</label>
                        <textarea
                            className="cb-textarea"
                            placeholder="Explain the correct answer..."
                            value={selectedQ.explanation || ''}
                            onChange={(e) => updateQuestionField('explanation', e.target.value)}
                            rows={3}
                            style={{minHeight: '80px'}}
                        ></textarea>
                    </div>
                    <div className="cb-field">
                        <label className="cb-label-sm">Question Type</label>
                        <div className="quiz-detail-type">
                            {questionTypes.find(qt => qt.id === selectedQ.type)?.icon}
                            <span>{selectedQ.label}</span>
                        </div>
                    </div>
                </div>
            );
        };

        return (
            <div className="cb-modal-overlay" onClick={closeModal}>
                <div className="cb-modal quiz-modal" onClick={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <div className="cb-modal-header quiz-header">
                        <div className="cb-modal-header-left">
                            <span className="cb-modal-warn">⚠ Unsaved Changes</span>
                            <span className="cb-modal-divider">|</span>
                            <span className="cb-modal-subtitle">Topic: {curriculum[modalConfig.topicIdx]?.title || `Topic ${modalConfig.topicIdx + 1}`}</span>
                        </div>
                        <div className="cb-modal-header-center">
                            <button className={`cb-quiz-tab ${quizTab === 'details' ? 'active' : ''}`} onClick={() => setQuizTab('details')}>Question Details</button>
                            <button className={`cb-quiz-tab ${quizTab === 'settings' ? 'active' : ''}`} onClick={() => setQuizTab('settings')}>Settings</button>
                        </div>
                        <div className="cb-modal-header-right">
                            <button className="cb-btn-cancel" onClick={closeModal}>Cancel</button>
                            <button className="cb-btn-next" onClick={saveModalData}>Next</button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="quiz-body">
                        {/* Left sidebar: title + questions */}
                        <div className="quiz-left-panel">
                            <input
                                type="text"
                                className="quiz-title-input"
                                placeholder="Enter quiz title..."
                                value={modalConfig.data.title || ''}
                                onChange={(e) => updateModalData('title', e.target.value)}
                            />
                            <div className="quiz-questions-section">
                                <div className="quiz-questions-header">
                                    <span>Questions</span>
                                    <div style={{position: 'relative'}}>
                                        <button className="cb-btn-add-q" onClick={() => setQuestionTypeDropdown(!questionTypeDropdown)}>
                                            <Plus size={14} />
                                        </button>
                                        {questionTypeDropdown && (
                                            <div className="cb-question-type-dropdown">
                                                <div className="cb-dropdown-title">Select Question Type</div>
                                                {questionTypes.map(qt => (
                                                    <button key={qt.id} className="cb-dropdown-item" onClick={() => addQuestion(qt)}>
                                                        <span className="qt-icon">{qt.icon}</span>
                                                        <span>{qt.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="quiz-questions-list">
                                    {questions.length === 0 ? (
                                        <p className="cb-muted" style={{padding: '12px 0'}}>No questions added yet.</p>
                                    ) : (
                                        questions.map((q, i) => (
                                            <div
                                                key={q.id}
                                                className={`quiz-q-item ${selectedQuestionIdx === i ? 'active' : ''}`}
                                                onClick={() => { setSelectedQuestionIdx(i); setQuizTab('details'); }}
                                            >
                                                <div className="quiz-q-item-left">
                                                    <span className="quiz-q-icon">{questionTypes.find(qt => qt.id === q.type)?.icon}</span>
                                                    <span className="quiz-q-text">{q.text || q.label}</span>
                                                </div>
                                                <button className="cb-icon-btn danger" onClick={(e) => { e.stopPropagation(); removeQuestion(i); }}>
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Center panel */}
                        <div className="quiz-center-panel">
                            {renderCenterPanel()}
                        </div>

                        {/* Right detail panel */}
                        {quizTab === 'details' && (
                            <div className="quiz-right-panel">
                                {renderDetailsPanel()}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // ==================== RENDER MODAL DISPATCHER ====================
    const renderModal = () => {
        if (!modalConfig.show) return null;
        switch (modalConfig.type) {
            case 'lesson': return renderLessonModal();
            case 'assignment': return renderAssignmentModal();
            case 'quiz': return renderQuizModal();
            default: return renderLessonModal();
        }
    };

    // ==================== RENDER STEP ====================
    const renderStepContent = () => {
        switch (currentStep) {
            case 'basics': return renderBasics();
            case 'curriculum': return renderCurriculum();
            case 'additional': return renderAdditional();
            default: return null;
        }
    };

    const currentStepIdx = steps.findIndex(s => s.id === currentStep);

    return (
        <div className="cb-layout">
            {/* Top Navigation Bar */}
            <nav className="cb-topnav">
                <div className="cb-topnav-left">
                    <div className="cb-brand" onClick={() => navigate('/instructor/courses')}>
                        <div className="cb-brand-logo">H</div>
                        <span className="cb-brand-text">Hexoria</span>
                    </div>
                    <div className="cb-topnav-divider"></div>
                    <span className="cb-topnav-title">Course Builder</span>
                </div>

                <div className="cb-step-indicators">
                    {steps.map((step, idx) => (
                        <React.Fragment key={step.id}>
                            <div
                                className={`cb-step ${currentStepIdx === idx ? 'active' : ''} ${currentStepIdx > idx ? 'completed' : ''}`}
                                onClick={() => handleStepChange(step.id)}
                            >
                                <span className="cb-step-num">
                                    {currentStepIdx > idx ? <Check size={12} /> : step.num}
                                </span>
                                <span className="cb-step-label">{step.label}</span>
                            </div>
                            {idx < steps.length - 1 && <div className="cb-step-line"></div>}
                        </React.Fragment>
                    ))}
                </div>

                <div className="cb-topnav-right">
                    <button className="cb-btn-ai">
                        <Sparkles size={16} /> Generate with AI
                    </button>
                    <button className="cb-btn-preview">
                        Preview <Eye size={16} />
                    </button>
                    <button className="cb-btn-draft" onClick={() => handlePublish('Draft')} disabled={loading}>
                        <Save size={16} /> Save as Draft
                    </button>
                    <div className="cb-publish-group">
                        <button className="cb-btn-publish" onClick={() => handlePublish('Published')} disabled={loading}>
                            {loading ? 'Saving...' : 'Publish'}
                        </button>
                        <button className="cb-btn-publish-arrow">
                            <Check size={16} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="cb-content">
                {renderStepContent()}
            </div>

            {/* Modals */}
            {renderModal()}
        </div>
    );
}
