"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Award, BookOpen, Users, ChevronRight, ArrowRight, School as SchoolIcon } from "lucide-react";
import { Header } from "@/components/navbar/Header";
import { Footer } from "@/components/footer/Footer";
import { SchoolCard } from "@/components/cards/SchoolCard";
import { SchoolResponse } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function Home() {
  const router = useRouter();
  const [schools, setSchools] = useState<SchoolResponse[]>([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedBoard, setSelectedBoard] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/schools/`)
      .then((r) => r.json())
      .then(setSchools)
      .catch(console.error);
  }, []);

  const handleQuickSearch = () => {
    const params = new URLSearchParams();
    if (selectedCity) params.set("filter", selectedCity.toLowerCase());
    if (selectedBoard) params.set("board", selectedBoard);
    router.push(`/schools${params.toString() ? '?' + params.toString() : ''}`);
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 inset-x-0 h-full overflow-hidden z-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 blur-3xl rounded-full" />
          <div className="absolute top-40 -left-40 w-96 h-96 bg-primary/10 blur-3xl rounded-full" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground">
                Find The <span className="text-primary">Best School</span><br />
                For Your Future
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Explore top schools, compare facilities, admissions, achievements, and make the best choice for your educational journey.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Link href="/schools" className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 flex items-center justify-center gap-2">
                Explore Schools <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/register?type=school" className="w-full sm:w-auto px-8 py-4 bg-white text-primary font-semibold rounded-full hover:bg-gray-100 transition-all shadow-sm border border-primary/20 flex items-center justify-center">
                Register School
              </Link>
            </motion.div>

            {/* Quick Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-12 p-4 bg-white dark:bg-card rounded-3xl border border-border shadow-lg flex flex-col md:flex-row gap-4 max-w-3xl mx-auto"
            >
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-background border border-border outline-none appearance-none cursor-pointer text-foreground"
                >
                  <option value="">Select City</option>
                  <option value="Nalanda">Nalanda</option>
                  <option value="Biharsharif">Biharsharif</option>
                  <option value="Nawada">Nawada</option>
                  <option value="Harnaut">Harnaut</option>
                  <option value="Rajgir">Rajgir</option>
                </select>
              </div>
              <div className="flex-1 relative">
                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <select
                  value={selectedBoard}
                  onChange={(e) => setSelectedBoard(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-background border border-border outline-none appearance-none cursor-pointer text-foreground"
                >
                  <option value="">Select Board</option>
                  <option value="CBSE">CBSE</option>
                  <option value="ICSE">ICSE</option>
                  <option value="State Board">State Board</option>
                </select>
              </div>
              <button
                onClick={handleQuickSearch}
                className="h-12 px-8 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" /> Search
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Schools Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Featured Schools</h2>
              <p className="text-muted-foreground text-lg">Discover top-rated educational institutions offering premium facilities and excellent academic tracks.</p>
            </div>
            <Link href="/schools" className="hidden md:flex items-center gap-2 text-primary font-medium hover:underline">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {schools.map((school) => (
              <SchoolCard key={school.id} school={school} />
            ))}
          </div>
        </div>
      </section>

      {/* Advertisements/Banners Section */}
      <section className="py-12 bg-primary/5">
        <div className="container mx-auto px-4">
           <div className="relative rounded-3xl overflow-hidden bg-primary p-8 md:p-12 text-white shadow-2xl">
              <div className="relative z-10 max-w-2xl">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm mb-4 inline-block">Admissions 2024-25</span>
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Secure Your Child's Future Today</h2>
                <p className="text-white/80 text-lg mb-8">Early bird scholarships available for outstanding students. Apply now and get up to 50% waiver on admission fees.</p>
                <button className="px-8 py-3 bg-white text-primary font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                  Apply Now
                </button>
              </div>
              {/* Abstract decorative shapes */}
              <div className="absolute top-0 right-0 w-64 h-full bg-white/10 skew-x-12 translate-x-16" />
              <div className="absolute top-0 right-32 w-32 h-full bg-white/5 skew-x-12 translate-x-16" />
           </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
