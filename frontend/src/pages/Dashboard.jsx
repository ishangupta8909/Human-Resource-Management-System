import React, { useState, useEffect } from 'react';
import { Card, CardSkeleton } from '../components/common';
import { attendanceService } from '../api';

const Dashboard = () => {
    const [summary, setSummary] = useState({
        total_employees: 0,
        total_present_today: 0,
        total_absent_today: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        attendanceService.getTodaySummary()
            .then(res => setSummary(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="fade-in">
            <h1 style={{ marginBottom: '2.5rem', fontSize: '2.5rem' }}>Dashboard <span style={{ color: 'var(--primary)' }}>Overview</span></h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
            </div>
        </div>
    );

    return (
        <div className="fade-in">
            <h1 style={{ marginBottom: '2.5rem', fontSize: '2.5rem' }}>Dashboard <span style={{ color: 'var(--primary)' }}>Overview</span></h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <Card title="Total Employees">
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                        <span style={{ fontSize: '3.5rem', fontWeight: 700, color: 'var(--primary)', textShadow: '0 0 20px var(--primary-glow)' }}>{summary.total_employees}</span>
                        <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Active Records</span>
                    </div>
                </Card>
                <Card title="Present Today">
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                        <span style={{ fontSize: '3.5rem', fontWeight: 700, color: 'var(--success)' }}>{summary.total_present_today}</span>
                        <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>On Duty</span>
                    </div>
                </Card>
                <Card title="Absent Today">
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                        <span style={{ fontSize: '3.5rem', fontWeight: 700, color: 'var(--danger)' }}>{summary.total_absent_today}</span>
                        <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>On Leave</span>
                    </div>
                </Card>
            </div>

            <Card title="Recent Activity" style={{ marginTop: '2.5rem' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Employee ID</th>
                                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Date</th>
                                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(summary.recent_activity || []).map(record => (
                                <tr key={record.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem', fontWeight: 500 }}>EMP-{record.employee_id}</td>
                                    <td style={{ padding: '1rem' }}>{record.date}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            fontWeight: 600,
                                            background: record.status === 'Present' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                            color: record.status === 'Present' ? '#10b981' : '#ef4444',
                                            border: `1px solid ${record.status === 'Present' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                                        }}>
                                            {record.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {(!summary.recent_activity || summary.recent_activity.length === 0) && (
                                <tr>
                                    <td colSpan="3" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No recent activity found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Dashboard;
