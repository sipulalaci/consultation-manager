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

protectedApi.interceptors.response.use((response) => {
  if (response.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
  return response;
});

export const postLogin = async (email: string, password: string) => {
  const { data } = await publicApi.post("/auth/login", { email, password });
  return data;
};

export const postRegister = async (user: any) => {
  const { data } = await publicApi.post("/auth/register", user);
  return data;
};

export const getMe = async () => {
  const { data } = await protectedApi.get("/users/me");
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

export const putProject = async (id: string, editedProject: any) => {
  const { data } = await protectedApi.put(`/projects/${id}`, editedProject);
  return data;
};

export const getPersonalProjects = async () => {
  const { data } = await protectedApi.get("/personal-projects");
  return data;
};

export const getPersonalProject = async (id: string) => {
  const { data } = await protectedApi.get(`/personal-projects/${id}`);
  return data;
};

export const postPersonalProject = async (newPersonalProject: any) => {
  const { data } = await protectedApi.post(
    "/personal-projects",
    newPersonalProject
  );
  return data;
};

export const putPersonalProject = async (
  id: string,
  editedPersonalProject: any
) => {
  const { data } = await protectedApi.put(
    `/personal-projects/${id}`,
    editedPersonalProject
  );
  return data;
};

export const postSchedule = async (schedule: any) => {
  const { data } = await protectedApi.post("/schedules", schedule);
  return data;
};

export const postScheduleAddTask = async (
  scheduleId: string,
  task: { description: string }
) => {
  const { data } = await protectedApi.post(
    `/schedules/${scheduleId}/add-task`,
    task
  );
  return data;
};
