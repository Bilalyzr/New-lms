import React, { useState, useEffect, useContext } from 'react';
import { Award, Download } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './Dashboard.css';

export default function Certificates() {
    const { user } = useContext(AuthContext);
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/learn/my-certificates', {
                    headers: { 'x-auth-token': user?.token }
                });
                setCertificates(res.data);
            } catch (err) {
                console.error('Error fetching certificates:', err);
            } finally {
                setLoading(false);
            }
        };

        if (user?.token) {
            fetchCertificates();
        }
    }, [user]);

    if (loading) return <div className="p-8 text-center text-muted">Loading your achievements...</div>;

    return (
        <div className="dashboard-page container animate-fade-up">
            <header className="dashboard-header mb-6">
                <h1 className="dashboard-title">My Certificates</h1>
                <p className="text-muted">A record of your successfully completed courses.</p>
            </header>

            {certificates.length === 0 ? (
                <div className="card text-center p-8">
                    <Award size={48} className="text-muted mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-bold mb-2">No certificates earned yet.</h3>
                    <p className="text-muted">Complete a course 100% to view your certificate here!</p>
                </div>
            ) : (
                <div className="grid-2-col">
                    {certificates.map(cert => (
                        <div key={cert.certificate_code} className="card flex flex-col items-center text-center p-6 border border-gray hover-scale">
                            <Award size={64} className="text-accent mb-4" />
                            <h3 className="text-lg font-bold mb-1">{cert.course_title}</h3>
                            <p className="text-sm text-muted mb-2">Instructor: {cert.instructor}</p>
                            <p className="text-xs bg-light p-2 rounded-full font-mono mt-2 mb-4 w-full">ID: {cert.certificate_code}</p>
                            <button 
                                className="btn btn-secondary w-full"
                                onClick={() => window.open(`/certificate/${cert.certificate_code}`, '_blank')}
                            >
                                <Download size={16} className="inline mr-2" /> Download Document
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
