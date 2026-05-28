import { useState, useEffect } from 'react';
import type { EmployeeFormData, Employee } from '../../types';
import { useCountries, useJobTitles } from '../../hooks/useEmployees';

interface Props {
  employee?: Employee | null;
  onSubmit: (data: EmployeeFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const defaultForm: EmployeeFormData = {
  fullName: '',
  jobTitle: '',
  country: '',
  salary: 0,
};

export default function EmployeeForm({ employee, onSubmit, onCancel, isLoading }: Props) {
  const [form, setForm] = useState<EmployeeFormData>(defaultForm);
  const [errors, setErrors] = useState<Partial<Record<keyof EmployeeFormData, string>>>({});
  const { data: countries = [] } = useCountries();
  const { data: jobTitles = [] } = useJobTitles();

  useEffect(() => {
    if (employee) {
      setForm({
        fullName: employee.fullName,
        jobTitle: employee.jobTitle,
        country: employee.country,
        salary: employee.salary,
      });
    } else {
      setForm(defaultForm);
    }
  }, [employee]);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!form.fullName.trim() || form.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }
    if (!form.jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required';
    }
    if (!form.country.trim()) {
      newErrors.country = 'Country is required';
    }
    if (form.salary <= 0) {
      newErrors.salary = 'Salary must be a positive number';
    }
    if (form.salary > 10_000_000) {
      newErrors.salary = 'Salary must not exceed 10,000,000';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(form);
    }
  };

  const set = (field: keyof EmployeeFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = field === 'salary' ? Number(e.target.value) : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          type="text"
          value={form.fullName}
          onChange={set('fullName')}
          className={`mt-1 block w-full rounded-md border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
          placeholder="John Doe"
        />
        {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Job Title</label>
        <input
          type="text"
          value={form.jobTitle}
          onChange={set('jobTitle')}
          list="jobTitles"
          className={`mt-1 block w-full rounded-md border ${errors.jobTitle ? 'border-red-500' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
          placeholder="e.g. Software Engineer"
        />
        <datalist id="jobTitles">
          {jobTitles.map((t) => <option key={t} value={t} />)}
        </datalist>
        {errors.jobTitle && <p className="mt-1 text-sm text-red-500">{errors.jobTitle}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Country</label>
        <input
          type="text"
          value={form.country}
          onChange={set('country')}
          list="countries"
          className={`mt-1 block w-full rounded-md border ${errors.country ? 'border-red-500' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
          placeholder="e.g. United States"
        />
        <datalist id="countries">
          {countries.map((c) => <option key={c} value={c} />)}
        </datalist>
        {errors.country && <p className="mt-1 text-sm text-red-500">{errors.country}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Salary (USD)</label>
        <input
          type="number"
          value={form.salary || ''}
          onChange={set('salary')}
          className={`mt-1 block w-full rounded-md border ${errors.salary ? 'border-red-500' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
          placeholder="75000"
          min={0}
          max={10_000_000}
        />
        {errors.salary && <p className="mt-1 text-sm text-red-500">{errors.salary}</p>}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : employee ? 'Update' : 'Add Employee'}
        </button>
      </div>
    </form>
  );
}