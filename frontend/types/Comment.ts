import { User } from "./User";

export interface Comment {
  id: string;
  scheduleId: string;
  question: string;
  userId: string;
  user: User;
  createdAt: Date;
}
