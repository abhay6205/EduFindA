export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface ImageResponse {
  id: number;
  image_url: string;
  image_type: string;
  school_id: number;
}

export interface TeacherResponse {
  id: number;
  teacher_name: string;
  subject: string;
  experience: number;
  class_range: string;
  school_id: number;
}

export interface AdResponse {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  school_id: number;
}

export interface ReviewResponse {
  id: number;
  rating: number;
  review: string;
  student_id?: number;
  student_name?: string;
  school_id: number;
}

export interface FacilityResponse {
  id: number;
  facility_name: string;
  facility_description?: string;
  school_id: number;
}

export interface ExtracurricularResponse {
  id: number;
  activity_type: string;
  activity_name: string;
  school_id: number;
}

export interface SchoolResponse {
  id: number;
  school_name: string;
  location: string;
  full_address?: string;
  board_type: string;
  formation_year?: number;
  class_range: string;
  principal_name?: string;
  director_name?: string;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  owner_id?: number;
  images: ImageResponse[];
  teachers: TeacherResponse[];
  facilities: FacilityResponse[];
  extracurriculars: ExtracurricularResponse[];
}

export interface SchoolDetailResponse extends SchoolResponse {
  ads: AdResponse[];
  reviews: ReviewResponse[];
}
