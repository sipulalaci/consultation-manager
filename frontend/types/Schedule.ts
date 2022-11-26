import { Comment } from "./Comment";
import { Task } from "./Task";

export interface Schedule {
  id: string;
  personalProjectId: string;
  description: string;
  deadline: Date;
  createdAt: Date;
  tasks: Task[];
  comments: Comment[];
}
