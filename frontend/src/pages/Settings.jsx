import React, { useState } from 'react';
import { User, Lock, CreditCard, Bell, Save, Check } from 'lucide-react';
import './Settings.css';

export default function Settings() {
    const [activeTab, setActiveTab] = useState('profile');
    const [showToast, setShowToast] = useState(false);

    const handleSave = (e) => {
        e.preventDefault();
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <div className="settings-page container animate-fade-up">
            <div className="page-header">
                <h1 className="page-title">Account Settings</h1>
                <p className="text-muted">Manage your profile, security, and preferences.</p>
            </div>

            <div className="settings-layout">
                {/* Settings Sidebar */}
                <aside className="settings-sidebar card shrink-0">
                    <button
                        className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <User size={18} /> Profile Details
                    </button>
                    <button
                        className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`}
                        onClick={() => setActiveTab('security')}
                    >
                        <Lock size={18} /> Security & Password
                    </button>
                    <button
                        className={`settings-tab ${activeTab === 'payout' ? 'active' : ''}`}
                        onClick={() => setActiveTab('payout')}
                    >
                        <CreditCard size={18} /> Payout Methods
                    </button>
                    <button
                        className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
                        onClick={() => setActiveTab('notifications')}
                    >
                        <Bell size={18} /> Email Notifications
                    </button>
                </aside>

                {/* Settings Content Area */}
                <main className="settings-content card animate-slide-fade" key={activeTab}>
                    {activeTab === 'profile' && (
                        <form onSubmit={handleSave}>
                            <h2 className="section-title mb-4">Profile Details</h2>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input type="text" className="form-control" defaultValue="John Doe" />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input type="email" className="form-control" defaultValue="john@example.com" />
                            </div>
                            <div className="form-group mb-4">
                                <label>Instructor Bio</label>
                                <textarea className="form-control" rows={4} defaultValue="Expert cloud architect matching Hexoria Academy's standards."></textarea>
                            </div>
                            <button type="submit" className="btn btn-save flex items-center gap-2">
                                <Save size={18} /> Save Changes
                            </button>
                        </form>
                    )}

                    {activeTab === 'security' && (
                        <form onSubmit={handleSave}>
                            <h2 className="section-title mb-4">Change Password</h2>
                            <div className="form-group">
                                <label>Current Password</label>
                                <input type="password" className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>New Password</label>
                                <input type="password" className="form-control" />
                            </div>
                            <button type="submit" className="btn btn-save flex items-center gap-2 mt-4">
                                Update Password
                            </button>
                        </form>
                    )}

                    {activeTab === 'notifications' && (
                        <form onSubmit={handleSave}>
                            <h2 className="section-title mb-4">Notification Preferences</h2>

                            <div className="toggle-group flex justify-between items-center mb-4">
                                <div>
                                    <h4 className="font-bold">Course Updates</h4>
                                    <p className="text-sm text-muted">Get emails when a course syllabus changes.</p>
                                </div>
                                <label className="switch">
                                    <input type="checkbox" defaultChecked />
                                    <span className="slider round"></span>
                                </label>
                            </div>

                            <div className="toggle-group flex justify-between items-center mb-6">
                                <div>
                                    <h4 className="font-bold">Promotional Emails</h4>
                                    <p className="text-sm text-muted">Receive offers, recommendations, and platform news.</p>
                                </div>
                                <label className="switch">
                                    <input type="checkbox" />
                                    <span className="slider round"></span>
                                </label>
                            </div>

                            <button type="submit" className="btn btn-save flex items-center gap-2">
                                Save Preferences
                            </button>
                        </form>
                    )}

                    {/* Payout missing just acts as a placeholder here */}
                    {activeTab === 'payout' && (
                        <div>
                            <h2 className="section-title mb-4">Payouts (Instructor Mode)</h2>
                            <p className="text-muted">Connect your Stripe account to receive automated payouts successfully.</p>
                            <button className="btn btn-primary mt-4" onClick={(e) => { e.preventDefault(); alert('Redirecting to Stripe OAuth secure flow...'); }}>Connect Stripe Account</button>
                        </div>
                    )}
                </main>
            </div>

            {/* Floating Save Toast */}
            <div className={`save-toast ${showToast ? 'show' : ''}`}>
                <Check size={18} /> Settings saved successfully!
            </div>
        </div>
    );
}
