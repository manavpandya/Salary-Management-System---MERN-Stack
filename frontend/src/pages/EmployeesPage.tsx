import { useState, useCallback, useMemo } from 'react';
import { Plus, X } from 'lucide-react';
import EmployeeTable from '../components/employees/EmployeeTable';
import EmployeeForm from '../components/employees/EmployeeForm';
import EmployeeFilters from '../components/employees/EmployeeFilters';
import { useEmployees, useCreateEmployee, useUpdateEmployee, useDeleteEmployee } from '../hooks/useEmployees';
import type { Employee, EmployeeFormData, EmployeeFilters as Filters } from '../types';

export default function EmployeesPage() {
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const debouncedSearch = useCallback((value: string) => {
    const timeout = setTimeout(() => setSearch(value), 300);
    return () => clearTimeout(timeout);
  }, []);

  const filters: Filters = useMemo(() => ({
    search,
    country: country || undefined,
    jobTitle: jobTitle || undefined,
    page,
    limit: 20,
    sortBy,
    sortOrder,
  }), [search, country, jobTitle, page, sortBy, sortOrder]);

  const { data, isLoading, isError, error } = useEmployees(filters);
  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();
  const deleteMutation = useDeleteEmployee();

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleCreate = async (formData: EmployeeFormData) => {
    await createMutation.mutateAsync(formData);
    setShowForm(false);
  };

  const handleUpdate = async (formData: EmployeeFormData) => {
    if (!editingEmployee) return;
    await updateMutation.mutateAsync({ id: editingEmployee.id, input: formData });
    setEditingEmployee(null);
  };

  const handleDelete = async (id: number) => {
    await deleteMutation.mutateAsync(id);
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
        <button
          onClick={() => { setShowForm(true); setEditingEmployee(null); }}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Employee
        </button>
      </div>

      {(showForm || editingEmployee) && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {editingEmployee ? 'Edit Employee' : 'Add Employee'}
            </h2>
            <button onClick={() => { setShowForm(false); setEditingEmployee(null); }} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <EmployeeForm
            employee={editingEmployee}
            onSubmit={editingEmployee ? handleUpdate : handleCreate}
            onCancel={() => { setShowForm(false); setEditingEmployee(null); }}
            isLoading={isSaving}
          />
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <EmployeeFilters
          search={search}
          country={country}
          jobTitle={jobTitle}
          onSearchChange={(v) => { debouncedSearch(v); setPage(1); }}
          onCountryChange={(v) => { setCountry(v); setPage(1); }}
          onJobTitleChange={(v) => { setJobTitle(v); setPage(1); }}
        />
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-red-500">
            Error loading employees: {(error as Error).message}
          </div>
        ) : (
          <>
            <EmployeeTable
              employees={data?.data ?? []}
              onEdit={(emp) => { setEditingEmployee(emp); setShowForm(false); }}
              onDelete={handleDelete}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
            {data && data.pagination.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 px-6 py-3">
                <p className="text-sm text-gray-600">
                  Showing {(data.pagination.page - 1) * data.pagination.limit + 1} to{' '}
                  {Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)} of{' '}
                  {data.pagination.total} employees
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                    disabled={page >= data.pagination.totalPages}
                    className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}