import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { FileText, Save, Plus, Trash2 } from 'lucide-react';
import './Dashboard.css';

export default function QuizManager() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const toast = useToast();

    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        const fetchCurriculum = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/courses/${courseId}/curriculum`, {
                    headers: { 'x-auth-token': user?.token }
                });
                setSections(res.data);
            } catch (err) {
                console.error("Error fetching course curriculum:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCurriculum();
    }, [courseId, user]);

    const handleSelectQuiz = async (quiz) => {
        try {
            setSelectedQuiz(quiz);
            const res = await axios.get(`http://localhost:5000/api/courses/quiz/${quiz.id}`, {
                headers: { 'x-auth-token': user?.token }
            });
            setQuestions(res.data.questions || []);
        } catch (err) {
            console.error("Error fetching quiz questions", err);
            setQuestions([]);
        }
    };

    const handleAddQuestion = () => {
        setQuestions([
            ...questions,
            { id: Date.now(), question_text: '', correct_answer: '', options: ['', '', '', ''] }
        ]);
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = value;
        setQuestions(newQuestions);
    };

    const handleRemoveQuestion = (index) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const handleSaveQuiz = async () => {
        try {
            // Validation
            for (let q of questions) {
                if (!q.question_text || !q.correct_answer || q.options.some(opt => !opt)) {
                    toast.warning("Please fill in all fields for all questions.");
                    return;
                }
            }

            await axios.post(`http://localhost:5000/api/courses/quiz/${selectedQuiz.id}/questions`, { questions }, {
                headers: { 'x-auth-token': user?.token }
            });
            toast.success("Quiz saved successfully!");
        } catch (err) {
            console.error("Error saving quiz", err);
            toast.error("Failed to save quiz");
        }
    };

    if (loading) return <div className="p-8 text-center text-muted">Loading curriculum...</div>;

    return (
        <div className="dashboard-page container animate-fade-up">
            <header className="dashboard-header mb-6">
                <h1 className="dashboard-title">Quiz Manager</h1>
                <p className="text-muted">Manage question banks for your course quizzes.</p>
                <div className="mt-4">
                    <button className="btn btn-secondary" onClick={() => navigate('/instructor')}>Back to Dashboard</button>
                </div>
            </header>

            <div className="grid-2-col" style={{ gridTemplateColumns: '1fr 2fr' }}>
                <div className="card">
                    <h3 className="section-title text-lg mb-4">Course Quizzes</h3>
                    {sections.length === 0 && <p className="text-muted">No curriculum found.</p>}
                    
                    {sections.map((sec, i) => (
                        <div key={sec.id} className="mb-4">
                            <h4 className="font-bold text-sm text-dark mb-2 border-b pb-1">Section {i + 1}: {sec.title}</h4>
                            {(!sec.quizzes || sec.quizzes.length === 0) ? (
                                <p className="text-xs text-muted italic ml-2">No quizzes in this section.</p>
                            ) : (
                                <ul className="list-none ml-2 space-y-1">
                                    {sec.quizzes.map(quiz => (
                                        <li key={quiz.id}>
                                            <button 
                                                className={`text-sm w-full text-left py-2 px-3 rounded flex items-center gap-2 transition-colors ${selectedQuiz?.id === quiz.id ? 'bg-primary text-white' : 'hover:bg-light text-muted'}`}
                                                onClick={() => handleSelectQuiz(quiz)}
                                            >
                                                <FileText size={14} /> {quiz.title}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>

                <div className="card">
                    {selectedQuiz ? (
                        <>
                            <div className="flex justify-between items-center mb-6 border-b pb-4">
                                <h3 className="section-title text-xl text-dark m-0">{selectedQuiz.title} Questions</h3>
                                <button className="btn btn-primary btn-sm flex items-center gap-2" onClick={handleSaveQuiz}>
                                    <Save size={16} /> Save Changes
                                </button>
                            </div>

                            {questions.length === 0 ? (
                                <div className="text-center p-8 bg-light rounded border border-dashed">
                                    <p className="text-muted mb-4">This quiz has no questions yet.</p>
                                    <button className="btn btn-secondary" onClick={handleAddQuestion}>+ Add First Question</button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {questions.map((q, qIndex) => (
                                        <div key={qIndex} className="p-4 bg-gray-50 border border-gray-200 rounded-lg relative">
                                            <button 
                                                className="absolute top-4 right-4 text-red-500 hover:text-red-700" 
                                                onClick={() => handleRemoveQuestion(qIndex)}
                                                title="Remove Question"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            
                                            <div className="form-group mb-4 w-11/12">
                                                <label className="text-sm font-bold text-dark">Question {qIndex + 1}</label>
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    placeholder="Enter question text..."
                                                    value={q.question_text || ''}
                                                    onChange={(e) => handleQuestionChange(qIndex, 'question_text', e.target.value)}
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                {q.options.map((opt, oIndex) => (
                                                    <div className="form-group mb-0" key={oIndex}>
                                                        <label className="text-xs text-muted block mb-1">Option {oIndex + 1}</label>
                                                        <input 
                                                            type="text" 
                                                            className="form-control text-sm py-1 px-2" 
                                                            placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                                                            value={opt || ''}
                                                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                                        />
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="form-group m-0 mt-2 p-3 bg-blue-50 bg-opacity-50 border border-blue-100 rounded">
                                                <label className="text-xs font-bold text-primary block mb-1">Correct Answer</label>
                                                <select 
                                                    className="form-control text-sm py-1 px-2"
                                                    value={q.correct_answer || ''}
                                                    onChange={(e) => handleQuestionChange(qIndex, 'correct_answer', e.target.value)}
                                                >
                                                    <option value="" disabled>Select correct option text</option>
                                                    {q.options.filter(o => o.trim() !== '').map((opt, oIdx) => (
                                                        <option key={oIdx} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    ))}

                                    <button className="btn btn-secondary w-full border-dashed" onClick={handleAddQuestion}>
                                        <Plus size={16} className="inline mr-2" /> Add Another Question
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="h-full flex items-center justify-center text-muted p-8 text-center min-h-[300px]">
                            <p>Select a quiz from the left panel to manage its questions.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
