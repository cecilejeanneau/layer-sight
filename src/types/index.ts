export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
  avatar?: string;
}

export interface DataPoint3D {
  x: number;
  y: number;
  z: number;
  color?: string;
  label?: string;
  value?: number;
}

export interface DataPoint2D {
  x: number;
  y: number;
  label?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
  }[];
}

export interface TableResult {
  id: string;
  name: string;
  value: number;
  category: string;
  status: 'active' | 'inactive' | 'pending';
  date: string;
}

export interface AppSettings {
  language: 'fr' | 'en';
  theme: 'light' | 'dark';
  notifications: boolean;
  autoSave: boolean;
}

export interface ConfigSettings {
  dataSource: string;
  refreshInterval: number;
  maxDataPoints: number;
  defaultVisualization: '2d' | '3d' | '2.5d';
  colorScheme: string;
  gridSize: number;
}