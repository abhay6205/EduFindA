"use client";

import { useState, useEffect, useRef } from "react";
import { X, ChevronDown, CheckCircle } from "lucide-react";
import { SchoolResponse } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

interface AdmissionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSchool: {
    school_name: string;
    location: string;
  };
}

export function AdmissionFormModal({ isOpen, onClose, currentSchool }: AdmissionFormModalProps) {
  const [studentName, setStudentName] = useState("");
  const [location, setLocation] = useState(currentSchool.location);
  const [locationSearch, setLocationSearch] = useState(currentSchool.location);
  const [schoolName, setSchoolName] = useState(currentSchool.school_name);
  const [studentClass, setStudentClass] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);

  // All schools data for filtering
  const [allSchools, setAllSchools] = useState<SchoolResponse[]>([]);
  const locationRef = useRef<HTMLDivElement>(null);
  const schoolRef = useRef<HTMLDivElement>(null);

  // Fetch all schools for location/school filtering
  useEffect(() => {
    if (isOpen) {
      fetch(`${API_BASE_URL}/schools/`)
        .then((res) => res.json())
        .then((data) => setAllSchools(data))
        .catch(() => {});
    }
  }, [isOpen]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setStudentName("");
      setLocation(currentSchool.location);
      setLocationSearch(currentSchool.location);
      setSchoolName(currentSchool.school_name);
      setStudentClass("");
      setSubmitted(false);
    }
  }, [isOpen, currentSchool]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setShowLocationDropdown(false);
      }
      if (schoolRef.current && !schoolRef.current.contains(e.target as Node)) {
        setShowSchoolDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Get unique locations
  const allLocations = [...new Set(allSchools.map((s) => s.location))];
  const filteredLocations = allLocations.filter((loc) =>
    loc.toLowerCase().includes(locationSearch.toLowerCase())
  );

  // Get schools filtered by selected location
  const filteredSchools = allSchools.filter((s) => s.location === location);

  const handleLocationSelect = (loc: string) => {
    setLocation(loc);
    setLocationSearch(loc);
    setShowLocationDropdown(false);
    // Reset school when location changes
    const schoolsInLoc = allSchools.filter((s) => s.location === loc);
    if (schoolsInLoc.length > 0) {
      setSchoolName(schoolsInLoc[0].school_name);
    } else {
      setSchoolName("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !location || !schoolName || !studentClass) return;
    setSubmitted(true);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-card w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-primary to-primary/80 px-8 py-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold text-white">Apply for Admission</h2>
          <p className="text-white/80 text-sm mt-1">Fill in the details below to apply</p>
        </div>

        {submitted ? (
          /* Success State */
          <div className="px-8 py-12 text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Thanks for Choosing {schoolName}!
            </h3>
            <p className="text-muted-foreground text-lg">
              Our Team will contact you soon.
            </p>
            <button
              onClick={onClose}
              className="mt-8 px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
            {/* Student Name */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Student Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter student's full name"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                required
              />
            </div>

            {/* Location - Dropdown with search */}
            <div ref={locationRef}>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={locationSearch}
                  onChange={(e) => {
                    setLocationSearch(e.target.value);
                    setShowLocationDropdown(true);
                  }}
                  onFocus={() => setShowLocationDropdown(true)}
                  placeholder="Search or select location"
                  className="w-full px-4 py-3 pr-10 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  required
                />
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground cursor-pointer"
                  onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                />
                {showLocationDropdown && filteredLocations.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-card border border-border rounded-xl shadow-xl z-10 max-h-48 overflow-y-auto">
                    {filteredLocations.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => handleLocationSelect(loc)}
                        className={`w-full text-left px-4 py-3 hover:bg-primary/5 transition-colors text-sm ${
                          loc === location ? "bg-primary/10 text-primary font-semibold" : "text-foreground"
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* School Name - Filtered by location */}
            <div ref={schoolRef}>
              <label className="block text-sm font-semibold text-foreground mb-2">
                School Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowSchoolDropdown(!showSchoolDropdown)}
                  className="w-full px-4 py-3 pr-10 rounded-xl border border-border bg-background text-foreground text-left focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                >
                  {schoolName || "Select a school"}
                </button>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                {showSchoolDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-card border border-border rounded-xl shadow-xl z-10 max-h-48 overflow-y-auto">
                    {filteredSchools.length > 0 ? (
                      filteredSchools.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            setSchoolName(s.school_name);
                            setShowSchoolDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-3 hover:bg-primary/5 transition-colors text-sm ${
                            s.school_name === schoolName ? "bg-primary/10 text-primary font-semibold" : "text-foreground"
                          }`}
                        >
                          {s.school_name}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-muted-foreground">
                        No schools found for this location
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Class */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Class <span className="text-red-500">*</span>
              </label>
              <select
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                required
              >
                <option value="">Select Class</option>
                <option value="Nursery">Nursery</option>
                <option value="LKG">LKG</option>
                <option value="UKG">UKG</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={`Class ${i + 1}`}>
                    Class {i + 1}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 text-lg mt-2"
            >
              Submit Application
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
