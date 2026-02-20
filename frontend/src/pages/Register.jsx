import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Register() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        role: 'student' // users.role ENUM('student','instructor','admin') based on PRD
    });

    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { registerServer } = useAuth(); // fetch API context

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setIsLoading(true);

        // API Call
        const response = await registerServer(formData.fullName, formData.email, formData.password, formData.role);

        if (response.success) {
            navigate('/login');
        } else {
            setErrorMsg(response.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container mt-2">
            <div className="hexagon-bg" style={{ animationDelay: '2s' }}></div>
            <div className="auth-card card animate-fade-up">
                <div className="auth-header">
                    <h1 className="auth-title">Create an Account</h1>
                    <p className="text-muted">Join the premium learning network.</p>
                </div>

                {errorMsg && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-200">
                        {errorMsg}
                    </div>
                )}

                <form className="auth-form" onSubmit={handleRegister}>

                    <div className="form-group">
                        <label>Full Name</label>
                        <div className="input-with-icon">
                            <User className="input-icon text-muted" size={18} />
                            <input
                                type="text"
                                name="fullName"
                                className="form-control"
                                placeholder="John Doe"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <div className="input-with-icon">
                            <Mail className="input-icon text-muted" size={18} />
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-with-icon">
                            <Lock className="input-icon text-muted" size={18} />
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Account Role</label>
                        <div className="role-selector">
                            <label className={`role-option ${formData.role === 'student' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={formData.role === 'student'}
                                    onChange={handleChange}
                                />
                                <span className="role-name">Student</span>
                            </label>

                            <label className={`role-option ${formData.role === 'instructor' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="instructor"
                                    checked={formData.role === 'instructor'}
                                    onChange={handleChange}
                                />
                                <span className="role-name">Instructor</span>
                            </label>

                            <label className={`role-option ${formData.role === 'admin' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="admin"
                                    checked={formData.role === 'admin'}
                                    onChange={handleChange}
                                />
                                <span className="role-name flex items-center gap-1"><Shield size={14} /> Admin</span>
                            </label>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-full login-btn">
                        Create Account
                    </button>
                </form>

                <div className="auth-footer text-center mt-3">
                    <p className="text-muted">Already have an account? <Link to="/login" className="text-primary font-bold">Log in here</Link></p>
                </div>
            </div>
        </div>
    );
}
