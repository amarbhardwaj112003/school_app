"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export default function UpdateSchool() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await fetch("/api/get-schools");
        const data = await res.json();
        setSchools(Array.isArray(data) ? data : data.schools || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSchools();
  }, []);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("id", selectedSchool.id);
    formData.append("name", data.name);
    formData.append("address", data.address);
    formData.append("city", data.city);
    formData.append("state", data.state);
    formData.append("contact", data.contact);
    formData.append("email_id", data.email_id);
    if (data.image && data.image[0]) formData.append("image", data.image[0]);

    try {
      const response = await fetch("/api/update-school", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        alert("School updated successfully!");
        router.push("/"); // Redirect to homepage
      } else {
        const errorData = await response.json();
        alert("Failed to update school: " + (errorData.error || "Unknown error"));
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleSchoolChange = (e) => {
    const schoolId = e.target.value;
    const school = schools.find((s) => s.id === parseInt(schoolId));
    setSelectedSchool(school);
    if (school) {
      setValue("name", school.name);
      setValue("address", school.address);
      setValue("city", school.city);
      setValue("state", school.state);
      setValue("contact", school.contact);
      setValue("email_id", school.email_id);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Update School</h1>
      <select
        onChange={handleSchoolChange}
        className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="">Select a School to Update</option>
        {schools.map((school) => (
          <option key={school.id} value={school.id}>
            {school.name}
          </option>
        ))}
      </select>
      {selectedSchool && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            {...register("name", { required: "Name is required" })}
            className="w-full p-2 border rounded-lg"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}

          <input
            type="text"
            placeholder="Address"
            {...register("address", { required: "Address is required" })}
            className="w-full p-2 border rounded-lg"
          />
          {errors.address && <p className="text-red-500">{errors.address.message}</p>}

          <input
            type="text"
            placeholder="City"
            {...register("city", { required: "City is required" })}
            className="w-full p-2 border rounded-lg"
          />
          {errors.city && <p className="text-red-500">{errors.city.message}</p>}

          <input
            type="text"
            placeholder="State"
            {...register("state", { required: "State is required" })}
            className="w-full p-2 border rounded-lg"
          />
          {errors.state && <p className="text-red-500">{errors.state.message}</p>}

          <input
            type="number"
            placeholder="Contact"
            {...register("contact", { required: "Contact is required", pattern: { value: /^[0-9]+$/, message: "Invalid contact number" } })}
            className="w-full p-2 border rounded-lg"
          />
          {errors.contact && <p className="text-red-500">{errors.contact.message}</p>}

          <input
            type="email"
            placeholder="Email"
            {...register("email_id", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })}
            className="w-full p-2 border rounded-lg"
          />
          {errors.email_id && <p className="text-red-500">{errors.email_id.message}</p>}

          <input
            type="file"
            accept="image/*"
            {...register("image")}
            className="w-full p-2 border rounded-lg"
          />

          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors">
            Update School
          </button>
        </form>
      )}
    </div>
  );
}