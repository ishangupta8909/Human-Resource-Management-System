import React, { useState } from 'react';

const Calendar = ({ records, viewDate }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    React.useEffect(() => {
        if (viewDate && /^\d{4}-\d{2}-\d{2}$/.test(viewDate)) {
            const [y, m, d] = viewDate.split('-').map(Number);
            setCurrentDate(new Date(y, m - 1, d));
        }
    }, [viewDate]);

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const days = [];
    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);

    // Pad the beginning of the month
    for (let i = 0; i < startDay; i++) {
        days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= totalDays; i++) {
        days.push(i);
    }

    const getRecordForDay = (day) => {
        if (!day) return null;
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return records.find(r => r.date === dateStr);
    };

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return (
        <div style={{ color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem' }}>{monthNames[month]} {year}</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={() => setCurrentDate(new Date(year, month - 1))}
                        style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer' }}
                    >
                        &lt;
                    </button>
                    <button
                        onClick={() => setCurrentDate(new Date(year, month + 1))}
                        style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer' }}
                    >
                        &gt;
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center' }}>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                    <div key={d} style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>{d}</div>
                ))}
                {days.map((day, idx) => {
                    const record = getRecordForDay(day);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const checkDate = day ? new Date(year, month, day) : null;
                    const isFuture = checkDate && checkDate > today;
                    const isSunday = checkDate && checkDate.getDay() === 0;
                    const isDisabled = isFuture || isSunday;

                    let bgColor = 'rgba(255,255,255,0.03)';
                    let dotColor = 'transparent';

                    if (record) {
                        if (record.status.toLowerCase() === 'present') {
                            bgColor = 'rgba(16, 185, 129, 0.1)';
                            dotColor = 'var(--success)';
                        } else {
                            bgColor = 'rgba(239, 68, 68, 0.1)';
                            dotColor = 'var(--danger)';
                        }
                    }

                    return (
                        <div
                            key={idx}
                            style={{
                                aspectRatio: '1',
                                background: day ? bgColor : 'transparent',
                                borderRadius: '10px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                position: 'relative',
                                border: day ? '1px solid var(--glass-border)' : 'none',
                                opacity: isDisabled ? 0.3 : 1,
                                filter: isDisabled ? 'grayscale(1)' : 'none',
                                cursor: isDisabled ? 'not-allowed' : 'default'
                            }}
                        >
                            {day}
                            {day && record && <div style={{
                                width: '4px',
                                height: '4px',
                                background: dotColor,
                                borderRadius: '50%',
                                position: 'absolute',
                                bottom: '6px'
                            }}></div>}
                        </div>
                    );
                })}
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></div>
                    <span style={{ color: 'var(--text-muted)' }}>Present</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--danger)' }}></div>
                    <span style={{ color: 'var(--text-muted)' }}>Absent</span>
                </div>
            </div>
        </div>
    );
};

export default Calendar;
