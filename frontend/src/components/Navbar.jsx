import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Hexagon, Bell, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container container">
                {/* Left Side: Logo, Auth buttons, and Links */}
                <div className="flex items-center gap-6">
                    <Link to="/" className="logo flex items-center gap-2 text-xl font-bold">
                        <div className="logo-3d-wrapper">
                            <Hexagon className="logo-layer-1" size={28} />
                            <Hexagon className="logo-layer-2" size={28} />
                            <Hexagon className="logo-layer-3" size={28} />
                        </div>
                        <span className="ml-1">Hexoria Academy</span>
                    </Link>

                    {/* Auth buttons moved to the left corner, right after the logo */}
                    {!user && (
                        <div className="auth-buttons flex gap-3 mr-2">
                            <Link to="/login" className="btn btn-secondary btn-sm">Log In</Link>
                            <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
                        </div>
                    )}

                    <div className="nav-links flex items-center gap-4">
                        <Link to="/courses" className="nav-link">Courses</Link>

                        {/* Render standard links based on user status/role */}
                        {user?.role === 'student' && (
                            <>
                                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                                <Link to="/my-courses" className="nav-link">My Courses</Link>
                                <Link to="/cart" className="nav-link">Cart</Link>
                            </>
                        )}

                        {user?.role === 'instructor' && (
                            <>
                                <Link to="/instructor" className="nav-link">Dashboard</Link>
                                <Link to="/instructor/courses" className="nav-link">My Courses</Link>
                                <Link to="/build" className="nav-link text-accent">Builder</Link>
                            </>
                        )}

                        {user?.role === 'admin' && (
                            <>
                                <Link to="/admin" className="nav-link">Dashboard</Link>
                                <Link to="/admin/users" className="nav-link">Users</Link>
                                <Link to="/admin/courses" className="nav-link">Courses</Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Right Side: Auth buttons / Notifications */}
                <div className="nav-right flex items-center gap-4">
                    {/* Authenticated right-side actions remain on right */}
                    {user && (
                        <div className="flex items-center gap-4">
                            <Link to="/notifications" className="nav-link icon-link relative" title="Notifications">
                                <Bell size={20} />
                                <span className="notif-dot"></span>
                            </Link>

                            <Link to="/settings" className="nav-link icon-link" title="Settings">
                                <Settings size={20} />
                            </Link>

                            <button onClick={handleLogout} className="btn-secondary btn-sm ml-4 flex items-center gap-2">
                                <LogOut size={16} /> Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
