import Link from "next/link";
import { School, MapPin, Mail, Phone, Globe, MessageCircle, Share2, Send, ArrowRight, Award, Users } from "lucide-react";

const STATS = [
  { icon: School, label: "Registered Schools", value: "500+" },
  { icon: Users, label: "Happy Students", value: "10K+" },
  { icon: MapPin, label: "Cities Covered", value: "50+" },
  { icon: Award, label: "Verified Reviews", value: "15K+" },
];

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Explore Schools", href: "/schools" },
  { label: "Register School", href: "/register?type=school" },
  { label: "Student Registration", href: "/register?type=student" },
  { label: "Login", href: "/login" },
];

const LOCATIONS = [
  { label: "Nalanda", href: "/schools?filter=nalanda" },
  { label: "Biharsharif", href: "/schools?filter=biharsharif" },
  { label: "Nawada", href: "/schools?filter=nawada" },
  { label: "Harnaut", href: "/schools?filter=harnaut" },
  { label: "Rajgir", href: "/schools?filter=rajgir" },
];

const SUPPORT_LINKS = [
  { label: "Contact Us", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "FAQ", href: "#" },
  { label: "Help Center", href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 pt-16 pb-12">

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 mb-12 border-b border-white/10">
          {STATS.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-1">
                <stat.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
              <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <School className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">EduFind</span>
            </Link>
            <p className="text-gray-400 leading-relaxed text-sm">
              India&apos;s most trusted school discovery platform. Find, compare, and connect with the best schools near you.
            </p>
            <div className="flex items-center gap-3">
              {[Globe, MessageCircle, Share2, Send].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                  <Icon className="w-4 h-4 text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-gray-400 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                    <ArrowRight className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Locations</h4>
            <ul className="space-y-3">
              {LOCATIONS.map((loc, i) => (
                <li key={i}>
                  <Link href={loc.href} className="text-gray-400 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                    <MapPin className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    {loc.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Contact & Support</h4>
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Email</p>
                  <p className="text-sm text-gray-300">support@edufind.in</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Phone</p>
                  <p className="text-sm text-gray-300">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Address</p>
                  <p className="text-sm text-gray-300">Nalanda, Bihar, India</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} EduFind. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
            {SUPPORT_LINKS.map((link, i) => (
              <Link key={i} href={link.href} className="hover:text-primary transition-colors">{link.label}</Link>
            ))}
            <Link href="#" className="hover:text-primary transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
