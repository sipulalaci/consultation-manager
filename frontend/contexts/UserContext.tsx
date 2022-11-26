import { createContext, ReactNode, useEffect, useState } from "react";
import { getMe } from "../api/api";
import {
  PersonalProject,
  PersonalProjectStatusEnum,
} from "../components/PersonalProjects/PersonalProjects";
import { User, UserEnum } from "../types/User";
import {
  getFromStorage,
  removeFromStorage,
} from "../utils/localStorageHelpers";

interface UserContextProps {
  children: ReactNode;
}

export const Context = createContext<{
  user: (User & { personalProjects: PersonalProject[] }) | null;
  setUser: (
    user: (User & { personalProjects: PersonalProject[] }) | null
  ) => void;
  isTeacher: boolean;
  isStudent: boolean;
  hasActivePersonalProject: boolean;
  hasApprovedPersonalProject: boolean;
} | null>(null);

export const UserContext = ({ children }: UserContextProps) => {
  const [user, setUser] = useState<
    (User & { personalProjects: PersonalProject[] }) | null
  >(null);
  const isTeacher = user?.type === UserEnum.TEACHER;
  const isStudent = user?.type === UserEnum.STUDENT;
  const hasActivePersonalProject = user?.personalProjects
    ? user?.personalProjects?.length > 0
    : false;
  const hasApprovedPersonalProject = user?.personalProjects
    ? user?.personalProjects?.some(
        (project) => project.status === PersonalProjectStatusEnum.APPROVED
      )
    : false;

  useEffect(() => {
    if (!user) {
      const token = getFromStorage("token");
      if (token) {
        getMe()
          .then((response) => {
            setUser(response);
          })
          .catch((e) => {
            removeFromStorage("token");
          });
      }
    }
  }, [user]);

  const context = {
    user,
    setUser,
    isTeacher,
    isStudent,
    hasActivePersonalProject,
    hasApprovedPersonalProject,
  };

  return <Context.Provider value={context}>{children}</Context.Provider>;
};
