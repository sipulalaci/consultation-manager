export enum UserEnum {
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
}

export interface User {
  id: string;
  name: string;
  email: string;
  type: keyof typeof UserEnum;
}
