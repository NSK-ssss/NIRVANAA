import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'src/data/db.json');

export interface Review {
  id: string;
  clientName: string;
  avatar?: string;
  rating: number;
  reviewText: string;
  date: string;
}

export interface Project {
  id: string;
  name: string;
  category: string;
  url?: string;
  coverImage: string;
  images: string[];
  description: string;
  scope: string;
  tools: string[];
  duration: string;
  status?: string;
  costing: number;
  revenue: number;
  reviews: Review[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  skills: string[];
  socials: {
    twitter?: string;
    linkedin?: string;
    dribbble?: string;
    instagram?: string;
  };
}

export interface DatabaseSchema {
  team: TeamMember[];
  projects: Project[];
  settings: {
    yearsActive?: number;
    completedCount?: number;
    inProgressCount?: number;
    totalCount?: number;
  };
}

export interface GlobalStats {
  totalRevenue: number;
  totalProjects: number;
  completedProjects: number;
  inProgressProjects: number;
  totalClients: number;
  yearsActive: number;
}

export interface FullPayload extends DatabaseSchema {
  stats: GlobalStats;
}

// Read database
export function getRawDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return { team: [], projects: [], settings: {} };
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error reading database:', error);
    return { team: [], projects: [], settings: {} };
  }
}

// Write database
export function saveDatabase(data: DatabaseSchema): void {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to database:', error);
  }
}

// Get database with calculated statistics
export function getDatabasePayload(): FullPayload {
  const db = getRawDatabase();
  
  // Calculate total revenue (sum of all project costs)
  const totalRevenue = db.projects.reduce((sum, project) => sum + (Number(project.costing) || 0), 0);
  
  const completedProjects = db.settings?.completedCount || 7;
  const inProgressProjects = db.settings?.inProgressCount || 2;
  const totalProjects = db.projects.length || 10;

  const stats: GlobalStats = {
    totalRevenue,
    totalProjects,
    completedProjects,
    inProgressProjects,
    totalClients: totalProjects,
    yearsActive: db.settings?.yearsActive || 3
  };

  return {
    ...db,
    stats
  };
}
