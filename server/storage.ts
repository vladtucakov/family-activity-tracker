import { type User, type InsertUser, type Activity, type InsertActivity, type Badge, type InsertBadge, type Streak, type InsertStreak, FAMILY_MEMBERS, users, activities, badges, streaks } from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;

  // Activities  
  getActivitiesByUser(userId: number): Promise<Activity[]>;
  getActivitiesByUserAndDate(userId: number, date: string): Promise<Activity[]>;
  getActivitiesByUserAndDateRange(userId: number, startDate: string, endDate: string): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  updateActivity(id: number, activity: Partial<InsertActivity>): Promise<Activity | undefined>;
  deleteActivity(id: number): Promise<boolean>;

  // Badges
  getBadgesByUser(userId: number): Promise<Badge[]>;
  createBadge(badge: InsertBadge): Promise<Badge>;
  
  // Streaks
  getStreakByUser(userId: number): Promise<Streak | undefined>;
  updateStreak(userId: number, streak: Partial<InsertStreak>): Promise<Streak>;
}

class MemStorage implements IStorage {
  private users: User[] = [];
  private activities: Activity[] = [];
  private badges: Badge[] = [];
  private streaks: Streak[] = [];
  private nextUserId = 1;
  private nextActivityId = 1;
  private nextBadgeId = 1;
  private nextStreakId = 1;

  constructor() {
    this.initializeFamilyMembers();
  }

  private initializeFamilyMembers() {
    FAMILY_MEMBERS.forEach((member) => {
      const user: User = {
        id: this.nextUserId++,
        username: member.toLowerCase(),
        password: "password123"
      };
      this.users.push(user);
      
      // Initialize streak
      const streak: Streak = {
        id: this.nextStreakId++,
        userId: user.id,
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: null
      };
      this.streaks.push(streak);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.nextUserId++,
      ...insertUser
    };
    this.users.push(user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return [...this.users];
  }

  async getActivitiesByUser(userId: number): Promise<Activity[]> {
    return this.activities.filter(activity => activity.userId === userId);
  }

  async getActivitiesByUserAndDate(userId: number, date: string): Promise<Activity[]> {
    return this.activities.filter(activity => 
      activity.userId === userId && activity.date === date
    );
  }

  async getActivitiesByUserAndDateRange(userId: number, startDate: string, endDate: string): Promise<Activity[]> {
    return this.activities.filter(activity => 
      activity.userId === userId && 
      activity.date >= startDate && 
      activity.date <= endDate
    );
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const activity: Activity = {
      id: this.nextActivityId++,
      createdAt: new Date(),
      ...insertActivity
    };
    this.activities.push(activity);
    return activity;
  }

  async updateActivity(id: number, updateData: Partial<InsertActivity>): Promise<Activity | undefined> {
    const index = this.activities.findIndex(activity => activity.id === id);
    if (index === -1) return undefined;
    
    this.activities[index] = { ...this.activities[index], ...updateData };
    return this.activities[index];
  }

  async deleteActivity(id: number): Promise<boolean> {
    const index = this.activities.findIndex(activity => activity.id === id);
    if (index === -1) return false;
    
    this.activities.splice(index, 1);
    return true;
  }

  async getBadgesByUser(userId: number): Promise<Badge[]> {
    return this.badges.filter(badge => badge.userId === userId);
  }

  async createBadge(insertBadge: InsertBadge): Promise<Badge> {
    const badge: Badge = {
      id: this.nextBadgeId++,
      earnedAt: new Date(),
      ...insertBadge
    };
    this.badges.push(badge);
    return badge;
  }

  async getStreakByUser(userId: number): Promise<Streak | undefined> {
    return this.streaks.find(streak => streak.userId === userId);
  }

  async updateStreak(userId: number, streakData: Partial<InsertStreak>): Promise<Streak> {
    const index = this.streaks.findIndex(streak => streak.userId === userId);
    
    if (index !== -1) {
      this.streaks[index] = { ...this.streaks[index], ...streakData };
      return this.streaks[index];
    } else {
      const streak: Streak = {
        id: this.nextStreakId++,
        userId,
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: null,
        ...streakData
      };
      this.streaks.push(streak);
      return streak;
    }
  }
}

// Database storage implementation

class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getActivitiesByUser(userId: number): Promise<Activity[]> {
    return await db.select().from(activities).where(eq(activities.userId, userId));
  }

  async getActivitiesByUserAndDate(userId: number, date: string): Promise<Activity[]> {
    return await db.select().from(activities).where(
      and(eq(activities.userId, userId), eq(activities.date, date))
    );
  }

  async getActivitiesByUserAndDateRange(userId: number, startDate: string, endDate: string): Promise<Activity[]> {
    return await db.select().from(activities).where(
      and(
        eq(activities.userId, userId),
        gte(activities.date, startDate),
        lte(activities.date, endDate)
      )
    );
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [newActivity] = await db.insert(activities).values(activity).returning();
    return newActivity;
  }

  async updateActivity(id: number, activity: Partial<InsertActivity>): Promise<Activity | undefined> {
    const [updatedActivity] = await db.update(activities)
      .set(activity)
      .where(eq(activities.id, id))
      .returning();
    return updatedActivity || undefined;
  }

  async deleteActivity(id: number): Promise<boolean> {
    const result = await db.delete(activities).where(eq(activities.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getBadgesByUser(userId: number): Promise<Badge[]> {
    return await db.select().from(badges).where(eq(badges.userId, userId));
  }

  async createBadge(badge: InsertBadge): Promise<Badge> {
    const [newBadge] = await db.insert(badges).values(badge).returning();
    return newBadge;
  }

  async getStreakByUser(userId: number): Promise<Streak | undefined> {
    const [streak] = await db.select().from(streaks).where(eq(streaks.userId, userId));
    return streak || undefined;
  }

  async updateStreak(userId: number, streakData: Partial<InsertStreak>): Promise<Streak> {
    const existingStreak = await this.getStreakByUser(userId);
    
    if (existingStreak) {
      const [updatedStreak] = await db.update(streaks)
        .set(streakData)
        .where(eq(streaks.userId, userId))
        .returning();
      return updatedStreak;
    } else {
      const newStreak: InsertStreak = {
        userId,
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: null,
        ...streakData
      };
      const [createdStreak] = await db.insert(streaks).values(newStreak).returning();
      return createdStreak;
    }
  }
}

export const storage = new DatabaseStorage();