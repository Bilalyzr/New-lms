import React, { useState, useEffect, useContext } from 'react';
import { Play, CheckCircle, Circle, ChevronLeft, Menu, FileText, Download } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './CoursePlayer.css';

export default function CoursePlayer() {
    const { id } = useParams(); // courseId
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const token = user?.token;

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeLesson, setActiveLesson] = useState(null);
    
    const [course, setCourse] = useState(null);
    const [curriculum, setCurriculum] = useState([]);
    const [enrollment, setEnrollment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [certLoading, setCertLoading] = useState(false);
    
    // Quiz State
    const [quizData, setQuizData] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [quizResult, setQuizResult] = useState(null);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/learn/${id}`, {
                    headers: { 'x-auth-token': token }
                });
                setCourse(res.data.course);
                setCurriculum(res.data.curriculum);
                setEnrollment(res.data.enrollment);
                
                // Set first lesson active if available
                if (res.data.curriculum.length > 0 && res.data.curriculum[0].lessons.length > 0) {
                    setActiveLesson(res.data.curriculum[0].lessons[0]);
                }
            } catch (err) {
                console.error('Failed to fetch course data', err);
                if (err.response?.status === 403) {
                    alert('You must enroll in this course first!');
                    navigate(`/course/${id}`);
                }
            } finally {
                setLoading(false);
            }
        };

        if (token && id) {
            fetchCourseData();
        }
    }, [id, token, navigate]);

    const toggleLessonComplete = async (lessonId) => {
        try {
            const res = await axios.post(`http://localhost:5000/api/learn/${id}/progress/${lessonId}`, {}, {
                headers: { 'x-auth-token': token }
            });
            
            // Update local state locally to reflect the change
            const updatedCurriculum = curriculum.map(section => {
                return {
                    ...section,
                    lessons: section.lessons.map(l => l.id === lessonId ? { ...l, completed: true } : l)
                };
            });
            setCurriculum(updatedCurriculum);
            
            // Update local progress
            setEnrollment({ ...enrollment, progress_percentage: res.data.progress });
            
            if (activeLesson?.id === lessonId) {
                setActiveLesson({ ...activeLesson, completed: true });
            }
        } catch (err) {
            console.error('Error marking lesson complete', err);
        }
    };

    useEffect(() => {
        if (activeLesson && activeLesson.isQuiz) {
            axios.get(`http://localhost:5000/api/courses/quiz/${activeLesson.id}`, {
                headers: { 'x-auth-token': token }
            }).then(res => {
                setQuizData(res.data);
                setSelectedAnswers({});
                setQuizResult(null);
            }).catch(console.error);
        } else {
            setQuizData(null);
        }
    }, [activeLesson, token]);

    const handleQuizSubmit = () => {
        if (!quizData) return;
        let correct = 0;
        quizData.questions.forEach((q, idx) => {
            if (selectedAnswers[idx] === q.correct_answer) correct++;
        });
        setQuizResult({ score: correct, total: quizData.questions.length });
    };

    const handleDownloadCertificate = async () => {
        if (enrollment?.progress_percentage < 100) return;
        setCertLoading(true);
        try {
            const res = await axios.post(`http://localhost:5000/api/learn/${id}/certificate`, {}, {
                headers: { 'x-auth-token': token }
            });
            navigate(`/certificate/${res.data.certificate_code}`);
        } catch (err) {
            console.error('Error getting certificate', err);
            alert('Could not generate certificate.');
        } finally {
            setCertLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading course player...</div>;
    if (!course) return <div className="p-8 text-center text-red-500">Course data not found.</div>;

    const progressPercentage = enrollment?.progress_percentage || 0;

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
                        <h1 className="course-title-small">{course.title}</h1>
                        <p className="text-xs text-muted mt-1">Keep up the great work!</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="progress-tracker">
                        <div className="progress-info">
                            <span className="text-sm font-bold">{progressPercentage}% Complete</span>
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
                        {activeLesson?.isQuiz ? (
                            <div className="quiz-container p-8 bg-white h-full overflow-y-auto">
                                {quizData ? (
                                    <>
                                        <h3 className="text-2xl font-bold mb-4">{quizData.title}</h3>
                                        <p className="text-muted mb-6">Answer the following questions to test your knowledge.</p>
                                        
                                        {quizData.questions.map((q, qIdx) => (
                                            <div key={q.id} className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                <h4 className="font-bold text-lg mb-3">{qIdx + 1}. {q.question_text}</h4>
                                                <div className="flex flex-col gap-2">
                                                    {q.options.map((opt, oIdx) => (
                                                        <label key={oIdx} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white rounded border border-transparent hover:border-gray-300">
                                                            <input 
                                                                type="radio" 
                                                                name={`question-${qIdx}`} 
                                                                value={opt}
                                                                checked={selectedAnswers[qIdx] === opt}
                                                                onChange={() => setSelectedAnswers({...selectedAnswers, [qIdx]: opt})}
                                                                disabled={quizResult !== null}
                                                            />
                                                            <span className={quizResult && opt === q.correct_answer ? 'text-green-600 font-bold' : ''}>{opt}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}

                                        {quizResult ? (
                                            <div className={`p-4 rounded-lg mt-4 text-center ${quizResult.score === quizResult.total && quizResult.total > 0 ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-blue-100 text-blue-800 border border-blue-300'}`}>
                                                <h4 className="text-xl font-bold">You scored {quizResult.score} out of {quizResult.total}!</h4>
                                                {quizResult.score === quizResult.total && quizResult.total > 0 && <p className="mb-0">Excellent work! Proceed to the next section.</p>}
                                            </div>
                                        ) : (
                                            <button 
                                                className="btn btn-primary w-full mt-4" 
                                                onClick={handleQuizSubmit}
                                                disabled={Object.keys(selectedAnswers).length < quizData.questions.length}
                                            >
                                                Submit Answers
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <div className="flex items-center justify-center p-12 text-muted">Loading quiz...</div>
                                )}
                            </div>
                        ) : (
                            <div className="simulated-video">
                                {activeLesson?.video_url ? (
                                    <iframe 
                                        width="100%" 
                                        height="100%" 
                                        src={activeLesson.video_url.replace("watch?v=", "embed/")} 
                                        frameBorder="0" 
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    <>
                                        <Play size={64} className="play-icon-large text-primary" />
                                        <div className="video-controls">
                                            <div className="playback-bar"></div>
                                            <span className="time-display">Simulation</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="lesson-details p-6">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-xl font-bold">{activeLesson?.title || 'Select a lesson'}</h2>
                            {progressPercentage === 100 && (
                                <button 
                                    onClick={handleDownloadCertificate}
                                    disabled={certLoading}
                                    className="btn btn-accent flex items-center gap-2"
                                >
                                    <Download size={18} /> 
                                    {certLoading ? 'Generating...' : 'Download Certificate'}
                                </button>
                            )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-muted border-bottom-dark pb-6">
                            <button
                                className={`btn btn-sm ${activeLesson?.completed ? 'btn-success' : 'btn-secondary'}`}
                                onClick={() => activeLesson && toggleLessonComplete(activeLesson.id)}
                            >
                                {activeLesson?.completed ? (
                                    <><CheckCircle size={16} className="mr-2" /> Completed</>
                                ) : (
                                    <><Circle size={16} className="mr-2" /> Mark as Complete</>
                                )}
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
                            <div className="player-section" key={section.id || sIdx}>
                                <div className="player-section-header text-gray">
                                    <h4>{section.title}</h4>
                                </div>

                                <div className="player-lessons">
                                    {(() => {
                                        const items = [
                                            ...(section.lessons || []).map(l => ({...l, isQuiz: false})),
                                            ...(section.quizzes || []).map(q => ({...q, isQuiz: true}))
                                        ].sort((a, b) => a.order_index - b.order_index);

                                        return items.map((item, idx) => {
                                            const isActive = activeLesson?.id === item.id && activeLesson?.isQuiz === item.isQuiz;
                                            const isCompleted = item.completed; // Quizzes don't track completion yet in lesson_progress

                                            return (
                                                <div
                                                    key={`${item.isQuiz ? 'q' : 'l'}-${item.id}`}
                                                    className={`player-lesson-item ${isActive ? 'active-lesson' : ''}`}
                                                    onClick={() => setActiveLesson(item)}
                                                >
                                                    <div className="lesson-status-icon">
                                                        {isCompleted ? (
                                                            <CheckCircle size={16} className="text-accent animate-pop" />
                                                        ) : (
                                                            item.isQuiz ? <FileText size={16} className="text-accent" /> : <Circle size={16} className="text-muted" />
                                                        )}
                                                    </div>
                                                    <div className="lesson-meta-info">
                                                        <span className={`lesson-name ${isCompleted && !isActive ? 'text-gray' : ''}`}>{item.title}</span>
                                                        <span className="lesson-play-time text-xs flex items-center gap-1 mt-1">
                                                            {item.isQuiz ? <FileText size={10} /> : <Play size={10} />} {item.isQuiz ? 'Quiz' : 'Video'}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        });
                                    })()}
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>
            </div>
        </div>
    );
}
