export interface Application {
  id: string;
  name: string;
  category: 'productive' | 'distracting';
}

export interface ContextSwitch {
  timestamp: number;
  sourceApp: string;
  targetApp: string;
}

export interface FocusSession {
  startTime: number;
  endTime: number;
  duration: number;
  switchCount: number;
}
