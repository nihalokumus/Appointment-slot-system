import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// Token varsa her isteğe otomatik ekle
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export const getServices = () => API.get("/services/");
export const getPersonnels = () => API.get("/personnels/");
export const getAvailableSlots = (serviceId, personnelId, date) =>
  API.get("/available-slots/", {
    params: { service: serviceId, personnel: personnelId, date },
  });
export const createAppointment = (data) => API.post("/create-appointment/", data);
export const updateAppointmentStatus = (id, statusValue) =>
  API.patch(`/appointments/${id}/status/`, { status: statusValue });

export const registerUser = (username, password) =>
  API.post("/register/", { username, password });
export const loginUser = (username, password) =>
  API.post("/login/", { username, password });
export const getMyAppointments = () =>
  API.get("/my-appointments/");