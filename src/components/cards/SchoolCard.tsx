import Link from "next/link";
import { MapPin, Star, Users, GraduationCap, CheckCircle } from "lucide-react";
import { SchoolResponse } from "@/types";

interface SchoolCardProps {
  school: SchoolResponse;
}

export function SchoolCard({ school }: SchoolCardProps) {
  return (
    <div className="group relative bg-white dark:bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <span className="px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full shadow-sm">
          Admission Open
        </span>
        {school.id % 2 === 0 && (
          <span className="px-3 py-1 bg-amber-500 text-white text-xs font-semibold rounded-full shadow-sm flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" /> Featured
          </span>
        )}
      </div>

      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        {/* Placeholder for actual image */}
        <div className="w-full h-full bg-slate-200 dark:bg-slate-800 group-hover:scale-105 transition-transform duration-500" />

        <div className="absolute bottom-4 left-4 z-20 flex items-end gap-3">
          <div className="w-12 h-12 bg-white rounded-lg p-1 shadow-md">
            <div className="w-full h-full bg-slate-100 rounded flex items-center justify-center text-primary font-bold">
              {school.school_name.substring(0, 2).toUpperCase()}
            </div>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg leading-tight group-hover:text-primary transition-colors">
              {school.school_name}
            </h3>
            <p className="text-white/80 text-sm flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3" /> {school.location}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-primary" />
            <span>{school.board_type}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <span>Class {school.class_range}</span>
          </div>
        </div>

        {/* Facilities Preview */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          {['Smart Class', 'Sports', 'Transport'].map((facility, idx) => (
            <span key={idx} className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-primary" /> {facility}
            </span>
          ))}
          <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md">
            +3 more
          </span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="font-semibold">4.8</span>
            <span className="text-muted-foreground text-xs">(120 reviews)</span>
          </div>
          <Link
            href={`/schools/${school.id}`}
            className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            Explore
          </Link>
        </div>
      </div>
    </div>
  );
}
