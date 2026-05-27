"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { School, User, ArrowRight, ArrowLeft } from "lucide-react";
import { Header } from "@/components/navbar/Header";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"student" | "school">("student");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [location, setLocation] = useState("");
  const [boardType, setBoardType] = useState("CBSE");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1 && role === "school") {
      setStep(2);
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      let endpoint = `${API_BASE_URL}/auth/register/student`;
      let payload: any = {
        name,
        email,
        role: "student",
        password,
      };

      if (role === "school") {
        endpoint = `${API_BASE_URL}/schools/create`;
        payload = {
          school_name: schoolName,
          location,
          board_type: boardType,
          formation_year: 2000, // Default value since it's not in UI
          class_range: "Nursery to 12th", // Default value
          principal_name: name,
          director_name: name,
          description: "A great school.",
          email,
          phone,
          password,
        };
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Registration failed");
      }

      // Automatically redirect to login page after successful registration
      router.push(`/login?type=${role}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-2xl bg-white dark:bg-card rounded-3xl border border-border shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-primary p-8 text-center text-white relative">
            {step > 1 && (
              <button type="button" onClick={() => setStep(step - 1)} className="absolute left-6 top-1/2 -translate-y-1/2 p-2 hover:bg-white/20 rounded-full transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </button>
            )}
            <h1 className="text-3xl font-bold mb-2">Create an Account</h1>
            <p className="text-white/80">Join EduFind to {role === 'student' ? 'discover top schools' : 'manage your school profile'}</p>
          </div>

          {/* Role Toggle (Only show on Step 1) */}
          {step === 1 && (
            <div className="flex p-4 gap-4 bg-muted/30 border-b border-border justify-center">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`flex-1 max-w-xs py-4 text-sm font-bold rounded-xl flex flex-col items-center justify-center gap-3 transition-all border-2 ${role === 'student' ? 'border-primary bg-primary/5 text-primary' : 'border-transparent bg-white dark:bg-card text-muted-foreground hover:border-primary/50 shadow-sm'}`}
              >
                <div className={`p-3 rounded-full ${role === 'student' ? 'bg-primary text-white' : 'bg-muted'}`}>
                  <User className="w-6 h-6" />
                </div>
                I'm a Student / Parent
              </button>
              <button
                type="button"
                onClick={() => setRole("school")}
                className={`flex-1 max-w-xs py-4 text-sm font-bold rounded-xl flex flex-col items-center justify-center gap-3 transition-all border-2 ${role === 'school' ? 'border-primary bg-primary/5 text-primary' : 'border-transparent bg-white dark:bg-card text-muted-foreground hover:border-primary/50 shadow-sm'}`}
              >
                <div className={`p-3 rounded-full ${role === 'school' ? 'bg-primary text-white' : 'bg-muted'}`}>
                  <School className="w-6 h-6" />
                </div>
                I represent a School
              </button>
            </div>
          )}

          {/* Form Content */}
          <div className="p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-900">
                  {error}
                </div>
              )}

              {role === 'student' || (role === 'school' && step === 1) ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Full Name {role === 'school' && '(Principal/Admin)'}</label>
                      <input required value={name} onChange={(e) => setName(e.target.value)} type="text" className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Email Address</label>
                      <input required value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Phone Number</label>
                      <input required value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Password</label>
                      <input required value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                    </div>
                  </div>
                </>
              ) : (
                // Step 2 for School Only
                <>
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg border-b border-border pb-2">School Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-foreground">School Name</label>
                        <input required value={schoolName} onChange={(e) => setSchoolName(e.target.value)} type="text" className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:border-primary outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">City/Location</label>
                        <input required value={location} onChange={(e) => setLocation(e.target.value)} type="text" className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:border-primary outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Board Affiliation</label>
                        <select value={boardType} onChange={(e) => setBoardType(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:border-primary outline-none appearance-none cursor-pointer">
                          <option value="CBSE">CBSE</option>
                          <option value="ICSE">ICSE</option>
                          <option value="State Board">State Board</option>
                          <option value="IB">IB</option>
                          <option value="IGCSE">IGCSE</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <button disabled={isLoading} type="submit" className="w-full h-14 mt-8 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 text-lg disabled:opacity-70 disabled:cursor-not-allowed">
                {isLoading ? "Processing..." : (role === 'school' && step === 1 ? 'Continue to Next Step' : 'Create Account')}
                {role === 'school' && step === 1 && !isLoading && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>

            <div className="mt-8 text-center pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary font-bold hover:underline">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
