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
  const [isTeacher, setIsTeacher] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [hasActivePersonalProject, setHasActivePersonalProject] =
    useState(false);
  const [hasApprovedPersonalProject, setHasApprovedPersonalProject] =
    useState(false);

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
    } else {
      setIsTeacher(user.type === UserEnum.TEACHER);
      setIsStudent(user.type === UserEnum.STUDENT);
      setHasActivePersonalProject(user.personalProjects?.length > 0);
      setHasApprovedPersonalProject(
        user.personalProjects?.some(
          (project) => project.status === PersonalProjectStatusEnum.APPROVED
        )
      );
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
