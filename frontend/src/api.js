import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

export const fetchVehicles = () => API.get("/vehicles");
export const createBooking = (bookingData) => API.post("/bookings", bookingData);
