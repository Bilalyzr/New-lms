import React from 'react';
import { Users, Server, AlertCircle, Database } from 'lucide-react';
import './Dashboard.css';

export default function AdminDashboard() {
    const handleAction = (e, message) => {
        e.preventDefault();
        alert(message);
    };

    return (
        <div className="dashboard-page container animate-fade-up">
            <header className="dashboard-header mb-6">
                <h1 className="dashboard-title">Platform Administration</h1>
                <p className="text-muted">Manage global users, verify transactions, and view platform health.</p>
            </header>

            {/* PRD 148: Admin Dashboard Purple gradient cards */}
            <div className="stats-grid mb-8">
                <div className="stat-card card admin-purple-card">
                    <Users className="stat-icon" size={32} color="white" />
                    <div className="stat-info">
                        <span className="stat-value count-up text-white" style={{ color: 'white' }}>12,504</span>
                        <span className="stat-label text-white" style={{ color: 'rgba(255,255,255,0.8)' }}>Platform Users</span>
                    </div>
                </div>
                <div className="stat-card card admin-purple-card">
                    <Server className="stat-icon" size={32} color="white" />
                    <div className="stat-info">
                        <span className="stat-value count-up text-white" style={{ color: 'white' }}>99.9%</span>
                        <span className="stat-label" style={{ color: 'rgba(255,255,255,0.8)' }}>System Uptime</span>
                    </div>
                </div>
                <div className="stat-card card admin-purple-card">
                    <Database className="stat-icon" size={32} color="white" />
                    <div className="stat-info">
                        <span className="stat-value count-up text-white" style={{ color: 'white' }}>AWS RDS</span>
                        <span className="stat-label" style={{ color: 'rgba(255,255,255,0.8)' }}>Storage Health</span>
                    </div>
                </div>
            </div>

            <div className="grid-2-col">
                {/* User Management Module */}
                <section className="card p-5 shrink-0">
                    <h2 className="section-title text-xl mb-4 text-dark">Recent Flagged Activity</h2>
                    <div className="flagged-item mb-3 p-3 bg-light border-radius">
                        <div className="flex items-start justify-between">
                            <div className="flex gap-3">
                                <AlertCircle className="text-red mt-1" size={18} />
                                <div>
                                    <h4 className="font-bold text-sm">Failed Payment Webhook</h4>
                                    <p className="text-xs text-muted">Stripe integration returned error for User #1029</p>
                                </div>
                            </div>
                            {/* PRD: Danger actions: Soft red */}
                            <button className="btn-secondary btn-sm text-red hover-red-bg border-red" onClick={(e) => handleAction(e, 'Opening payment logs for User #1029...')}>Review</button>
                        </div>
                    </div>
                    <div className="flagged-item p-3 bg-light border-radius">
                        <div className="flex items-start justify-between">
                            <div className="flex gap-3">
                                <AlertCircle className="text-red mt-1" size={18} />
                                <div>
                                    <h4 className="font-bold text-sm">Course Approval Pending</h4>
                                    <p className="text-xs text-muted">"React Native Masterclass" by Sarah Connor waiting review</p>
                                </div>
                            </div>
                            <button className="btn btn-primary btn-sm" onClick={(e) => handleAction(e, 'Course React Native Masterclass securely approved!')}>Approve</button>
                        </div>
                    </div>
                </section>

                {/* Global Configuration Module */}
                <section className="card p-5 shrink-0">
                    <h2 className="section-title text-xl mb-4 text-dark">Quick Configs</h2>
                    <form onSubmit={(e) => handleAction(e, 'Global System Settings successfully updated and deployed to production!')}>
                        <div className="form-group">
                            <label className="text-sm font-bold text-muted mb-2 block">Platform Commission Rate (%)</label>
                            <input type="number" defaultValue={20} className="form-control" />
                        </div>
                        <button type="submit" className="btn btn-primary mt-3 w-full">Update Global Settings</button>
                    </form>
                </section>
            </div>

        </div>
    );
}
