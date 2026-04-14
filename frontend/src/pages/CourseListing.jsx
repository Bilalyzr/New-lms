import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './CourseListing.css';
import { Search, Filter, Star, Clock, BookOpen } from 'lucide-react';

const COURSES_PER_PAGE = 9;

export default function CourseListing() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [activePage, setActivePage] = useState(1);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const categories = ['All', 'Development', 'Business', 'Design', 'Marketing', 'IT & Software'];

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/courses');
                setCourses(res.data);
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    // Filter by category and search
    const filteredCourses = courses.filter(c => {
        const matchesCategory = activeCategory === 'All' || c.category === activeCategory;
        const matchesSearch = !searchTerm || c.title.toLowerCase().includes(searchTerm.toLowerCase()) || (c.instructor && c.instructor.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    // Pagination
    const totalPages = Math.max(1, Math.ceil(filteredCourses.length / COURSES_PER_PAGE));
    const paginatedCourses = filteredCourses.slice((activePage - 1) * COURSES_PER_PAGE, activePage * COURSES_PER_PAGE);

    // Reset page when filter changes
    useEffect(() => { setActivePage(1); }, [activeCategory, searchTerm]);

    const handlePageChange = (page) => {
        setActivePage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return <div className="container p-10 text-center text-muted">Loading courses...</div>;
    }

    return (
        <div className="course-listing-page container">
            <div className="listing-header">
                <h1 className="page-title">Explore Courses</h1>
                <div className="search-bar-container">
                    <Search className="search-icon text-muted" size={20} />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search for courses or instructors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="listing-content">
                {/* Sidebar Filters */}
                <aside className="filter-sidebar card">
                    <div className="sidebar-header">
                        <Filter size={18} />
                        <h2>Filters</h2>
                    </div>
                    <div className="filter-group">
                        <h3 className="filter-title">Categories</h3>
                        <ul className="filter-list">
                            {categories.map(category => (
                                <li
                                    key={category}
                                    className={`filter-item ${activeCategory === category ? 'active' : ''}`}
                                    onClick={() => setActiveCategory(category)}
                                >
                                    {category}
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* Course Grid */}
                <main className="course-grid-container">
                    <div className="text-sm text-muted mb-4">
                        {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
                        {activeCategory !== 'All' && ` in ${activeCategory}`}
                        {searchTerm && ` matching "${searchTerm}"`}
                    </div>

                    <div className="courses-grid">
                        {paginatedCourses.length === 0 ? (
                            <div className="text-muted p-10 col-span-full text-center">
                                <BookOpen size={40} style={{opacity: 0.3, margin: '0 auto 12px'}} />
                                <p>No courses found matching your criteria.</p>
                            </div>
                        ) : (
                            paginatedCourses.map((course, index) => (
                                <div
                                    className="course-card card animate-fade-up"
                                    key={course.id}
                                    style={{ animationDelay: `${index * 60}ms` }}
                                >
                                    <div className="course-img-placeholder" style={course.image_url ? { backgroundImage: `url(${course.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                                        {!course.image_url && <BookOpen size={32} style={{opacity: 0.15}} />}
                                    </div>
                                    <div className="course-content">
                                        <span className="course-category">{course.category}</span>
                                        <h3 className="course-title">{course.title}</h3>
                                        <p className="course-instructor">{course.instructor || 'Hexoria Instructor'}</p>
                                        <div className="course-meta">
                                            {course.rating > 0 && (
                                                <span className="meta-item"><Star size={14} className="text-secondary" /> {course.rating}</span>
                                            )}
                                            {course.students_enrolled > 0 && (
                                                <span className="meta-item">{course.students_enrolled} students</span>
                                            )}
                                            {course.hours > 0 && (
                                                <span className="meta-item"><Clock size={14} className="text-muted" /> {course.hours}h</span>
                                            )}
                                        </div>
                                        <div className="course-footer">
                                            <div className="course-price text-accent">
                                                {Number(course.price) > 0 ? `$${Number(course.price).toFixed(2)}` : 'Free'}
                                            </div>
                                            <Link to={`/course/${course.id}`} className="btn-secondary add-btn" style={{ textDecoration: 'none' }}>Details</Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Real Pagination */}
                    {totalPages > 1 && (
                        <div className="pagination animate-slide-fade">
                            <button
                                className="page-btn"
                                disabled={activePage === 1}
                                onClick={() => handlePageChange(activePage - 1)}
                            >
                                Prev
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter(p => p === 1 || p === totalPages || Math.abs(p - activePage) <= 1)
                                .reduce((acc, p, idx, arr) => {
                                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                                    acc.push(p);
                                    return acc;
                                }, [])
                                .map((item, idx) =>
                                    item === '...' ? (
                                        <span key={`ellipsis-${idx}`} className="page-ellipsis">...</span>
                                    ) : (
                                        <button
                                            key={item}
                                            className={`page-btn ${activePage === item ? 'active' : ''}`}
                                            onClick={() => handlePageChange(item)}
                                        >
                                            {item}
                                        </button>
                                    )
                                )
                            }
                            <button
                                className="page-btn"
                                disabled={activePage === totalPages}
                                onClick={() => handlePageChange(activePage + 1)}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
