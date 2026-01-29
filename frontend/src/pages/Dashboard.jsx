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
        </div>
    );
};

export default Dashboard;
