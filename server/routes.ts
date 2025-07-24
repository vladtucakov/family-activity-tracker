import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertActivitySchema, CATEGORIES } from "@shared/schema";
import { z } from "zod";
import { NotificationService } from "./notification-service";

export async function registerRoutes(app: Express): Promise<Server> {
  // Debug endpoint to test connectivity
  app.get("/api/debug", async (req, res) => {
    res.json({ 
      message: "Family Activity Tracker API is working!",
      timestamp: new Date().toISOString(),
      server: "Replit"
    });
  });

  // Get all family members
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Get user by username
  app.get("/api/users/:username", async (req, res) => {
    try {
      const user = await storage.getUserByUsername(req.params.username);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Get activities for a user
  app.get("/api/users/:userId/activities", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { date, startDate, endDate } = req.query;

      let activities;
      if (date) {
        activities = await storage.getActivitiesByUserAndDate(userId, date as string);
      } else if (startDate && endDate) {
        activities = await storage.getActivitiesByUserAndDateRange(userId, startDate as string, endDate as string);
      } else {
        activities = await storage.getActivitiesByUser(userId);
      }

      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  // Create new activity
  app.post("/api/activities", async (req, res) => {
    try {
      const validatedData = insertActivitySchema.parse(req.body);
      const activity = await storage.createActivity(validatedData);
      
      // Check for badge eligibility
      await checkAndAwardBadges(validatedData.userId, validatedData.date);
      
      res.status(201).json(activity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid activity data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create activity" });
    }
  });

  // Update activity
  app.put("/api/activities/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertActivitySchema.partial().parse(req.body);
      const activity = await storage.updateActivity(id, updateData);
      
      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }
      
      res.json(activity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid activity data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update activity" });
    }
  });

  // Delete activity
  app.delete("/api/activities/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteActivity(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Activity not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete activity" });
    }
  });

  // Get user badges
  app.get("/api/users/:userId/badges", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const badges = await storage.getBadgesByUser(userId);
      res.json(badges);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch badges" });
    }
  });

  // Get user streak
  app.get("/api/users/:userId/streak", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const streak = await storage.getStreakByUser(userId);
      res.json(streak || { currentStreak: 0, longestStreak: 0 });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch streak" });
    }
  });

  // Get dashboard stats for a user
  app.get("/api/users/:userId/stats", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { date } = req.query;
      
      // Use provided date or get today's date in Pacific Time
      let targetDate: string;
      if (date) {
        targetDate = date as string;
      } else {
        const now = new Date();
        const pacificTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Los_Angeles"}));
        const year = pacificTime.getFullYear();
        const month = String(pacificTime.getMonth() + 1).padStart(2, '0');
        const day = String(pacificTime.getDate()).padStart(2, '0');
        targetDate = `${year}-${month}-${day}`;
      }

      // Get activities for the target date
      const todayActivities = await storage.getActivitiesByUserAndDate(userId, targetDate);
      const todayCategories = new Set(todayActivities.map(a => a.category));
      const todayProgress = `${todayCategories.size}/6`;

      // Get user's badges count
      const badges = await storage.getBadgesByUser(userId);
      const badgesEarned = badges.length;

      // Get current streak
      const streak = await storage.getStreakByUser(userId);
      const currentStreak = streak?.currentStreak || 0;

      // Calculate weekly score for current Monday-Sunday week
      const currentDate = new Date(targetDate);
      const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
      
      // Find Monday of the current week
      const monday = new Date(currentDate);
      if (dayOfWeek === 0) {
        // Sunday: go back 6 days to get to the Monday that started this week
        monday.setDate(currentDate.getDate() - 6);
      } else {
        // Any other day: go back to the most recent Monday
        monday.setDate(currentDate.getDate() - (dayOfWeek - 1));
      }
      
      // Find Sunday of the current week
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      
      const weekStartStr = monday.toISOString().split('T')[0];
      const weekEndStr = sunday.toISOString().split('T')[0];
      
      const weekActivities = await storage.getActivitiesByUserAndDateRange(userId, weekStartStr, weekEndStr);
      const weeklyDaysWithActivity = new Set(weekActivities.map(a => a.date)).size;
      const weeklyScore = `${weeklyDaysWithActivity}/7 days`;

      res.json({
        todayProgress,
        currentStreak,
        badgesEarned,
        weeklyScore
      });
    } catch (error) {
      console.error("Stats endpoint error:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Get weekly data for calendar view
  app.get("/api/users/:userId/week", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { startDate } = req.query;
      
      let weekStart: string;
      if (startDate) {
        weekStart = startDate as string;
      } else {
        // Get current week start (Monday) in Pacific Time
        const now = new Date();
        // Convert to Pacific Time
        const pacificTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Los_Angeles"}));
        const dayOfWeek = pacificTime.getDay(); // 0 = Sunday, 1 = Monday, etc.
        
        // For Monday-Sunday weeks: if today is Sunday, we're in the week that started last Monday
        // Otherwise, go back to the most recent Monday
        const monday = new Date(pacificTime);
        if (dayOfWeek === 0) {
          // Sunday: go back 6 days to get to the Monday that started this week
          monday.setDate(pacificTime.getDate() - 6);
        } else {
          const daysToMonday = dayOfWeek - 1; // How many days back to get to Monday
          monday.setDate(pacificTime.getDate() - daysToMonday);
        }
        
        // Format as YYYY-MM-DD
        const year = monday.getFullYear();
        const month = String(monday.getMonth() + 1).padStart(2, '0');
        const day = String(monday.getDate()).padStart(2, '0');
        weekStart = `${year}-${month}-${day}`;
      }
      
      const sunday = new Date(weekStart + 'T00:00:00');
      sunday.setDate(sunday.getDate() + 6);
      const year = sunday.getFullYear();
      const month = String(sunday.getMonth() + 1).padStart(2, '0');
      const day = String(sunday.getDate()).padStart(2, '0');
      const weekEnd = `${year}-${month}-${day}`;

      const activities = await storage.getActivitiesByUserAndDateRange(userId, weekStart, weekEnd);
      
      // Group by date
      const weekData: { [key: string]: { categories: Set<string>, count: number } } = {};
      
      // Initialize all 7 days
      for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart + 'T00:00:00');
        date.setDate(date.getDate() + i);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        weekData[dateStr] = { categories: new Set(), count: 0 };
      }
      
      activities.forEach(activity => {
        if (!weekData[activity.date]) {
          weekData[activity.date] = { categories: new Set(), count: 0 };
        }
        weekData[activity.date].categories.add(activity.category);
        weekData[activity.date].count = weekData[activity.date].categories.size;
      });

      // Convert Sets to arrays for JSON serialization
      const serializedWeekData: { [key: string]: { categories: any, count: number } } = {};
      Object.keys(weekData).forEach(date => {
        serializedWeekData[date] = {
          categories: Array.from(weekData[date].categories),
          count: weekData[date].count
        };
      });

      res.json(serializedWeekData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch week data" });
    }
  });

  // Delete activity
  app.delete("/api/activities/:id", async (req, res) => {
    try {
      const activityId = parseInt(req.params.id);
      console.log(`Attempting to delete activity with ID: ${activityId}`);
      
      const success = await storage.deleteActivity(activityId);
      console.log(`Delete operation result: ${success}`);
      
      if (success) {
        res.status(200).json({ message: "Activity deleted successfully" });
      } else {
        res.status(404).json({ message: "Activity not found" });
      }
    } catch (error) {
      console.error("Error deleting activity:", error);
      res.status(500).json({ message: "Failed to delete activity" });
    }
  });

  // Server-Sent Events for real-time notifications
  app.get("/api/notifications/stream", (req, res) => {
    // Set up SSE headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    });

    // Generate unique client ID
    const clientId = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Register client with notification client
    const { notificationClient } = require('./notification-client');
    notificationClient.registerClient(clientId, res);

    // Send initial connection message
    res.write(`data: ${JSON.stringify({ type: 'CONNECTED', clientId })}\n\n`);

    // Handle client disconnect
    req.on('close', () => {
      notificationClient.unregisterClient(clientId);
    });
  });

  // Notification testing endpoints
  app.post("/api/notifications/test", async (req, res) => {
    try {
      const notificationService = NotificationService.getInstance();
      await notificationService.testReminders();
      res.json({ message: "Test reminders sent successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to send test reminders" });
    }
  });

  app.get("/api/notifications/status", async (req, res) => {
    try {
      res.json({ 
        message: "Notification service is running",
        scheduledFor: "8:00 PM Pacific Time daily",
        nextCheck: "Reminders sent to family members with < 3 activities"
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get notification status" });
    }
  });

  async function checkAndAwardBadges(userId: number, date: string) {
    // Get today's activities for this user
    const todayActivities = await storage.getActivitiesByUserAndDate(userId, date);
    const categoriesCompleted = new Set(todayActivities.map(a => a.category));
    
    // Check for "All-Rounder" badge (all 6 categories in one day)
    if (categoriesCompleted.size === 6) {
      const existingBadges = await storage.getBadgesByUser(userId);
      const hasAllRounderToday = existingBadges.some(b => 
        b.badgeType === "all_rounder" && 
        b.earnedAt && 
        b.earnedAt.toISOString().split('T')[0] === date
      );
      
      if (!hasAllRounderToday) {
        await storage.createBadge({
          userId,
          badgeType: "all_rounder"
        });
      }
    }

    // Check for streak badges
    const streak = await storage.getStreakByUser(userId);
    if (streak) {
      const existingBadges = await storage.getBadgesByUser(userId);
      
      if (streak.currentStreak === 7) {
        const hasWeekWarrior = existingBadges.some(b => b.badgeType === "week_warrior");
        if (!hasWeekWarrior) {
          await storage.createBadge({
            userId,
            badgeType: "week_warrior"
          });
        }
      }
    }
  }

  const httpServer = createServer(app);
  return httpServer;
}
