import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '', role: 'student' });
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = (e) => {
        e.preventDefault();

        // Context API Simulation: Set role in global state
        login(formData.role);

        // Routing logic based on defined page view system (Role)
        if (formData.role === 'admin') {
            navigate('/admin');
        } else if (formData.role === 'instructor') {
            navigate('/instructor');
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <div className="auth-container">
            <div className="hexagon-bg" style={{ animationDelay: '0s' }}></div>
            <div className="auth-card card animate-fade-up">
                <div className="auth-header">
                    <h1 className="auth-title">Welcome Back</h1>
                    <p className="text-muted">Log in to your Hexoria Academy account to continue learning.</p>
                </div>

                <form className="auth-form" onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Simulate Login Role</label>
                        <div className="role-selector mb-4">
                            <label className={`role-option ${formData.role === 'student' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={formData.role === 'student'}
                                    onChange={handleChange}
                                />
                                <span className="role-name font-bold">Student</span>
                            </label>

                            <label className={`role-option ${formData.role === 'instructor' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="instructor"
                                    checked={formData.role === 'instructor'}
                                    onChange={handleChange}
                                />
                                <span className="role-name font-bold">Instructor</span>
                            </label>

                            <label className={`role-option ${formData.role === 'admin' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="admin"
                                    checked={formData.role === 'admin'}
                                    onChange={handleChange}
                                />
                                <span className="role-name font-bold">Admin</span>
                            </label>
                        </div>
                    </div>

                    <div className="form-group mt-2">
                        <label>Email Address</label>
                        <div className="input-with-icon">
                            <Mail className="input-icon text-muted" size={18} />
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder={`you@${formData.role}.com`}
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group mt-3">
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
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-full login-btn mt-4">
                        Log In <LogIn size={18} className="ml-2" />
                    </button>
                </form>

                <div className="auth-footer text-center mt-3">
                    <p className="text-muted">Don't have an account? <Link to="/register" className="text-primary font-bold">Sign up here</Link></p>
                </div>
            </div>
        </div>
    );
}
