import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Award, Download, Printer } from 'lucide-react';
import './Certificate.css';

export default function CertificateView() {
    const { code } = useParams();
    const navigate = useNavigate();
    const [certData, setCertData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllCerts = async () => {
            try {
                // To fetch details without a dedicated specific cert endpoint, 
                // we'll just check against the user's available certs
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/learn/my-certificates', {
                    headers: { 'x-auth-token': token }
                });
                const myCerts = res.data;
                const found = myCerts.find(c => c.certificate_code === code);
                if (found) {
                    setCertData(found);
                } else {
                    alert("Certificate not found or unauthorized");
                    navigate('/dashboard');
                }
            } catch (err) {
                console.error('Error fetching cert:', err);
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchAllCerts();
    }, [code, navigate]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <div className="text-center p-8">Loading certificate...</div>;
    if (!certData) return null;

    const dateStr = new Date(certData.issued_at).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    // Mocking student name getting derived (since we didn't fetch the student's full name directly in `my-certificates`, let's pull it from localStorage/AuthContext if possible, but for simplicity let's read the authenticated user data from /api/auth/me)
    const storedUserStr = localStorage.getItem('token'); // actually we don't have user string
    // Let's just use a generic name or we fetch /auth/me
    
    return (
        <div className="certificate-page-container">
            <div className="certificate-actions no-print">
                <button onClick={() => navigate(-1)} className="btn btn-secondary mr-2">Go Back</button>
                <button onClick={handlePrint} className="btn btn-primary animate-pop">
                    <Printer size={18} className="mr-2 inline" /> Print / Save PDF
                </button>
            </div>
            
            <div className="certificate-wrapper" id="printable-certificate">
                <div className="certificate-border">
                    <div className="certificate-content">
                        <div className="cert-header">
                            <Award size={64} className="cert-award-icon" color="#6C4CF1" />
                            <h1 className="cert-domain">HEXORIA ACADEMY</h1>
                            <div className="cert-sub">CERTIFICATE OF COMPLETION</div>
                        </div>

                        <div className="cert-body">
                            <p className="cert-text-small">This is proudly presented to</p>
                            <h2 className="cert-student-name">TutorPro Student</h2>
                            
                            <p className="cert-text-small">for successfully completing the course</p>
                            <h3 className="cert-course-name">{certData.course_title}</h3>
                            
                            <p className="cert-date text-muted">Issued on {dateStr}</p>
                        </div>

                        <div className="cert-footer">
                            <div className="cert-signature">
                                <div className="signature-line font-mono">{certData.instructor || 'Hexoria Admin'}</div>
                                <p className="cert-text-tiny">Course Instructor</p>
                            </div>
                            
                            <div className="cert-seal">
                                <div className="seal-inner">
                                    <span>CERTIFIED</span>
                                </div>
                            </div>
                            
                            <div className="cert-meta">
                                <p className="cert-text-tiny">Certificate ID: {certData.certificate_code}</p>
                                <p className="cert-text-tiny">Verify at: www.hexoria.com/verify</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
