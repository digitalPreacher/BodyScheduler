import { Event } from "../../../events/shared/interfaces/event.interface";

export interface TrainingProgram {
  userId?: string;
  id?: number;
  title: string;
  description: string;
  weeks: Week[];
}

interface Week {
  id: number;
  weekNumber: number;
  events: Event[];
}
