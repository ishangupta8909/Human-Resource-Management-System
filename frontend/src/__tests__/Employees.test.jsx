import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Employees from '../pages/Employees';

// Mock the employeeService module
vi.mock('../api', () => {
  return {
    employeeService: {
      getAll: () => Promise.resolve({ data: [] }),
      create: () => Promise.reject({ response: { data: { detail: 'Email already registered' } } }),
      update: () => Promise.resolve(),
      delete: () => Promise.resolve(),
    },
  };
});

describe('Employees form error display', () => {
  test('shows server error when create fails', async () => {
    render(<Employees />);

    // Open the add form
    const button = await screen.findByText(/Register New/i);
    fireEvent.click(button);

    // Fill form
    fireEvent.change(screen.getByPlaceholderText(/e.g. EMP-001/i), { target: { value: 'EMP-99' } });
    fireEvent.change(screen.getByPlaceholderText(/John Doe/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText(/john@company.com/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Engineering/i), { target: { value: 'Eng' } });

    // Submit form
    fireEvent.click(screen.getByText(/Create Employee Profile/i));

    // Expect error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Email already registered/i)).toBeInTheDocument();
    });
  });
});

