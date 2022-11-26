export interface Task {
  id: string;
  scheduleId: string;
  description: string;
  isDone: boolean;
  createdAt: Date;
}
