import { users, activities, badges, streaks, type User, type InsertUser, type Activity, type InsertActivity, type Badge, type InsertBadge, type Streak, type InsertStreak, FAMILY_MEMBERS } from "@shared/schema";
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

export class DatabaseStorage implements IStorage {
  constructor() {
    this.initializeFamilyMembers();
  }

  private async initializeFamilyMembers() {
    try {
      for (const member of FAMILY_MEMBERS) {
        // Check if user already exists
        const existingUser = await this.getUserByUsername(member.toLowerCase());
        if (!existingUser) {
          const user = await this.createUser({
            username: member.toLowerCase(),
            password: "password123"
          });
          
          // Initialize empty streak for each user
          const streak: InsertStreak = {
            userId: user.id,
            currentStreak: 0,
            longestStreak: 0,
            lastActivityDate: null
          };
          await this.updateStreak(user.id, streak);
        }
      }
    } catch (error) {
      console.error("Error initializing family members:", error);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
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

  // Alias for notification service
  async getUserActivities(userId: number, startDate: string, endDate: string): Promise<Activity[]> {
    return this.getActivitiesByUserAndDateRange(userId, startDate, endDate);
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const [activity] = await db
      .insert(activities)
      .values(insertActivity)
      .returning();
    
    // Update streak
    await this.updateUserStreak(insertActivity.userId, insertActivity.date);
    
    return activity;
  }

  async updateActivity(id: number, updateData: Partial<InsertActivity>): Promise<Activity | undefined> {
    const [updatedActivity] = await db
      .update(activities)
      .set(updateData)
      .where(eq(activities.id, id))
      .returning();
    return updatedActivity || undefined;
  }

  async deleteActivity(id: number): Promise<boolean> {
    const result = await db.delete(activities).where(eq(activities.id, id));
    return result.rowCount > 0;
  }

  async getBadgesByUser(userId: number): Promise<Badge[]> {
    return await db.select().from(badges).where(eq(badges.userId, userId));
  }

  async createBadge(insertBadge: InsertBadge): Promise<Badge> {
    const [badge] = await db
      .insert(badges)
      .values(insertBadge)
      .returning();
    return badge;
  }

  async getStreakByUser(userId: number): Promise<Streak | undefined> {
    const [streak] = await db.select().from(streaks).where(eq(streaks.userId, userId));
    return streak || undefined;
  }

  async updateStreak(userId: number, streakData: Partial<InsertStreak>): Promise<Streak> {
    const existingStreak = await this.getStreakByUser(userId);
    
    if (existingStreak) {
      const [updatedStreak] = await db
        .update(streaks)
        .set(streakData)
        .where(eq(streaks.userId, userId))
        .returning();
      return updatedStreak;
    } else {
      const [newStreak] = await db
        .insert(streaks)
        .values({
          userId,
          currentStreak: 0,
          longestStreak: 0,
          lastActivityDate: null,
          ...streakData
        })
        .returning();
      return newStreak;
    }
  }

  private async updateUserStreak(userId: number, activityDate: string) {
    const streak = await this.getStreakByUser(userId);
    
    if (!streak) {
      await this.updateStreak(userId, {
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: activityDate
      });
      return;
    }

    const lastDate = streak.lastActivityDate;
    
    // Don't update streak if we already have an activity for this date
    if (lastDate === activityDate) {
      return;
    }

    // Calculate the previous day from the activity date
    const activityDateTime = new Date(activityDate + 'T00:00:00.000Z');
    const previousDay = new Date(activityDateTime);
    previousDay.setDate(previousDay.getDate() - 1);
    const previousDayStr = previousDay.toISOString().split('T')[0];

    if (lastDate === previousDayStr) {
      // Continue streak - activity is on consecutive day
      const newStreak = (streak.currentStreak || 0) + 1;
      await this.updateStreak(userId, {
        currentStreak: newStreak,
        longestStreak: Math.max(streak.longestStreak || 0, newStreak),
        lastActivityDate: activityDate
      });
    } else {
      // Start new streak - there's a gap or this is the first activity
      await this.updateStreak(userId, {
        currentStreak: 1,
        longestStreak: Math.max(streak.longestStreak || 0, 1),
        lastActivityDate: activityDate
      });
    }
  }
}

export const storage = new DatabaseStorage();
