import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';
import './Dashboard.css';
import {
    Plus, Search, BookOpen, Users, Star, Clock,
    CheckCircle, AlertCircle, Edit3, Eye, Trash2,
    MoreVertical, Filter, PlayCircle, HelpCircle
} from 'lucide-react';

export default function InstructorCourses() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const token = user?.token;
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [menuOpen, setMenuOpen] = useState(null);
    const toast = useToast();
    const confirm = useConfirm();

    useEffect(() => {
        fetchCourses();
    }, [token]);

    const fetchCourses = async () => {
        if (!token) { setLoading(false); return; }
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/courses/instructor', {
                headers: { 'x-auth-token': token }
            });
            setCourses(res.data);
        } catch (err) {
            console.error('Error fetching instructor courses:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (courseId, title) => {
        const confirmed = await confirm({
            title: 'Delete Course',
            message: `Are you sure you want to delete "${title}"? This cannot be undone. All sections, lessons, quizzes, and enrollments will be permanently removed.`,
            confirmText: 'Delete',
            type: 'danger'
        });
        if (!confirmed) return;
        try {
            await axios.delete(`http://localhost:5000/api/courses/${courseId}`, {
                headers: { 'x-auth-token': token }
            });
            setCourses(courses.filter(c => c.id !== courseId));
            toast.success(`"${title}" has been deleted.`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete course.');
        }
    };

    // Filter courses
    const filtered = courses.filter(c => {
        const matchesSearch = !searchTerm ||
            c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.category?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const draftCount = courses.filter(c => c.status === 'Draft').length;
    const pendingCount = courses.filter(c => c.status === 'Pending').length;
    const publishedCount = courses.filter(c => c.status === 'Published').length;
    const totalStudents = courses.reduce((sum, c) => sum + (c.students_enrolled || 0), 0);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Published':
                return <span className="ic-badge published"><CheckCircle size={12} /> Published</span>;
            case 'Pending':
                return <span className="ic-badge pending"><Clock size={12} /> Pending</span>;
            default:
                return <span className="ic-badge draft"><AlertCircle size={12} /> Draft</span>;
        }
    };

    return (
        <div className="dashboard-page container animate-fade-up">
            {/* Header */}
            <header className="ic-header">
                <div>
                    <h1 className="dashboard-title">My Courses</h1>
                    <p className="text-muted">Manage, edit, and track all your courses.</p>
                </div>
                <button className="btn btn-primary" onClick={() => navigate('/build')}>
                    <Plus size={18} /> New Course
                </button>
            </header>

            {/* Stats Row */}
            <div className="ic-stats">
                <div className="ic-stat-pill" onClick={() => setStatusFilter('All')}>
                    <BookOpen size={16} />
                    <span className="ic-stat-val">{courses.length}</span>
                    <span className="ic-stat-lbl">Total</span>
                </div>
                <div className="ic-stat-pill" onClick={() => setStatusFilter('Published')}>
                    <CheckCircle size={16} style={{color: '#22C55E'}} />
                    <span className="ic-stat-val">{publishedCount}</span>
                    <span className="ic-stat-lbl">Published</span>
                </div>
                <div className="ic-stat-pill" onClick={() => setStatusFilter('Pending')}>
                    <Clock size={16} style={{color: '#F59E0B'}} />
                    <span className="ic-stat-val">{pendingCount}</span>
                    <span className="ic-stat-lbl">Pending</span>
                </div>
                <div className="ic-stat-pill" onClick={() => setStatusFilter('Draft')}>
                    <AlertCircle size={16} style={{color: '#94A3B8'}} />
                    <span className="ic-stat-val">{draftCount}</span>
                    <span className="ic-stat-lbl">Drafts</span>
                </div>
                <div className="ic-stat-pill">
                    <Users size={16} style={{color: 'var(--primary)'}} />
                    <span className="ic-stat-val">{totalStudents}</span>
                    <span className="ic-stat-lbl">Students</span>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="ic-toolbar">
                <div className="ic-search">
                    <Search size={16} />
                    <input
                        type="text"
                        placeholder="Search your courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="ic-filters">
                    {['All', 'Published', 'Pending', 'Draft'].map(s => (
                        <button
                            key={s}
                            className={`ic-filter-btn ${statusFilter === s ? 'active' : ''}`}
                            onClick={() => setStatusFilter(s)}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Course Grid */}
            {loading ? (
                <div className="ic-empty">Loading your courses...</div>
            ) : filtered.length === 0 ? (
                <div className="ic-empty">
                    {courses.length === 0 ? (
                        <>
                            <BookOpen size={48} style={{opacity: 0.15, marginBottom: '12px'}} />
                            <h3>No courses yet</h3>
                            <p>Create your first course to start teaching on Hexoria.</p>
                            <button className="btn btn-primary" style={{marginTop: '16px'}} onClick={() => navigate('/build')}>
                                <Plus size={16} /> Create Course
                            </button>
                        </>
                    ) : (
                        <>
                            <p>No courses match your search or filter.</p>
                            <button className="btn btn-secondary btn-sm" style={{marginTop: '8px'}} onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}>
                                Clear Filters
                            </button>
                        </>
                    )}
                </div>
            ) : (
                <div className="ic-grid">
                    {filtered.map(course => (
                        <div key={course.id} className="ic-card" onClick={() => setMenuOpen(null)}>
                            {/* Image */}
                            <div className="ic-card-img" style={course.image_url ? { backgroundImage: `url(${course.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                                {!course.image_url && <BookOpen size={32} style={{opacity: 0.12}} />}
                                <div className="ic-card-status">{getStatusBadge(course.status)}</div>
                            </div>

                            {/* Content */}
                            <div className="ic-card-body">
                                <span className="ic-card-category">{course.category}</span>
                                <h3 className="ic-card-title">{course.title}</h3>

                                <div className="ic-card-meta">
                                    <span><Users size={13} /> {course.students_enrolled || 0} students</span>
                                    {course.rating > 0 && <span><Star size={13} /> {course.rating}</span>}
                                    <span>${Number(course.price || 0).toFixed(2)}</span>
                                </div>

                                <div className="ic-card-date">
                                    Created {new Date(course.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>

                                {/* Actions */}
                                <div className="ic-card-actions">
                                    {course.status === 'Draft' ? (
                                        <button className="btn btn-primary btn-sm ic-action-btn" onClick={() => navigate(`/build/${course.id}`)}>
                                            <Edit3 size={14} /> Continue Editing
                                        </button>
                                    ) : (
                                        <button className="btn btn-secondary btn-sm ic-action-btn" onClick={() => navigate(`/course/${course.id}`)}>
                                            <Eye size={14} /> {course.status === 'Published' ? 'View' : 'Preview'}
                                        </button>
                                    )}
                                    <div className="ic-more-wrap">
                                        <button
                                            className="ic-more-btn"
                                            onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === course.id ? null : course.id); }}
                                        >
                                            <MoreVertical size={16} />
                                        </button>
                                        {menuOpen === course.id && (
                                            <div className="ic-dropdown" onClick={(e) => e.stopPropagation()}>
                                                <button onClick={() => { navigate(`/build/${course.id}`); setMenuOpen(null); }}>
                                                    <Edit3 size={14} /> Edit Course
                                                </button>
                                                <button onClick={() => { navigate(`/quiz-manager/${course.id}`); setMenuOpen(null); }}>
                                                    <HelpCircle size={14} /> Manage Quizzes
                                                </button>
                                                <button onClick={() => { navigate(`/course/${course.id}`); setMenuOpen(null); }}>
                                                    <Eye size={14} /> Preview
                                                </button>
                                                <hr />
                                                <button className="ic-dropdown-danger" onClick={() => { handleDelete(course.id, course.title); setMenuOpen(null); }}>
                                                    <Trash2 size={14} /> Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
