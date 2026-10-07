import { FaSearch } from "react-icons/fa";

function SearchDoctors({ searchTerm, setSearchTerm, speciality, setSpeciality }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Search */}
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            placeholder="Search doctor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Filter */}
        <select
          value={speciality}
          onChange={(e) => setSpeciality(e.target.value)}
          className="border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
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