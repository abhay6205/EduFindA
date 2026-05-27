"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/navbar/Header";
import { SchoolCard } from "@/components/cards/SchoolCard";
import { Search, MapPin, SlidersHorizontal, ChevronDown } from "lucide-react";
import { SchoolResponse } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const LOCATIONS = ["Nalanda", "Biharsharif", "Nawada", "Harnaut", "Rajgir"];

function SchoolsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialFilter = searchParams.get("filter") || "";
  const initialBoard = searchParams.get("board") || "";

  const [schools, setSchools] = useState<SchoolResponse[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<SchoolResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getInitialLocation = useCallback(() => {
    if (!initialFilter) return "All Locations";
    const matched = LOCATIONS.find(
      (l) => l.toLowerCase() === initialFilter.toLowerCase()
    );
    return matched || "All Locations";
  }, [initialFilter]);

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [location, setLocation] = useState(getInitialLocation());
  const [selectedBoards, setSelectedBoards] = useState<string[]>(initialBoard ? [initialBoard] : []);

  const applyFilters = useCallback((data: SchoolResponse[], loc: string, boards: string[], query: string) => {
    let result = [...data];

    if (query) {
      const q = query.toLowerCase();
      result = result.filter((s) =>
        s.school_name.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q) ||
        s.board_type.toLowerCase().includes(q) ||
        (s.principal_name && s.principal_name.toLowerCase().includes(q))
      );
    }

    if (loc && loc !== "All Locations") {
      result = result.filter((s) => s.location.toLowerCase().includes(loc.toLowerCase()));
    }

    if (boards.length > 0) {
      result = result.filter((s) => boards.includes(s.board_type));
    }

    setFilteredSchools(result);
  }, []);

  // Fetch ALL schools from API once (filtering is done client-side)
  useEffect(() => {
    const fetchSchools = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/schools/`);
        if (res.ok) {
          const data = await res.json();
          setSchools(data);
        }
      } catch (error) {
        console.error("Failed to fetch schools:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchools();
  }, []);

  // Sync location state when URL filter param changes
  useEffect(() => {
    setLocation(getInitialLocation());
  }, [getInitialLocation]);

  // Sync board state when URL board param changes
  useEffect(() => {
    setSelectedBoards(initialBoard ? [initialBoard] : []);
  }, [initialBoard]);

  // Auto-apply filters whenever any filter value changes
  useEffect(() => {
    if (schools.length > 0 || !isLoading) {
      applyFilters(schools, location, selectedBoards, searchQuery);
    }
  }, [schools, location, selectedBoards, searchQuery, applyFilters, isLoading]);

  const handleBoardToggle = (board: string) => {
    setSelectedBoards(prev =>
      prev.includes(board) ? prev.filter(b => b !== board) : [...prev, board]
    );
  };

  return (
    <>
      {/* Page Header */}
      <div className="bg-primary/5 border-b border-border py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Explore Schools</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">Find the perfect educational environment for your child. Filter by location, board, facilities and more.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72 flex-shrink-0 space-y-6">
          <div className="bg-white dark:bg-card border border-border rounded-2xl p-6 shadow-sm sticky top-24">
            <div className="flex items-center gap-2 font-semibold text-lg mb-6 pb-4 border-b border-border">
              <SlidersHorizontal className="w-5 h-5 text-primary" />
              Advanced Filters
            </div>

            <div className="space-y-6">
              {/* Location Filter */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full h-10 pl-9 pr-4 rounded-lg border border-border bg-transparent outline-none focus:border-primary text-sm appearance-none"
                  >
                    <option value="All Locations">All Locations</option>
                    {LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Board Filter */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Board Type</label>
                <div className="space-y-2">
                  {['CBSE', 'State Board', 'ICSE', 'Private', 'State/Private', 'Private/State'].map(board => (
                    <label key={board} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedBoards.includes(board)}
                        onChange={() => handleBoardToggle(board)}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary accent-primary"
                      />
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{board}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Facilities Filter (UI Only) */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Facilities</label>
                <div className="space-y-2">
                  {['Hostel', 'Transport', 'Smart Classes', 'Sports Complex', 'Swimming Pool'].map(facility => (
                    <label key={facility} className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary accent-primary" />
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{facility}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Reset Filters */}
              <button
                onClick={() => { setLocation("All Locations"); setSelectedBoards([]); setSearchQuery(""); }}
                className="w-full py-2.5 bg-primary/10 text-primary font-semibold rounded-lg hover:bg-primary/20 transition-colors mt-4"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Search Bar & Sort */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by school name..."
                className="w-full h-12 pl-10 pr-4 rounded-xl border border-border bg-white dark:bg-card focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm"
              />
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
              <select className="h-12 px-4 rounded-xl border border-border bg-white dark:bg-card outline-none focus:border-primary text-sm min-w-[150px]">
                <option>Relevance</option>
                <option>Highest Rated</option>
                <option>A-Z</option>
                <option>Z-A</option>
              </select>
            </div>
          </div>

          {/* Results Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="animate-pulse bg-white dark:bg-card rounded-2xl h-80 border border-border" />
              ))}
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Showing {filteredSchools.length} school{filteredSchools.length !== 1 ? 's' : ''}
                {location !== "All Locations" && <span> in <strong className="text-foreground">{location}</strong></span>}
              </p>

              {filteredSchools.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">No Schools Found</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    {location !== "All Locations"
                      ? `No schools are currently registered in ${location}. Try searching in a nearby location or browse all schools.`
                      : "No schools match your current filters. Try adjusting your search criteria."
                    }
                  </p>
                  <button
                    onClick={() => { setLocation("All Locations"); setSelectedBoards([]); setSearchQuery(""); }}
                    className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors"
                  >
                    Browse All Schools
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                  {filteredSchools.map(school => (
                    <SchoolCard key={school.id} school={school} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {filteredSchools.length > 0 && (
                <div className="flex items-center justify-center gap-2 pt-8">
                  <button className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted disabled:opacity-50 text-sm font-medium" disabled>Prev</button>
                  <button className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center text-sm font-medium">1</button>
                  <button className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted disabled:opacity-50 text-sm font-medium" disabled>Next</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default function SchoolsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <Suspense fallback={<div className="p-8 text-center">Loading schools...</div>}>
        <SchoolsContent />
      </Suspense>
    </div>
  );
}
