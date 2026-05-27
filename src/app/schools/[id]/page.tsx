"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/navbar/Header";
import { FacilityCard } from "@/components/cards/FacilityCard";
import { TeacherCard } from "@/components/cards/TeacherCard";
import { AdmissionFormModal } from "@/components/modals/AdmissionFormModal";
import { generateBrochurePDF } from "@/services/generateBrochure";
import { MapPin, GraduationCap, Users, Calendar, Phone, Mail, Globe, Star, ArrowRight, BookOpen, Monitor, Bus, Award, AlertCircle, Trophy, Camera, X, Download } from "lucide-react";
import { SchoolDetailResponse } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function SchoolDetailPage() {
  const params = useParams();
  const id = params.id;
  const [school, setSchool] = useState<SchoolDetailResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [showAdmissionForm, setShowAdmissionForm] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchSchool = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/schools/${id}`);
        if (!res.ok) {
          throw new Error(res.status === 404 ? "School not found" : "Failed to load school details");
        }
        const data = await res.json();
        setSchool(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      }
    };
    fetchSchool();
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
          <AlertCircle className="w-16 h-16 text-destructive" />
          <h2 className="text-2xl font-bold text-foreground">Oops!</h2>
          <p className="text-muted-foreground text-lg">{error}</p>
          <a href="/schools" className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors">
            Back to Schools
          </a>
        </div>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Compute average rating from reviews
  const avgRating = school.reviews && school.reviews.length > 0
    ? (school.reviews.reduce((sum, r) => sum + r.rating, 0) / school.reviews.length).toFixed(1)
    : null;

  // Generate initials for the logo
  const initials = school.school_name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .substring(0, 3)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Hero Banner */}
      <div className="relative h-[400px] md:h-[500px] w-full bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-primary/40 to-primary/80 z-10" />
        {/* Placeholder for Cover Image */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070')] bg-cover bg-center opacity-30" />

        <div className="container mx-auto px-4 relative z-20 h-full flex items-end pb-12">
          <div className="flex flex-col md:flex-row items-end gap-6 w-full">
            {/* School Logo Box */}
            <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-2xl p-2 shadow-2xl flex-shrink-0 relative group">
              <div className="w-full h-full bg-slate-100 rounded-xl flex items-center justify-center border border-border">
                <span className="text-4xl md:text-5xl font-bold text-primary">{initials}</span>
              </div>
              <div className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full border-2 border-white shadow-sm">
                Admissions Open
              </div>
            </div>

            {/* School Title & Quick Info */}
            <div className="flex-1 text-white">
              <h1 className="text-3xl md:text-5xl font-bold mb-3">{school.school_name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-white/90">
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-white" /> {school.location}</span>
                <span className="flex items-center gap-1.5"><GraduationCap className="w-4 h-4 text-white" /> {school.board_type} Board</span>
                {avgRating && (
                  <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /> {avgRating} ({school.reviews.length} Review{school.reviews.length !== 1 ? 's' : ''})</span>
                )}
              </div>
            </div>

            {/* CTA Actions */}
            <div className="flex flex-col gap-3 w-full md:w-auto mt-6 md:mt-0">
              <button
                onClick={() => setShowAdmissionForm(true)}
                className="px-8 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 whitespace-nowrap"
              >
                Apply for Admission
              </button>
              <button
                onClick={() => generateBrochurePDF(school)}
                className="px-8 py-3.5 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors whitespace-nowrap flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Brochure
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content Area (Left 2/3) */}
          <div className="lg:col-span-2 space-y-12">

            {/* About Section */}
            <section className="bg-white dark:bg-card p-8 rounded-3xl border border-border shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-4">About School</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">{school.description || "No description available."}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-border">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Established</p>
                  <p className="font-semibold flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> {school.formation_year || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Classes</p>
                  <p className="font-semibold flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> {school.class_range}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Principal</p>
                  <p className="font-semibold">{school.principal_name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Director</p>
                  <p className="font-semibold">{school.director_name || "N/A"}</p>
                </div>
              </div>
            </section>

            {/* Photo Gallery Section */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">Photo Gallery</h2>
              {school.images && school.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {school.images.map((img) => {
                    const typeLabels: Record<string, string> = {
                      campus: "Campus",
                      classroom: "Classroom",
                      lab: "Science Lab",
                      playground: "Playground",
                      library: "Library",
                      computer_lab: "Computer Lab",
                      gallery: "Gallery",
                      cover: "Cover",
                      logo: "Logo",
                    };
                    return (
                      <div
                        key={img.id}
                        className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer border border-border shadow-sm hover:shadow-lg transition-all duration-300"
                        onClick={() => setLightboxImage(img.image_url)}
                      >
                        <img
                          src={img.image_url}
                          alt={typeLabels[img.image_type] || img.image_type}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <span className="text-white text-sm font-semibold bg-primary/80 px-3 py-1 rounded-full">
                            {typeLabels[img.image_type] || img.image_type}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-10 text-center bg-muted/30 rounded-2xl border border-border">
                  <Camera className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground font-medium">Photos coming soon.</p>
                </div>
              )}
            </section>

            {/* Facilities Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Premium Facilities</h2>
              </div>
              {school.facilities && school.facilities.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {school.facilities.map((facility) => {
                    const iconMap: Record<string, React.ReactNode> = {
                      "Smart Classroom": <Monitor className="w-6 h-6" />,
                      "Computer Lab": <Monitor className="w-6 h-6" />,
                      "Physics Lab": <BookOpen className="w-6 h-6" />,
                      "Chemistry Lab": <BookOpen className="w-6 h-6" />,
                      "Biology Lab": <BookOpen className="w-6 h-6" />,
                      "Science Lab": <BookOpen className="w-6 h-6" />,
                      "Mathematics Lab": <BookOpen className="w-6 h-6" />,
                      "Language Lab": <BookOpen className="w-6 h-6" />,
                      "Library": <BookOpen className="w-6 h-6" />,
                      "Sports Ground": <Award className="w-6 h-6" />,
                      "Transport Facility": <Bus className="w-6 h-6" />,
                      "Auditorium": <Users className="w-6 h-6" />,
                      "Music Room": <Star className="w-6 h-6" />,
                      "Art & Craft Room": <Star className="w-6 h-6" />,
                      "CCTV Security": <Monitor className="w-6 h-6" />,
                    };
                    const icon = iconMap[facility.facility_name] || <GraduationCap className="w-6 h-6" />;
                    return (
                      <FacilityCard
                        key={facility.id}
                        title={facility.facility_name}
                        icon={icon}
                        description={facility.facility_description}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="py-10 text-center bg-muted/30 rounded-2xl border border-border">
                  <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground font-medium">Facility information coming soon.</p>
                </div>
              )}
            </section>

            {/* Teachers Section */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">Our Expert Faculty</h2>
              {school.teachers && school.teachers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {school.teachers.map((teacher) => (
                    <TeacherCard key={teacher.id} teacher={teacher} />
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center bg-muted/30 rounded-2xl border border-border">
                  <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground font-medium">Faculty information coming soon.</p>
                </div>
              )}
            </section>

            {/* Extra Curricular Section */}
            <section className="bg-primary/5 p-8 rounded-3xl border border-primary/10">
              <h2 className="text-2xl font-bold text-foreground mb-6">Extracurricular Activities & Preparation</h2>
              {school.extracurriculars && school.extracurriculars.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {(() => {
                    const clubs = school.extracurriculars.filter(e => e.activity_type === "club");
                    const preps = school.extracurriculars.filter(e => e.activity_type === "competitive_prep");
                    const sports = school.extracurriculars.filter(e => e.activity_type === "sports_activity");
                    return (
                      <>
                        {clubs.length > 0 && (
                          <div>
                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><Star className="w-5 h-5 text-primary" /> Clubs & Activities</h3>
                            <ul className="space-y-3">
                              {clubs.map((item) => (
                                <li key={item.id} className="flex items-center gap-2 text-muted-foreground"><span className="w-2 h-2 rounded-full bg-primary" />{item.activity_name}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {preps.length > 0 && (
                          <div>
                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-primary" /> Competitive Prep</h3>
                            <ul className="space-y-3">
                              {preps.map((item) => (
                                <li key={item.id} className="flex items-center gap-2 text-muted-foreground"><span className="w-2 h-2 rounded-full bg-amber-500" />{item.activity_name}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {sports.length > 0 && (
                          <div>
                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><Trophy className="w-5 h-5 text-primary" /> Sports & Fitness</h3>
                            <ul className="space-y-3">
                              {sports.map((item) => (
                                <li key={item.id} className="flex items-center gap-2 text-muted-foreground"><span className="w-2 h-2 rounded-full bg-green-500" />{item.activity_name}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="py-10 text-center bg-muted/30 rounded-2xl border border-border">
                  <Star className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground font-medium">Extracurricular information coming soon.</p>
                </div>
              )}
            </section>

            {/* Reviews Section */}
            <section>
               <h2 className="text-2xl font-bold text-foreground mb-6">Parent & Student Reviews</h2>
               {school.reviews && school.reviews.length > 0 ? (
                 <div className="space-y-4">
                   {school.reviews.map(review => (
                     <div key={review.id} className="bg-white dark:bg-card p-6 rounded-2xl border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                              {(review.student_name || "S").charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-foreground">{review.student_name || `Student ${review.student_id}`}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex text-amber-400">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < Math.round(review.rating / 2) ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`} />
                              ))}
                            </div>
                            <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{review.rating}/10</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground">{review.review}</p>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="py-10 text-center bg-muted/30 rounded-2xl border border-border">
                   <Star className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                   <p className="text-muted-foreground font-medium">No reviews yet. Be the first to review!</p>
                 </div>
               )}
            </section>

          </div>

          {/* Sidebar Area (Right 1/3) */}
          <div className="space-y-6">

            {/* Contact Card */}
            <div className="bg-white dark:bg-card p-6 rounded-3xl border border-border shadow-sm sticky top-24">
              <h3 className="text-xl font-bold mb-6 border-b border-border pb-4">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Address</p>
                    <p className="font-medium text-foreground">{school.full_address || school.location}</p>
                  </div>
                </div>
                {school.phone && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Phone</p>
                      <p className="font-medium text-foreground">{school.phone}</p>
                    </div>
                  </div>
                )}
                {school.email && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Email</p>
                      <p className="font-medium text-foreground">{school.email}</p>
                    </div>
                  </div>
                )}
                {school.website && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Globe className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Website</p>
                      <a href={school.website.startsWith('http') ? school.website : `https://${school.website}`} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline cursor-pointer">{school.website}</a>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <button className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors">
                  Contact School
                </button>
              </div>
            </div>

            {/* Admission Timeline Card */}
            <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10">
              <h3 className="font-bold text-lg mb-4">Admission Timeline 2026-27</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Forms Available</span>
                  <span className="font-semibold text-foreground">Jan 15, 2026</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Last Date</span>
                  <span className="font-semibold text-destructive">Feb 28, 2026</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Entrance Test</span>
                  <span className="font-semibold text-foreground">Mar 10, 2026</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Admission Form Modal */}
      <AdmissionFormModal
        isOpen={showAdmissionForm}
        onClose={() => setShowAdmissionForm(false)}
        currentSchool={{
          school_name: school.school_name,
          location: school.location,
        }}
      />

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white hover:text-primary transition-colors"
            onClick={() => setLightboxImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={lightboxImage}
            alt="Gallery"
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
