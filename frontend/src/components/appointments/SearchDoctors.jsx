import { FaSearch } from "react-icons/fa";

function SearchDoctors({ searchTerm, setSearchTerm, speciality, setSpeciality }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/90 dark:border-slate-800 p-6 mb-8 transition-colors">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Search */}
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />

          <input
            type="text"
            placeholder="Search doctor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        {/* Filter */}
        <select
          value={speciality}
          onChange={(e) => setSpeciality(e.target.value)}
          className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
        >
          <option value="">All Specialities</option>
          <option value="Cardiologist">Cardiologist</option>
          <option value="Dermatologist">Dermatologist</option>
          <option value="Neurologist">Neurologist</option>
        </select>

      </div>
    </div>
  );
}

export default SearchDoctors;