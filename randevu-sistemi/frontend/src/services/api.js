import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// Token varsa bütün isteklere otomatik ekle
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  return config;
});

// Hizmetler
export const getServices = () =>
  API.get("/services/");

// Personeller
export const getPersonnels = () =>
  API.get("/personnels/");

// Boş randevu saatleri
export const getAvailableSlots = (
  serviceId,
  personnelId,
  date
) =>
  API.get("/available-slots/", {
    params: {
      service: serviceId,
      personnel: personnelId,
      date,
    },
  });

// Randevu oluştur
export const createAppointment = (data) =>
  API.post("/create-appointment/", data);

// Randevu durumunu güncelle
export const updateAppointmentStatus = (
  id,
  statusValue
) =>
  API.patch(
    `/appointments/${id}/status/`,
    {
      status: statusValue,
    }
  );

// Kullanıcının randevuları
export const getMyAppointments = (page = 1) =>
  API.get(`/my-appointments/?page=${page}`);

// Randevu iptal
export const cancelAppointment = (id) =>
  API.post(`/appointments/${id}/cancel/`);

// Dashboard
export const getDashboard = () =>
  API.get("/dashboard/");

// Kayıt
export const registerUser = (
  username,
  email,
  password
) =>
  API.post("/register/", {
    username,
    email,
    password,
  });

// Giriş
export const loginUser = (
  username,
  password
) =>
  API.post("/login/", {
    username,
    password,
  });

// E-posta doğrulama
export const verifyEmail = (
  uid,
  token
) =>
  API.get(`/verify-email/${uid}/${token}/`);