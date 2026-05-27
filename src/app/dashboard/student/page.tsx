"use client";

import { Header } from "@/components/navbar/Header";
import { SchoolCard } from "@/components/cards/SchoolCard";
import { Search, Heart, Bell, Settings, History, MapPin, School, ArrowRight } from "lucide-react";
import Link from "next/link";
import { SchoolResponse } from "@/types";

export default function StudentDashboard() {
  const savedSchools: SchoolResponse[] = [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="flex-1 flex w-full">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col bg-white dark:bg-card border-r border-border p-4 h-[calc(100vh-80px)] sticky top-20">
          <div className="p-4 flex items-center gap-3 border-b border-border mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">
              S
            </div>
            <div>
              <p className="font-semibold text-foreground">Student Name</p>
              <p className="text-xs text-muted-foreground">Class 10th</p>
            </div>
          </div>

          <nav className="space-y-2 flex-1">
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary font-medium">
              <School className="w-5 h-5" /> Saved Schools
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted transition-colors">
              <History className="w-5 h-5" /> Recent Searches
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted transition-colors">
              <Bell className="w-5 h-5" /> Notifications
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted transition-colors">
              <Settings className="w-5 h-5" /> Profile Settings
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8">
          <div className="max-w-6xl mx-auto space-y-8">

            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground mt-1">Welcome back! Here's your school discovery progress.</p>
              </div>
              <Link href="/schools" className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors self-start">
                <Search className="w-4 h-4" /> Discover More
              </Link>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-card p-6 rounded-2xl border border-border flex items-center gap-4">
                <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 text-rose-500 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">1</p>
                  <p className="text-sm text-muted-foreground font-medium">Saved Schools</p>
                </div>
              </div>
              <div className="bg-white dark:bg-card p-6 rounded-2xl border border-border flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded-xl flex items-center justify-center">
                  <History className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-muted-foreground font-medium">Searches</p>
                </div>
              </div>
              <div className="bg-white dark:bg-card p-6 rounded-2xl border border-border flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-500 rounded-xl flex items-center justify-center">
                  <Bell className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-sm text-muted-foreground font-medium">New Alerts</p>
                </div>
              </div>
            </div>

            {/* Saved Schools Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500" /> Saved Schools
                </h2>
                <button className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                  View All <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedSchools.map(school => (
                  <SchoolCard key={school.id} school={school} />
                ))}
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}
