const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const api = {
  // --- Auth ---
  async login(data: FormData) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      body: data, // OAuth2PasswordRequestForm expects FormData
    });
    if (!response.ok) throw new Error("Login failed");
    return response.json();
  },

  async registerStudent(data: any) {
    const response = await fetch(`${API_BASE_URL}/auth/register/student`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Registration failed");
    return response.json();
  },

  async registerSchool(data: any) {
    const response = await fetch(`${API_BASE_URL}/auth/register/school`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Registration failed");
    return response.json();
  },

  // --- Schools ---
  async getSchools(search?: string, skip = 0, limit = 100) {
    let url = `${API_BASE_URL}/schools/?skip=${skip}&limit=${limit}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch schools");
    return response.json();
  },

  async getSchoolDetails(id: number | string) {
    const response = await fetch(`${API_BASE_URL}/schools/${id}`);
    if (!response.ok) throw new Error("Failed to fetch school details");
    return response.json();
  },

  async createSchoolProfile(data: any, token: string) {
    const response = await fetch(`${API_BASE_URL}/schools/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create school profile");
    return response.json();
  },

  // --- Teachers ---
  async getTeachers(schoolId: number | string) {
    const response = await fetch(`${API_BASE_URL}/teachers/${schoolId}`);
    if (!response.ok) throw new Error("Failed to fetch teachers");
    return response.json();
  },

  // --- Ads ---
  async getAds() {
    const response = await fetch(`${API_BASE_URL}/ads/`);
    if (!response.ok) throw new Error("Failed to fetch ads");
    return response.json();
  },

  // --- Reviews ---
  async getReviews(schoolId: number | string) {
    const response = await fetch(`${API_BASE_URL}/reviews/${schoolId}`);
    if (!response.ok) throw new Error("Failed to fetch reviews");
    return response.json();
  }
};
