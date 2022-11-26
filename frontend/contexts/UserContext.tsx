import { createContext, ReactNode, useEffect, useState } from "react";
import { getMe } from "../api/api";
import { User, UserEnum } from "../types/User";
import {
  getFromStorage,
  removeFromStorage,
} from "../utils/localStorageHelpers";

interface UserContextProps {
  children: ReactNode;
}

export const Context = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
  isTeacher: boolean;
  isStudent: boolean;
} | null>(null);

export const UserContext = ({ children }: UserContextProps) => {
  const [user, setUser] = useState<User | null>(null);
  const isTeacher = user?.type === UserEnum.TEACHER;
  const isStudent = user?.type === UserEnum.STUDENT;

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
  };

  return <Context.Provider value={context}>{children}</Context.Provider>;
};
