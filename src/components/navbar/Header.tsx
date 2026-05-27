"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, MapPin, School, UserPlus, LogIn, Menu, X, LogOut, LayoutDashboard, User } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    const name = localStorage.getItem("userName");
    setIsLoggedIn(!!token);
    setUserRole(role);
    setUserName(name);
  }, []);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/schools?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    setUserRole(null);
    setUserName(null);
    setActiveDropdown(null);
    router.push("/");
  };

  const guestNavItems = [
    {
      name: "Locations",
      icon: <MapPin className="w-4 h-4 mr-2" />,
      options: ["Nalanda", "Biharsharif", "Nawada", "Harnaut", "Rajgir"],
    },
    {
      name: "Schools",
      icon: <School className="w-4 h-4 mr-2" />,
      options: [
        { label: "Top Schools", href: "/schools" },
        { label: "CBSE Schools", href: "/schools?board=CBSE" },
        { label: "ICSE Schools", href: "/schools?board=ICSE" },
        { label: "International Boards", href: "/schools?board=IB" },
      ],
    },
    {
      name: "Register",
      icon: <UserPlus className="w-4 h-4 mr-2" />,
      options: [
        { label: "Register as School", href: "/register?type=school" },
        { label: "Register as Student", href: "/register?type=student" },
      ],
    },
    {
      name: "Login",
      icon: <LogIn className="w-4 h-4 mr-2" />,
      options: [
        { label: "School Login", href: "/login?type=school" },
        { label: "Student Login", href: "/login?type=student" },
      ],
    },
  ];

  const browseNavItems = [
    {
      name: "Locations",
      icon: <MapPin className="w-4 h-4 mr-2" />,
      options: ["Nalanda", "Biharsharif", "Nawada", "Harnaut", "Rajgir"],
    },
    {
      name: "Schools",
      icon: <School className="w-4 h-4 mr-2" />,
      options: [
        { label: "Top Schools", href: "/schools" },
        { label: "CBSE Schools", href: "/schools?board=CBSE" },
        { label: "ICSE Schools", href: "/schools?board=ICSE" },
        { label: "International Boards", href: "/schools?board=IB" },
      ],
    },
  ];

  const navItems = isLoggedIn ? browseNavItems : guestNavItems;

  const dashboardLink = userRole === "school" ? "/dashboard/admin" : "/dashboard/student";
  const userInitial = userName ? userName.charAt(0).toUpperCase() : (userRole === "school" ? "S" : "U");

  return (
    <header className="sticky top-0 z-50 w-full bg-primary shadow-lg transition-all duration-300">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <School className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">EduFind</span>
        </Link>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8 relative group">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search schools, location, facilities..."
            className="w-full h-12 pl-12 pr-4 rounded-full bg-white/20 border border-white/30 text-white placeholder-white/70 focus:bg-white/30 focus:border-white/50 focus:ring-1 focus:ring-white/30 outline-none transition-all duration-300"
          />
          <Search className="w-5 h-5 text-white/70 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-white transition-colors" />
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <div
              key={item.name}
              className="relative"
              onMouseEnter={() => setActiveDropdown(item.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center text-sm font-medium text-white/80 hover:text-white transition-colors py-2">
                {item.icon}
                {item.name}
              </button>

              <AnimatePresence>
                {activeDropdown === item.name && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 w-56 py-2 mt-2 bg-primary rounded-xl shadow-xl border border-white/20"
                  >
                    {item.options.map((opt, i) => (
                      <Link
                        key={i}
                        href={typeof opt === 'string' ? `/schools?filter=${opt.toLowerCase()}` : opt.href}
                        className="block px-4 py-2 text-sm text-white/90 hover:bg-white/20 hover:text-white transition-colors"
                      >
                        {typeof opt === 'string' ? opt : opt.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {/* Authenticated User Avatar & Dropdown */}
          {isLoggedIn && (
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("profile")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="w-10 h-10 rounded-full bg-white text-primary flex items-center justify-center font-bold text-sm hover:ring-2 hover:ring-white/50 transition-all">
                {userInitial}
              </button>

              <AnimatePresence>
                {activeDropdown === "profile" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 w-56 py-2 mt-2 bg-primary rounded-xl shadow-xl border border-white/20"
                  >
                    {userName && (
                      <div className="px-4 py-2 border-b border-white/20 mb-1">
                        <p className="text-sm font-semibold text-white truncate">{userName}</p>
                        <p className="text-xs text-white/60 capitalize">{userRole} Account</p>
                      </div>
                    )}
                    <Link
                      href={dashboardLink}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-white/90 hover:bg-white/20 hover:text-white transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link
                      href="/schools"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-white/90 hover:bg-white/20 hover:text-white transition-colors"
                    >
                      <School className="w-4 h-4" /> Browse Schools
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:bg-white/20 hover:text-white transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-primary border-t border-white/20 overflow-hidden"
          >
            <div className="p-4 space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  placeholder="Search schools..."
                  className="w-full h-10 pl-10 pr-4 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:bg-white/30 outline-none"
                />
                <Search className="w-5 h-5 text-white/70 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              {navItems.map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center text-sm font-medium text-white">
                    {item.icon}
                    {item.name}
                  </div>
                  <div className="pl-6 space-y-2">
                    {item.options.map((opt, i) => (
                      <Link
                        key={i}
                        href={typeof opt === 'string' ? `/schools?filter=${opt.toLowerCase()}` : opt.href}
                        className="block text-sm text-white/70 hover:text-white"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {typeof opt === 'string' ? opt : opt.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              {/* Mobile Auth Section */}
              {isLoggedIn && (
                <div className="border-t border-border pt-4 space-y-2">
                  <Link
                    href={dashboardLink}
                    className="flex items-center gap-2 text-sm font-medium text-white hover:text-white/80"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                    className="flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
