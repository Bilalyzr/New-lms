import React, { useState } from 'react';
import { Play, CheckCircle, Circle, ChevronLeft, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './CoursePlayer.css';

export default function CoursePlayer() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeLessonId, setActiveLessonId] = useState(1);
    const [completedLessons, setCompletedLessons] = useState([1]);

    const curriculum = [
        {
            section: 'Section 1: Introduction to Cloud Architecture',
            duration: '42min',
            lessons: [
                { id: 1, title: '1. Welcome to the Course', time: '05:30' },
                { id: 2, title: '2. Setting up your environment', time: '10:22' },
                { id: 3, title: '3. AWS Architecture Overview', time: '15:45' },
                { id: 4, title: '4. Understanding IAM roles', time: '10:23' },
            ]
        },
        {
            section: 'Section 2: Building the Frontend Layer',
            duration: '1h 15min',
            lessons: [
                { id: 5, title: '1. React foundations', time: '22:10' },
                { id: 6, title: '2. Connecting to our API', time: '35:00' },
                { id: 7, title: '3. State Management', time: '18:05' },
            ]
        }
    ];

    // Helper variables
    const totalLessonsCount = curriculum.reduce((total, section) => total + section.lessons.length, 0);
    const completedCount = completedLessons.length;
    const progressPercentage = Math.round((completedCount / totalLessonsCount) * 100);

    const toggleLessonComplete = (lessonId) => {
        if (completedLessons.includes(lessonId)) {
            setCompletedLessons(completedLessons.filter(id => id !== lessonId));
        } else {
            setCompletedLessons([...completedLessons, lessonId]);
        }
    };

    const getActiveLesson = () => {
        for (let section of curriculum) {
            const lesson = section.lessons.find(l => l.id === activeLessonId);
            if (lesson) return lesson;
        }
        return null;
    };

    const currentLesson = getActiveLesson();

    return (
        <div className="course-player-page">
            {/* Player Header */}
            <header className="player-header">
                <div className="flex items-center gap-4">
                    <button className="icon-btn text-white" onClick={() => navigate('/dashboard')} title="Back to Dashboard">
                        <ChevronLeft size={24} />
                    </button>
                    <div className="vertical-divider"></div>
                    <div>
                        <h1 className="course-title-small">Full-Stack Cloud Applied Architecture</h1>
                        <p className="text-xs text-muted mt-1">Instructor: Tom Harris</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="progress-tracker">
                        <div className="progress-info">
                            <span className="text-sm font-bold">{progressPercentage}% Complete</span>
                            <span className="text-sm text-gray">{completedCount} / {totalLessonsCount} Lessons</span>
                        </div>
                        <div className="progress-bar-container">
                            <div className="progress-fill-player" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                    </div>

                    <button
                        className="icon-btn text-white toggle-sidebar-btn"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        title="Toggle Sidebar"
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </header>

            <div className="player-layout">
                {/* Main Video Area */}
                <main className={`video-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
                    <div className="video-player-wrapper animate-fade-in-load">
                        {/* Simulated Video Player */}
                        <div className="simulated-video">
                            <Play size={64} className="play-icon-large text-primary" />
                            <div className="video-controls">
                                <div className="playback-bar"></div>
                                <span className="time-display">00:00 / {currentLesson?.time}</span>
                            </div>
                        </div>
                    </div>

                    <div className="lesson-details p-6">
                        <h2 className="text-xl font-bold mb-2">{currentLesson?.title}</h2>
                        <div className="flex items-center gap-4 text-muted border-bottom-dark pb-6">
                            <button
                                className={`btn btn-sm ${completedLessons.includes(activeLessonId) ? 'btn-success' : 'btn-secondary'}`}
                                onClick={() => toggleLessonComplete(activeLessonId)}
                            >
                                {completedLessons.includes(activeLessonId) ? (
                                    <><CheckCircle size={16} className="mr-2" /> Completed</>
                                ) : (
                                    <><Circle size={16} className="mr-2" /> Mark as Complete</>
                                )}
                            </button>
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => alert('Downloading: "Cloud_Arch_Cheatsheet.pdf"')}
                            >
                                Download Resources
                            </button>
                        </div>
                    </div>
                </main>

                {/* Learning Sidebar */}
                <aside className={`learning-sidebar ${sidebarOpen ? 'open' : 'closed'} scroll-animate-in`}>
                    <div className="sidebar-header-sticky">
                        <h3 className="font-bold">Course Content</h3>
                    </div>

                    <div className="curriculum-list-player">
                        {curriculum.map((section, sIdx) => (
                            <div className="player-section" key={sIdx}>
                                <div className="player-section-header text-gray">
                                    <h4>{section.section}</h4>
                                    <span className="text-xs">{section.duration}</span>
                                </div>

                                <div className="player-lessons">
                                    {section.lessons.map(lesson => {
                                        const isActive = activeLessonId === lesson.id;
                                        const isCompleted = completedLessons.includes(lesson.id);

                                        return (
                                            <div
                                                key={lesson.id}
                                                className={`player-lesson-item ${isActive ? 'active-lesson' : ''}`}
                                                onClick={() => setActiveLessonId(lesson.id)}
                                            >
                                                <div className="lesson-status-icon">
                                                    {isCompleted ? (
                                                        <CheckCircle size={16} className="text-accent animate-pop" />
                                                    ) : (
                                                        <Circle size={16} className="text-muted" />
                                                    )}
                                                </div>
                                                <div className="lesson-meta-info">
                                                    <span className={`lesson-name ${isCompleted && !isActive ? 'text-gray' : ''}`}>{lesson.title}</span>
                                                    <span className="lesson-play-time text-xs flex items-center gap-1 mt-1">
                                                        <Play size={10} /> {lesson.time}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>
            </div>
        </div>
    );
}
