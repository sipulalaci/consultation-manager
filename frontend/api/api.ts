import axios, { AxiosRequestConfig } from "axios";
import {
  getFromStorage,
  removeFromStorage,
} from "../utils/localStorageHelpers";

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

protectedApi.interceptors.request.use(
  async (axiosConfig: AxiosRequestConfig) => {
    if (axiosConfig.headers === undefined) {
      axiosConfig.headers = {};
    }

    const localStorageAuthToken = getFromStorage("token") || "";

    if (localStorageAuthToken) {
      axiosConfig.headers.Authorization = `Bearer ${localStorageAuthToken}`;
    }

    return axiosConfig;
  },
  (error) => {
    Promise.reject(error);
  }
);

protectedApi.interceptors.response.use(
  (_) => _,
  (error) => {
    if (error.response.status === 401) {
      if (typeof window !== "undefined") {
        removeFromStorage("token");
        window.location.href = `/login`;
      }
    }
    return Promise.reject(error);
  }
);

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

export const putScheduleToggleTask = async (
  scheduleId: string,
  taskId: string
) => {
  const { data } = await protectedApi.put(
    `/schedules/${scheduleId}/toggle-task/${taskId}`
  );
  return data;
};

export const postComment = async (comment: any) => {
  const { data } = await protectedApi.post("/comments", comment);
  return data;
};

export const getCommentsByUser = async (userId: string) => {
  const { data } = await protectedApi.get(`/comments/user/${userId}`);
  return data;
};

export const postConsultations = async (consultation: {
  date: Date;
  teacherId: string;
}) => {
  const { data } = await protectedApi.post("/consultations", consultation);
  return data;
};

export const getConsultationsForStudent = async (userId: string) => {
  const { data } = await protectedApi.get(`/consultations/student/${userId}`);
  return data;
};

export const getConsultationsForTeacher = async (userId: string) => {
  const { data } = await protectedApi.get(`/consultations/teacher/${userId}`);
  return data;
};

export const putConsultation = async (id: string, consultation: any) => {
  const { data } = await protectedApi.put(`/consultations/${id}`, consultation);
  return data;
};
