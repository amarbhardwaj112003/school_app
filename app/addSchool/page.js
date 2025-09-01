'use client';
import { useState } from 'react';

export default function AddSchoolPage() {
  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    contact: '',
    email_id: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(form).forEach((key) => data.append(key, form[key]));

    try {
      const res = await fetch('/api/add-school', {
        method: 'POST',
        body: data,
      });
      const result = await res.json();
      alert(result.message || result.error);
    } catch (err) {
      console.error(err);
      alert('Something went wrong!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="backdrop-blur-lg bg-white/70 rounded-3xl shadow-2xl max-w-3xl w-full p-10 animate-fadeIn">
        <h1 className="text-4xl font-extrabold text-center text-purple-700 mb-8 drop-shadow-md">
          Add New School
        </h1>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {['name','address','city','state','contact','email_id'].map((field) => (
            <div key={field} className="relative">
              <input
                type="text"
                name={field}
                value={form[field]}
                onChange={handleChange}
                required
                placeholder=" "
                className="peer w-full rounded-xl border border-gray-300 bg-transparent px-4 pt-5 pb-2 text-gray-800 placeholder-transparent focus:border-purple-400 focus:ring-2 focus:ring-purple-300 focus:outline-none transition"
              />
              <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-gray-600 peer-focus:text-sm">
                {field.replace('_', ' ')}
              </label>
            </div>
          ))}

          <div className="relative md:col-span-2">
            <input
              type="file"
              name="image"
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-300 bg-transparent px-4 py-3 text-gray-800 focus:border-purple-400 focus:ring-2 focus:ring-purple-300 focus:outline-none transition"
            />
          </div>

          <button
            type="submit"
            className="md:col-span-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-2xl shadow-xl hover:scale-105 transform transition duration-300"
          >
            Add School
          </button>
        </form>
      </div>
    </div>
  );
}
