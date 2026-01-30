import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("sp_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface LoginPayload {
  email: string;
  password: string;
}

export const login = async (payload: LoginPayload) => {
  const formData = new URLSearchParams();
  formData.append("username", payload.email);
  formData.append("password", payload.password);
  formData.append("grant_type", "password");
  const { data } = await api.post("/auth/login", formData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  localStorage.setItem("sp_token", data.access_token);
  return data;
};

export interface RegisterPayload {
  email: string;
  password: string;
  full_name?: string;
}

export const registerUser = async (payload: RegisterPayload) => {
  const { data } = await api.post("/auth/register", payload);
  return data;
};

export const fetchDashboard = async () => {
  const { data } = await api.get("/dashboard");
  return data;
};

export const fetchReviews = async () => {
  const { data } = await api.get("/reviews");
  return data;
};

export const fetchMe = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};

export interface User {
  id: number;
  email: string;
  full_name?: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export const fetchUsers = async () => {
  const { data } = await api.get<User[]>("/users");
  return data;
};

export const addUser = async (payload: RegisterPayload & { role: string }) => {
  const { data } = await api.post<User>("/users", payload);
  return data;
};

export const deleteUser = async (userId: number) => {
  await api.delete(`/users/${userId}`);
};

export interface FeedbackFormType {
  id: number;
  uuid: string;
  name: string;
  question: string;
  owner_id: number;
  created_at: string;
}

export const fetchForms = async () => {
  const { data } = await api.get<FeedbackFormType[]>("/forms");
  return data;
};

export const createForm = async (name: string, question: string) => {
  const { data } = await api.post<FeedbackFormType>("/forms", { name, question });
  return data;
};

export const deleteForm = async (formId: number) => {
  await api.delete(`/forms/${formId}`);
};

export const getPublicForm = async (uuid: string) => {
  const { data } = await api.get<FeedbackFormType>(`/public/${uuid}`);
  return data;
};

export const submitPublicReview = async (uuid: string, payload: { content: string; author?: string }) => {
  const { data } = await api.post(`/public/${uuid}`, payload);
  return data;
};

export const fetchFormStats = async (formId: number) => {
  // Reusing the same DashboardSummary structure implicitly or we can define it if needed
  // But for now, we know it returns what Dashboard component expects
  const { data } = await api.get(`/forms/${formId}/stats`);
  return data;
};


