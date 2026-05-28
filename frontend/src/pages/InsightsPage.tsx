import { useState } from 'react';
import { useSalaryByCountry, useSalaryByJobTitle } from '../hooks/useInsights';
import { useCountries } from '../hooks/useEmployees';

export default function InsightsPage() {
  const [selectedCountry, setSelectedCountry] = useState('');
  const { data: countries = [] } = useCountries();
  const { data: countryInsights, isLoading: loadingCountries } = useSalaryByCountry();
  const { data: jobTitleInsights, isLoading: loadingJobTitles } = useSalaryByJobTitle(selectedCountry || undefined);

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(v);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Salary Insights</h1>

      {/* Country salary summary */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Salary Summary by Country</h2>
        </div>
        {loadingCountries ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Employees</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Min Salary</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Average Salary</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Max Salary</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {countryInsights?.map((row) => (
                  <tr key={row.country} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">{row.country}</td>
                    <td className="px-6 py-3 text-sm text-right text-gray-600">{row.employeeCount}</td>
                    <td className="px-6 py-3 text-sm text-right text-gray-600">{formatCurrency(row.minSalary)}</td>
                    <td className="px-6 py-3 text-sm text-right font-medium text-gray-900">{formatCurrency(row.avgSalary)}</td>
                    <td className="px-6 py-3 text-sm text-right text-gray-600">{formatCurrency(row.maxSalary)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* By job title within country */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Average Salary by Job Title</h2>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Countries</option>
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        {loadingJobTitles ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Employees</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Average Salary</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobTitleInsights?.map((row, i) => (
                  <tr key={`${row.jobTitle}-${row.country}-${i}`} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">{row.jobTitle}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{row.country}</td>
                    <td className="px-6 py-3 text-sm text-right text-gray-600">{row.employeeCount}</td>
                    <td className="px-6 py-3 text-sm text-right font-medium text-gray-900">{formatCurrency(row.avgSalary)}</td>
                  </tr>
                ))}
                {(!jobTitleInsights || jobTitleInsights.length === 0) && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}