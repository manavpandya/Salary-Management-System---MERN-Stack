import { useCountries, useJobTitles } from '../../hooks/useEmployees';

interface Props {
  search: string;
  country: string;
  jobTitle: string;
  onSearchChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onJobTitleChange: (value: string) => void;
}

export default function EmployeeFilters({
  search,
  country,
  jobTitle,
  onSearchChange,
  onCountryChange,
  onJobTitleChange,
}: Props) {
  const { data: countries = [] } = useCountries();
  const { data: jobTitles = [] } = useJobTitles();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div>
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
          Search
        </label>
        <input
          id="search"
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name..."
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="country-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Country
        </label>
        <select
          id="country-filter"
          value={country}
          onChange={(e) => onCountryChange(e.target.value)}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All Countries</option>
          {countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="job-title-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Job Title
        </label>
        <select
          id="job-title-filter"
          value={jobTitle}
          onChange={(e) => onJobTitleChange(e.target.value)}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All Job Titles</option>
          {jobTitles.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
    </div>
  );
}