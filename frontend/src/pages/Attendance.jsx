import React, { useState, useEffect } from 'react';
import { Card, Button, Table, TableSkeleton, CalendarSkeleton, Toast, ConfirmDialog } from '../components/common';
import { employeeService, attendanceService } from '../api';

import Calendar from '../components/Calendar';

const Attendance = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [toast, setToast] = useState(null);
    const [confirm, setConfirm] = useState({ visible: false, empId: null, fromStatus: null, toStatus: null, message: '' });

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await employeeService.getAll();
            setEmployees(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewAttendance = async (emp) => {
        setSelectedEmployee(emp);
        try {
            const res = await attendanceService.getForEmployee(emp.id);
            setAttendanceRecords(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleMarkAttendance = async (empId, status) => {
        try {
            // Find employee name
            const employee = employees.find(emp => emp.id === empId);
            const employeeName = employee ? employee.full_name : 'Employee';

            // Check if attendance already exists for this date
            let shouldProceed = true;

            try {
                const checkResponse = await attendanceService.checkExists(empId, selectedDate);

                if (checkResponse.data.exists) {
                    const existingStatus = checkResponse.data.status;
                    const confirmMessage = `Attendance for ${employeeName} on ${selectedDate} is already marked as "${existingStatus}". Do you want to change it to "${status}"?`;

                    // Show in-app confirm dialog
                    setConfirm({
                        visible: true,
                        empId,
                        fromStatus: existingStatus,
                        toStatus: status,
                        message: confirmMessage,
                    });
                    return;
                }
            } catch (checkErr) {
                // If check fails, proceed anyway (might be first time marking)
                console.warn('Failed to check existing attendance, proceeding with marking:', checkErr);
            }

            // Proceed with marking attendance (no existing record)
            await attendanceService.mark(empId, { date: selectedDate, status });
            if (selectedEmployee && selectedEmployee.id === empId) {
                handleViewAttendance(selectedEmployee);
            }
            const toastType = status === 'Absent' ? 'danger' : 'success';
            setToast({ message: `Attendance marked as ${status} for ${employeeName} on ${selectedDate}`, type: toastType });
        } catch (err) {
            console.error('Failed to mark attendance:', err);
            setToast({ message: 'Failed to mark attendance. Note: Cannot mark for future dates.', type: 'danger' });
        }
    };

    const proceedMarkAfterConfirm = async () => {
        const { empId, toStatus } = confirm;
        setConfirm({ visible: false, empId: null, fromStatus: null, toStatus: null, message: '' });
        try {
            const employee = employees.find(emp => emp.id === empId);
            const employeeName = employee ? employee.full_name : 'Employee';
            await attendanceService.mark(empId, { date: selectedDate, status: toStatus });
            if (selectedEmployee && selectedEmployee.id === empId) {
                handleViewAttendance(selectedEmployee);
            }
            const toastType = toStatus === 'Absent' ? 'danger' : 'success';
            setToast({ message: `Attendance updated to ${toStatus} for ${employeeName} on ${selectedDate}`, type: toastType });
        } catch (err) {
            console.error('Failed to mark attendance:', err);
            setToast({ message: 'Failed to update attendance.', type: 'danger' });
        }
    };

    if (loading) return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Attendance <span style={{ color: 'var(--primary)' }}>Control</span></h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--glass-bg)', padding: '0.75rem 1.25rem', borderRadius: '18px', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-lg)' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Attendance Date:</span>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            fontSize: '1rem',
                            fontWeight: 600,
                            outline: 'none',
                            cursor: 'pointer'
                        }}
                    />
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2.5rem' }}>
                <TableSkeleton rows={10} cols={2} />
                <Card style={{ padding: '2.5rem' }}>
                    <CalendarSkeleton />
                </Card>
            </div>
        </div>
    );

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Attendance <span style={{ color: 'var(--primary)' }}>Control</span></h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--glass-bg)', padding: '0.75rem 1.25rem', borderRadius: '18px', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-lg)' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Registry Date:</span>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            fontSize: '1rem',
                            fontWeight: 600,
                            outline: 'none',
                            cursor: 'pointer'
                        }}
                    />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2.5rem' }}>
                <Card title="Operational Roster">
                    <Table headers={['Professional', 'Metrics', 'Operations']}>
                        {employees.map(emp => (
                            <tr key={emp.id} style={{ transition: 'all 0.2s ease' }} className="table-row-hover">
                                <td style={{ padding: '1.25rem 1.5rem' }}>
                                    <div style={{ fontWeight: 600 }}>{emp.full_name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{emp.department}</div>
                                </td>
                                <td style={{ padding: '1.25rem 1.5rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Present Days</span>
                                        <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{emp.present_count || 0}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                    <Button variant="outline" style={{ borderColor: 'rgba(16, 185, 129, 0.3)', color: '#10b981', padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => handleMarkAttendance(emp.id, 'Present')}>Check In</Button>
                                    <Button variant="outline" style={{ borderColor: 'rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => handleMarkAttendance(emp.id, 'Absent')}>Off</Button>
                                    <Button variant="primary" onClick={() => handleViewAttendance(emp)} style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>History</Button>
                                </td>
                            </tr>
                        ))}
                    </Table>
                </Card>

                <Card title={selectedEmployee ? `Employee: ${selectedEmployee.full_name}` : 'Employee Access'}>
                    {selectedEmployee ? (
                        <Calendar records={attendanceRecords} />
                    ) : (
                        <div style={{ padding: '6rem 2rem', textAlign: 'center', color: 'var(--text-muted)', border: '2px dashed var(--glass-border)', borderRadius: '24px' }}>
                            Select a employee to view their attendance records.
                        </div>
                    )}
                </Card>
            </div>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <ConfirmDialog
                visible={confirm.visible}
                title="Confirm change"
                message={confirm.message}
                onConfirm={proceedMarkAfterConfirm}
                onCancel={() => setConfirm({ visible: false, empId: null, fromStatus: null, toStatus: null, message: '' })}
            />
        </div>
    );
};

export default Attendance;
