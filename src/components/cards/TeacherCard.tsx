import { BookOpen, Award, Users } from "lucide-react";
import { TeacherResponse } from "@/types";

interface TeacherCardProps {
  teacher: TeacherResponse;
}

export function TeacherCard({ teacher }: TeacherCardProps) {
  return (
    <div className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Avatar Placeholder */}
        <div className="w-24 h-24 rounded-full bg-primary/10 border-4 border-white dark:border-gray-800 shadow-sm flex items-center justify-center overflow-hidden">
           <span className="text-2xl text-primary font-bold">{teacher.teacher_name.charAt(0)}</span>
        </div>

        <div>
          <h4 className="text-lg font-bold text-foreground">{teacher.teacher_name}</h4>
          <p className="text-primary font-medium text-sm mt-1">{teacher.subject}</p>
        </div>

        <div className="w-full grid grid-cols-2 gap-4 pt-4 border-t border-border mt-4">
          <div className="flex flex-col items-center gap-1">
            <Award className="w-5 h-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Experience</span>
            <span className="font-semibold text-sm">{teacher.experience} Years</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Users className="w-5 h-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Classes</span>
            <span className="font-semibold text-sm">{teacher.class_range}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
