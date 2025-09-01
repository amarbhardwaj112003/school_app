'use client';

import { useEffect, useState } from 'react';

export default function ShowSchools() {
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await fetch('/api/get-schools');
        const data = await res.json();

        // Ensure data is an array
        setSchools(Array.isArray(data) ? data : data.schools || []);
      } catch (err) {
        console.error(err);
        setSchools([]); // fallback to empty array
      }
    };

    fetchSchools();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Schools List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {schools.map((school) => (
          <div key={school.id} className="border rounded p-4 shadow">
            <img
              src={school.image}
              alt={school.name}
              className="w-full h-48 object-cover mb-2 rounded"
            />
            <h2 className="text-xl font-semibold">{school.name}</h2>
            <p>{school.address}</p>
            <p>{school.city}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
