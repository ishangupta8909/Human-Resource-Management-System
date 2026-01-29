import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Table, TableSkeleton } from '../components/common';
import { employeeService } from '../api';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        employee_id: '',
        full_name: '',
        email: '',
        department: ''
    });
    const [error, setError] = useState('');
    const [editingEmployee, setEditingEmployee] = useState(null);

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

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEdit = (emp) => {
        setEditingEmployee(emp);
        setFormData({
            employee_id: emp.employee_id,
            full_name: emp.full_name,
            email: emp.email,
            department: emp.department
        });
        setShowAddForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (editingEmployee) {
                await employeeService.update(editingEmployee.id, formData);
            } else {
                await employeeService.create(formData);
            }
            setFormData({ employee_id: '', full_name: '', email: '', department: '' });
            setEditingEmployee(null);
            setShowAddForm(false);
            fetchEmployees();
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to save employee');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await employeeService.delete(id);
                fetchEmployees();
            } catch (err) {
                alert('Failed to delete employee');
            }
        }
    };

    if (loading) return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem' }}>Employee <span style={{ color: 'var(--primary)' }}>Base</span></h1>
            </div>
            <TableSkeleton rows={8} cols={4} />
        </div>
    );

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem' }}>Employee <span style={{ color: 'var(--primary)' }}>Base</span></h1>
                <Button onClick={() => {
                    if (showAddForm) {
                        setEditingEmployee(null);
                        setFormData({ employee_id: '', full_name: '', email: '', department: '' });
                    }
                    setShowAddForm(!showAddForm);
                }} style={{ padding: '1rem 2rem', borderRadius: '18px' }}>
                    {showAddForm ? 'Close Editor' : 'Register New'}
                </Button>
            </div>

            {showAddForm && (
                <Card title={editingEmployee ? `Editing: ${editingEmployee.full_name}` : "Recruitment Form"} className="fade-in" style={{ marginBottom: '3rem', border: `1px solid ${editingEmployee ? 'var(--secondary)' : 'var(--primary)'}` }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                            <Input label="System ID" name="employee_id" placeholder="e.g. EMP-001" value={formData.employee_id} onChange={handleInputChange} required />
                            <Input label="Legal Name" name="full_name" placeholder="John Doe" value={formData.full_name} onChange={handleInputChange} required />
                            <Input label="Work Email" type="email" name="email" placeholder="john@company.com" value={formData.email} onChange={handleInputChange} required />
                            <Input label="Assigned Dept" name="department" placeholder="Engineering" value={formData.department} onChange={handleInputChange} required />
                        </div>
                        {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '12px', color: 'var(--danger)', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 500 }}>{error}</div>}
                        <Button type="submit" variant="primary">{editingEmployee ? "Update Record" : "Create Employee Profile"}</Button>
                    </form>
                </Card>
            )}

            <Card style={{ padding: '1rem' }}>
                <Table headers={['Identity', 'Organization', 'Communications', 'Operations']}>
                    {employees.map(emp => (
                        <tr key={emp.id} style={{ transition: 'all 0.2s ease' }} className="table-row-hover">
                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                <div style={{ fontSize: '1rem', fontWeight: 600 }}>{emp.full_name}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{emp.employee_id}</div>
                            </td>
                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                <span style={{ fontWeight: 500 }}>{emp.department}</span>
                            </td>
                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                <div style={{ fontSize: '0.85rem' }}>{emp.email}</div>
                            </td>
                            <td style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: '0.5rem' }}>
                                <Button variant="outline" onClick={() => handleEdit(emp)} style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', borderColor: 'var(--secondary)', color: 'var(--secondary)' }}>Edit</Button>
                                <Button variant="danger" onClick={() => handleDelete(emp.id)} style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Terminate</Button>
                            </td>
                        </tr>
                    ))}
                </Table>
            </Card>
        </div>
    );
};

export default Employees;
