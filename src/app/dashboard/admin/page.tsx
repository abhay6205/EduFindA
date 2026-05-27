"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/navbar/Header";
import { LayoutDashboard, Users, Image as ImageIcon, MessageSquare, Megaphone, Settings, Plus, TrendingUp, Eye, X, GraduationCap, Calendar } from "lucide-react";
import { TeacherResponse, AdResponse } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

type SidebarTab = "analytics" | "teachers" | "gallery" | "ads" | "inquiries" | "settings";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<SidebarTab>("analytics");
  const [showAdModal, setShowAdModal] = useState(false);

  // Teachers state
  const [teachers, setTeachers] = useState<TeacherResponse[]>([]);
  const [teachersLoading, setTeachersLoading] = useState(false);
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [teacherForm, setTeacherForm] = useState({ teacher_name: "", subject: "", experience: 0, class_range: "" });
  const [teacherError, setTeacherError] = useState("");

  // Ads state
  const [ads, setAds] = useState<AdResponse[]>([]);
  const [adsLoading, setAdsLoading] = useState(false);
  const [adForm, setAdForm] = useState({ title: "", description: "", start_date: "", end_date: "" });
  const [adError, setAdError] = useState("");

  // School info (we need school_id)
  const [schoolId, setSchoolId] = useState<number | null>(null);
  const [schoolName, setSchoolName] = useState("My School");

  useEffect(() => {
    // Fetch the school owned by this user
    const token = localStorage.getItem("token");
    if (!token) return;

    // Get user info, then find school
    fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((user) => {
        // Fetch all schools and find the one owned by this user
        fetch(`${API_BASE_URL}/schools/`)
          .then((r) => r.json())
          .then((schools) => {
            const mySchool = schools.find((s: any) => s.owner_id === user.id);
            if (mySchool) {
              setSchoolId(mySchool.id);
              setSchoolName(mySchool.school_name);
            }
          });
      })
      .catch(console.error);
  }, []);

  // Fetch teachers when tab switches or schoolId available
  useEffect(() => {
    if (activeTab === "teachers" && schoolId) {
      fetchTeachers();
    }
    if (activeTab === "ads") {
      fetchAds();
    }
  }, [activeTab, schoolId]);

  const fetchTeachers = async () => {
    if (!schoolId) return;
    setTeachersLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/teachers/${schoolId}`);
      if (res.ok) {
        setTeachers(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTeachersLoading(false);
    }
  };

  const fetchAds = async () => {
    setAdsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/ads/`);
      if (res.ok) {
        const allAds = await res.json();
        // Filter to only this school's ads
        setAds(schoolId ? allAds.filter((a: AdResponse) => a.school_id === schoolId) : allAds);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAdsLoading(false);
    }
  };

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setTeacherError("");
    const token = localStorage.getItem("token");
    if (!token || !schoolId) return;

    try {
      const res = await fetch(`${API_BASE_URL}/teachers/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...teacherForm, school_id: schoolId }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to add teacher");
      }
      setShowAddTeacher(false);
      setTeacherForm({ teacher_name: "", subject: "", experience: 0, class_range: "" });
      fetchTeachers();
    } catch (err: any) {
      setTeacherError(err.message);
    }
  };

  const handleCreateAd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdError("");
    const token = localStorage.getItem("token");
    if (!token || !schoolId) return;

    try {
      const res = await fetch(`${API_BASE_URL}/ads/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...adForm, school_id: schoolId }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to create ad");
      }
      setShowAdModal(false);
      setAdForm({ title: "", description: "", start_date: "", end_date: "" });
      fetchAds();
    } catch (err: any) {
      setAdError(err.message);
    }
  };

  const schoolInitials = schoolName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .substring(0, 3)
    .toUpperCase();

  const sidebarItems: { key: SidebarTab; icon: any; label: string }[] = [
    { key: "analytics", icon: LayoutDashboard, label: "Analytics" },
    { key: "teachers", icon: Users, label: "Teachers" },
    { key: "gallery", icon: ImageIcon, label: "Gallery" },
    { key: "ads", icon: Megaphone, label: "Advertisements" },
    { key: "inquiries", icon: MessageSquare, label: "Inquiries" },
    { key: "settings", icon: Settings, label: "Profile Settings" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="flex-1 flex w-full">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col bg-white dark:bg-card border-r border-border p-4 h-[calc(100vh-80px)] sticky top-20">
          <div className="p-4 flex items-center gap-3 border-b border-border mb-4">
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl">
              {schoolInitials}
            </div>
            <div>
              <p className="font-semibold text-foreground truncate w-32">{schoolName}</p>
              <p className="text-xs text-muted-foreground">Admin Portal</p>
            </div>
          </div>

          <nav className="space-y-2 flex-1">
            {sidebarItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${
                  activeTab === item.key
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-8">

            {/* ========= ANALYTICS TAB ========= */}
            {activeTab === "analytics" && (
              <>
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">Overview</h1>
                    <p className="text-muted-foreground mt-1">Track your school&apos;s performance and manage content.</p>
                  </div>
                  <button
                    onClick={() => setShowAdModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors self-start shadow-sm shadow-primary/20"
                  >
                    <Plus className="w-5 h-5" /> Create Ad Campaign
                  </button>
                </header>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: "Total Profile Views", value: "12.5K", icon: Eye, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30", trend: "+15%" },
                    { label: "Admission Inquiries", value: "342", icon: MessageSquare, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30", trend: "+8%" },
                    { label: "Active Ads", value: String(ads.length || 2), icon: Megaphone, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30", trend: "0%" },
                    { label: "Search Ranking", value: "#4", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-900/30", trend: "+2" },
                  ].map((kpi, i) => (
                    <div key={i} className="bg-white dark:bg-card p-6 rounded-2xl border border-border shadow-sm">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${kpi.bg} ${kpi.color}`}>
                          <kpi.icon className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-md">
                          {kpi.trend}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-foreground">{kpi.value}</h3>
                        <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Inquiries Table */}
                <section className="bg-white dark:bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                  <div className="p-6 border-b border-border flex items-center justify-between">
                    <h2 className="text-lg font-bold text-foreground">Recent Inquiries</h2>
                    <button className="text-sm font-medium text-primary hover:underline">View All</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-muted/50 text-muted-foreground text-sm">
                          <th className="p-4 font-semibold">Name</th>
                          <th className="p-4 font-semibold">Contact</th>
                          <th className="p-4 font-semibold">Class Interested</th>
                          <th className="p-4 font-semibold">Date</th>
                          <th className="p-4 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {[
                          { name: "Rahul Sharma", contact: "rahul@email.com", class: "9th", date: "Today", status: "New" },
                          { name: "Priya Singh", contact: "priya@email.com", class: "11th Science", date: "Yesterday", status: "Contacted" },
                          { name: "Amit Patel", contact: "amit@email.com", class: "Nursery", date: "Oct 24", status: "New" },
                        ].map((row, i) => (
                          <tr key={i} className="border-b border-border hover:bg-muted/30 transition-colors">
                            <td className="p-4 font-medium text-foreground">{row.name}</td>
                            <td className="p-4 text-muted-foreground">{row.contact}</td>
                            <td className="p-4 text-foreground">{row.class}</td>
                            <td className="p-4 text-muted-foreground">{row.date}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-md text-xs font-semibold ${row.status === 'New' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            )}

            {/* ========= TEACHERS TAB ========= */}
            {activeTab === "teachers" && (
              <>
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">Teachers</h1>
                    <p className="text-muted-foreground mt-1">Manage your school&apos;s faculty members.</p>
                  </div>
                  <button
                    onClick={() => setShowAddTeacher(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors self-start shadow-sm shadow-primary/20"
                  >
                    <Plus className="w-5 h-5" /> Add Teacher
                  </button>
                </header>

                {teachersLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse bg-white dark:bg-card rounded-2xl h-48 border border-border" />
                    ))}
                  </div>
                ) : teachers.length === 0 ? (
                  <div className="py-16 text-center bg-white dark:bg-card rounded-2xl border border-border">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Teachers Added Yet</h3>
                    <p className="text-muted-foreground mb-6">Add your faculty members to showcase on your school profile.</p>
                    <button
                      onClick={() => setShowAddTeacher(true)}
                      className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
                    >
                      <Plus className="w-4 h-4 inline mr-2" /> Add First Teacher
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teachers.map((teacher) => (
                      <div key={teacher.id} className="bg-white dark:bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                            {teacher.teacher_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground text-lg">{teacher.teacher_name}</h3>
                            <p className="text-sm text-primary font-medium">{teacher.subject}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span>{teacher.experience} yrs exp</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <GraduationCap className="w-4 h-4 text-primary" />
                            <span>Class {teacher.class_range}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ========= ADS TAB ========= */}
            {activeTab === "ads" && (
              <>
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">Advertisements</h1>
                    <p className="text-muted-foreground mt-1">Manage your ad campaigns.</p>
                  </div>
                  <button
                    onClick={() => setShowAdModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors self-start shadow-sm shadow-primary/20"
                  >
                    <Plus className="w-5 h-5" /> Create Ad Campaign
                  </button>
                </header>

                {adsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2].map((i) => (
                      <div key={i} className="animate-pulse bg-white dark:bg-card rounded-2xl h-40 border border-border" />
                    ))}
                  </div>
                ) : ads.length === 0 ? (
                  <div className="py-16 text-center bg-white dark:bg-card rounded-2xl border border-border">
                    <Megaphone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Active Campaigns</h3>
                    <p className="text-muted-foreground mb-6">Create your first ad campaign to reach more students.</p>
                    <button
                      onClick={() => setShowAdModal(true)}
                      className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
                    >
                      <Plus className="w-4 h-4 inline mr-2" /> Create Campaign
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {ads.map((ad) => (
                      <div key={ad.id} className="bg-white dark:bg-card p-6 rounded-2xl border border-border shadow-sm">
                        <h3 className="text-lg font-bold text-foreground mb-2">{ad.title}</h3>
                        <p className="text-muted-foreground text-sm mb-4">{ad.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-md font-semibold">Active</span>
                          <span>{ad.start_date} → {ad.end_date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ========= OTHER TABS (Placeholder) ========= */}
            {(activeTab === "gallery" || activeTab === "inquiries" || activeTab === "settings") && (
              <div className="py-16 text-center bg-white dark:bg-card rounded-2xl border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-2 capitalize">{activeTab}</h3>
                <p className="text-muted-foreground">This section is coming soon.</p>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* ========= ADD TEACHER MODAL ========= */}
      {showAddTeacher && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-card w-full max-w-lg rounded-2xl border border-border shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">Add New Teacher</h2>
              <button onClick={() => setShowAddTeacher(false)} className="p-2 hover:bg-muted rounded-lg transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <form onSubmit={handleAddTeacher} className="p-6 space-y-4">
              {teacherError && (
                <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-900">{teacherError}</div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Teacher Name</label>
                <input required value={teacherForm.teacher_name} onChange={(e) => setTeacherForm({ ...teacherForm, teacher_name: e.target.value })} className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Subject</label>
                  <input required value={teacherForm.subject} onChange={(e) => setTeacherForm({ ...teacherForm, subject: e.target.value })} className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Experience (yrs)</label>
                  <input required type="number" min={0} value={teacherForm.experience} onChange={(e) => setTeacherForm({ ...teacherForm, experience: parseInt(e.target.value) || 0 })} className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Class Range (e.g. 9th-12th)</label>
                <input required value={teacherForm.class_range} onChange={(e) => setTeacherForm({ ...teacherForm, class_range: e.target.value })} className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
              </div>
              <button type="submit" className="w-full h-12 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all mt-2">Add Teacher</button>
            </form>
          </div>
        </div>
      )}

      {/* ========= CREATE AD MODAL ========= */}
      {showAdModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-card w-full max-w-lg rounded-2xl border border-border shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">Create Ad Campaign</h2>
              <button onClick={() => setShowAdModal(false)} className="p-2 hover:bg-muted rounded-lg transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <form onSubmit={handleCreateAd} className="p-6 space-y-4">
              {adError && (
                <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-900">{adError}</div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Campaign Title</label>
                <input required value={adForm.title} onChange={(e) => setAdForm({ ...adForm, title: e.target.value })} placeholder="e.g. Admissions Open 2026-27" className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Description</label>
                <textarea required value={adForm.description} onChange={(e) => setAdForm({ ...adForm, description: e.target.value })} rows={3} placeholder="Describe your campaign..." className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Start Date</label>
                  <input required type="date" value={adForm.start_date} onChange={(e) => setAdForm({ ...adForm, start_date: e.target.value })} className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">End Date</label>
                  <input required type="date" value={adForm.end_date} onChange={(e) => setAdForm({ ...adForm, end_date: e.target.value })} className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                </div>
              </div>
              <button type="submit" className="w-full h-12 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all mt-2">Launch Campaign</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
