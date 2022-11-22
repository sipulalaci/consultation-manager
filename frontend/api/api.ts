import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
});

export const postLogin = (data: any) => api.post("/login", data);

export const postRegister = (data: any) => api.post("/register", data);

export const getProjects = () => api.get("/projects");

export const postProject = (data: any) => api.post("/projects", data);

export const putProject = (id: string, data: any) =>
  api.put(`/projects/${id}`, data);

export const getPersonalProjects = () => api.get("/personal-projects");

export const getPersonalProject = (id: string) =>
  api.get(`/personal-projects/${id}`);

export const postPersonalProject = (data: any) =>
  api.post("/personal-projects", data);

export const putPersonalProject = (id: string, data: any) =>
  api.put(`/personal-projects/${id}`, data);
