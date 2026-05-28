import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Fully mock the hooks module
vi.mock('../src/hooks/useEmployees', () => ({
  useCountries: () => ({ data: [], isLoading: false }),
  useJobTitles: () => ({ data: [], isLoading: false }),
}));

// Need to import after mocks are set up
import EmployeeForm from '../src/components/employees/EmployeeForm';

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe('EmployeeForm', () => {
  it('renders all form fields', async () => {
    renderWithProviders(
      <EmployeeForm onSubmit={vi.fn()} onCancel={vi.fn()} isLoading={false} />
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    });
    expect(screen.getByLabelText(/job title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/salary/i)).toBeInTheDocument();
  });

  it('shows validation errors for empty form', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <EmployeeForm onSubmit={vi.fn()} onCancel={vi.fn()} isLoading={false} />
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /add employee/i }));
    expect(screen.getByText(/name must be at least/i)).toBeInTheDocument();
  });

  it('calls onSubmit with form data when valid', async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(
      <EmployeeForm onSubmit={handleSubmit} onCancel={vi.fn()} isLoading={false} />
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/job title/i), 'Engineer');
    await user.type(screen.getByLabelText(/country/i), 'USA');
    const salaryInput = screen.getByLabelText(/salary/i);
    await user.clear(salaryInput);
    await user.type(salaryInput, '75000');

    await user.click(screen.getByRole('button', { name: /add employee/i }));

    expect(handleSubmit).toHaveBeenCalledWith({
      fullName: 'John Doe',
      jobTitle: 'Engineer',
      country: 'USA',
      salary: 75000,
    });
  });

  it('pre-fills fields when editing', async () => {
    const employee = {
      id: 1, fullName: 'Jane Smith', jobTitle: 'Designer',
      country: 'Canada', salary: 80000,
      createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
    };

    renderWithProviders(
      <EmployeeForm employee={employee} onSubmit={vi.fn()} onCancel={vi.fn()} isLoading={false} />
    );

    await waitFor(() => {
      const input = screen.getByLabelText(/full name/i) as HTMLInputElement;
      expect(input.value).toBe('Jane Smith');
    });
    expect((screen.getByLabelText(/job title/i) as HTMLInputElement).value).toBe('Designer');
    expect((screen.getByLabelText(/country/i) as HTMLInputElement).value).toBe('Canada');
    expect((screen.getByLabelText(/salary/i) as HTMLInputElement).value).toBe('80000');
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const handleCancel = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(
      <EmployeeForm onSubmit={vi.fn()} onCancel={handleCancel} isLoading={false} />
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /cancel/i }));
    expect(handleCancel).toHaveBeenCalled();
  });
});