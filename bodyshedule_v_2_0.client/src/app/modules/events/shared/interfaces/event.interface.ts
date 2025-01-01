import { Exercise } from "./exercise.interface";

export interface Event {
  userId?: string;
  id?: number;
  title: string;
  description: string;
  startTime: string;
  status: string;
  exercises: Exercise[];
}
