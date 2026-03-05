import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './CourseListing.css';
import { Search, Filter, Star, Clock } from 'lucide-react';

export default function CourseListing() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [activePage, setActivePage] = useState(1);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const handlePageChange = (page) => {
        setActivePage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const categories = ['All', 'Development', 'Business', 'Design', 'Marketing', 'IT & Software'];

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/courses');
                setCourses(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching courses:", error);
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const filteredCourses = activeCategory === 'All'
        ? courses
        : courses.filter(c => c.category === activeCategory);

    if (loading) {
        return <div className="container p-10 text-center"><div className="spinner-border text-primary"></div> Loading courses...</div>;
    }

    return (
        <div className="course-listing-page container">
            <div className="listing-header">
                <h1 className="page-title">Explore Courses</h1>
                <div className="search-bar-container">
                    <Search className="search-icon text-muted" size={20} />
                    <input type="text" className="search-input" placeholder="Search for anything..." />
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
                    <div className="courses-grid">
                        {filteredCourses.length === 0 ? (
                            <div className="text-muted p-10 col-span-full text-center">No courses found matching your criteria.</div>
                        ) : (
                            filteredCourses.map((course, index) => (
                                <div
                                    className="course-card card animate-fade-up"
                                    key={course.id}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="course-img-placeholder"></div>
                                    <div className="course-content">
                                        <span className="course-category">{course.category}</span>
                                        <h3 className="course-title">{course.title}</h3>
                                        <p className="course-instructor">{course.instructor}</p>
                                        <div className="course-meta">
                                            <span className="meta-item"><Star size={14} className="text-secondary" /> {course.rating}</span>
                                            <span className="meta-item"><Clock size={14} className="text-muted" /> {course.hours}h</span>
                                        </div>
                                        <div className="course-footer">
                                            <div className="course-price text-accent">${course.price}</div>
                                            <Link to={`/course/${course.id}`} className="btn-secondary add-btn" style={{ textDecoration: 'none' }}>Details</Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="pagination animate-slide-fade">
                        <button className={`page-btn ${activePage === 1 ? 'active' : ''}`} onClick={() => handlePageChange(1)}>1</button>
                        <button className={`page-btn ${activePage === 2 ? 'active' : ''}`} onClick={() => handlePageChange(2)}>2</button>
                        <button className={`page-btn ${activePage === 3 ? 'active' : ''}`} onClick={() => handlePageChange(3)}>3</button>
                        <span>...</span>
                        <button className="page-btn" onClick={() => handlePageChange(activePage < 3 ? activePage + 1 : 1)}>Next</button>
                    </div>
                </main>
            </div >
        </div >
    );
}
