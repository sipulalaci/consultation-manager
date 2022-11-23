import axios from "axios";
import { getFromStorage } from "../utils/localStorageHelpers";

const baseApiConfig = {
  baseURL: "http://localhost:3001",
};

const protectedApi = axios.create({
  ...baseApiConfig,
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + getFromStorage("token"),
  },
});

const publicApi = axios.create({
  ...baseApiConfig,
  headers: {
    "Content-Type": "application/json",
  },
});

export const postLogin = async (email: string, password: string) => {
  const { data } = await publicApi.post("/auth/login", { email, password });
  return data;
};

export const postRegister = async (user: any) => {
  const { data } = await publicApi.post("/auth/register", user);
  return data;
};

export const getProjects = async () => {
  const { data } = await protectedApi.get("/projects");
  return data;
};

export const postProject = async (project: any) => {
  const { data } = await protectedApi.post("/projects", project);
  return data;
};

export const putProject = (id: string, data: any) =>
  protectedApi.put(`/projects/${id}`, data);

export const getPersonalProjects = () => protectedApi.get("/personal-projects");

export const getPersonalProject = (id: string) =>
  protectedApi.get(`/personal-projects/${id}`);

export const postPersonalProject = (data: any) =>
  protectedApi.post("/personal-projects", data);

export const putPersonalProject = (id: string, data: any) =>
  protectedApi.put(`/personal-projects/${id}`, data);
