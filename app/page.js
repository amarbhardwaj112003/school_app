"use client";

import { useState, useEffect } from "react";
import { FaSchool, FaUser, FaSearch } from "react-icons/fa";

export default function Home() {
  const [schools, setSchools] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await fetch("/api/get-schools");
        const data = await res.json();
        setSchools(Array.isArray(data) ? data : data.schools || []);
      } catch (err) {
        console.error(err);
        setSchools([]); // fallback to empty array
      }
    };
    setTimeout(() => setIsLoaded(true), 500); // Delay for animation
    fetchSchools();
  }, []);

  // Filter schools based on search term
  const filteredSchools = schools.filter((school) =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 relative overflow-hidden">
      {/* Parallax Background (Safe Gradient) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1) 0%,rgba(0,0,0,0.5) 70%)] animate-pulse-slow"></div>

      {/* Navbar */}
      <nav className="bg-white/20 backdrop-blur-lg shadow-xl p-4 flex items-center justify-between flex-wrap relative z-10">
        {/* Logo */}
        <div className="flex items-center space-x-2 group">
          <FaSchool className="text-3xl text-blue-300 transition-all duration-300 group-hover:text-blue-100 group-hover:scale-110" />
          <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-300 transition-all duration-300 group-hover:bg-gradient-to-l">
            SchoolHub
          </span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-4 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
          <input
            type="text"
            placeholder="Search schools by name, address, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 border-none rounded-xl bg-white/10 text-white placeholder-gray-400 focus:bg-white/20 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300 shadow-inner hover:shadow-lg"
          />
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <a
            href="/addSchool"
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-md hover:from-green-600 hover:to-emerald-700 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Add School
          </a>
          <a
            href="/updateSchool"
            className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-bold rounded-lg shadow-md hover:from-yellow-600 hover:to-amber-700 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            Update School
          </a>
          <a
            href="#login"
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <FaUser />
            <span>Login</span>
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6 relative z-10">
        <h1 className={`text-4xl md:text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 ${isLoaded ? "animate-slide-in" : ""}`}>
          Welcome to SchoolHub
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredSchools.map((school) => (
            <div
              key={school.id}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:rotate-1 transition-all duration-300 perspective-1000"
            >
              <div className="relative h-48 overflow-hidden rounded-lg">
                <img
                  src={school.image}
                  alt={school.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mt-2">{school.name}</h2>
              <p className="text-gray-600 text-sm line-clamp-2">{school.address}</p>
              <p className="text-gray-600 text-sm">{school.city}</p>
            </div>
          ))}
          {filteredSchools.length === 0 && (
            <p className="text-center text-white/70 text-lg">No schools found.</p>
          )}
        </div>
      </div>
    </div>
  );
}