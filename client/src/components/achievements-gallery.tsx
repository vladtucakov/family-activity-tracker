import { Star, Flame, Heart, Palette, Trophy, Zap, Target, Calendar, Award, Crown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import type { FamilyMember } from "@shared/schema";

interface AchievementsGalleryProps {
  memberName?: FamilyMember;
}

const allAchievements = {
  // Implemented achievements
  week_warrior: {
    name: "Week Warrior",
    description: "Complete activities for 7 consecutive days",
    icon: Flame,
    gradient: "from-orange-500 to-red-600",
    difficulty: "Medium",
    category: "Streaks",
    implemented: true
  },
  all_rounder: {
    name: "All-Rounder",
    description: "Complete all 6 categories in a single day",
    icon: Star,
    gradient: "from-blue-500 to-purple-600",
    difficulty: "Hard",
    category: "Daily",
    implemented: true
  },
  
  // Ready to implement
  helper_hero: {
    name: "Helper Hero",
    description: "Complete 5 helping activities",
    icon: Heart,
    gradient: "from-pink-500 to-rose-600",
    difficulty: "Easy",
    category: "Category Focus",
    implemented: false
  },
  creative_genius: {
    name: "Creative Genius",
    description: "Creative activities for 5 consecutive days",
    icon: Palette,
    gradient: "from-purple-500 to-pink-600",
    difficulty: "Medium",
    category: "Streaks",
    implemented: false
  },
  
  // Future achievements ideas
  household_hero: {
    name: "Household Hero",
    description: "Complete 10 household activities",
    icon: Trophy,
    gradient: "from-yellow-500 to-orange-600",
    difficulty: "Easy",
    category: "Category Focus",
    implemented: false
  },
  health_champion: {
    name: "Health Champion",
    description: "Health activities for 7 consecutive days",
    icon: Zap,
    gradient: "from-green-500 to-emerald-600",
    difficulty: "Medium",
    category: "Streaks",
    implemented: false
  },
  learning_legend: {
    name: "Learning Legend",
    description: "Complete 15 learning activities",
    icon: Target,
    gradient: "from-indigo-500 to-blue-600",
    difficulty: "Medium",
    category: "Category Focus",
    implemented: false
  },
  month_master: {
    name: "Month Master",
    description: "Complete activities for 30 days",
    icon: Calendar,
    gradient: "from-violet-500 to-purple-700",
    difficulty: "Very Hard",
    category: "Streaks",
    implemented: false
  },
  perfectionist: {
    name: "Perfectionist",
    description: "All 6 categories for 3 consecutive days",
    icon: Award,
    gradient: "from-amber-500 to-yellow-600",
    difficulty: "Very Hard",
    category: "Daily",
    implemented: false
  },
  family_champion: {
    name: "Family Champion",
    description: "Most activities in the family for a week",
    icon: Crown,
    gradient: "from-red-500 to-pink-600",
    difficulty: "Hard",
    category: "Competition",
    implemented: false
  }
};

const difficultyColors = {
  "Easy": "bg-green-100 text-green-800",
  "Medium": "bg-yellow-100 text-yellow-800", 
  "Hard": "bg-orange-100 text-orange-800",
  "Very Hard": "bg-red-100 text-red-800"
};

export default function AchievementsGallery({ memberName }: AchievementsGalleryProps) {
  const { data: user } = useQuery({
    queryKey: ["/api/users", memberName?.toLowerCase()],
    enabled: !!memberName,
  });

  const { data: earnedBadges = [] } = useQuery({
    queryKey: ["/api/users", user?.id, "badges"],
    enabled: !!user?.id,
  });

  const earnedBadgeTypes = new Set(earnedBadges.map((badge: any) => badge.badgeType));

  const groupedAchievements = Object.entries(allAchievements).reduce((acc, [key, achievement]) => {
    const category = achievement.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push({ key, ...achievement });
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Achievement Gallery</h2>
        <p className="text-gray-600">Unlock badges by completing activities and maintaining streaks</p>
        <div className="flex justify-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Earned</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <span className="text-sm text-gray-600">Coming Soon</span>
          </div>
        </div>
      </div>

      {Object.entries(groupedAchievements).map(([category, achievements]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
            {category} Achievements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => {
              const isEarned = earnedBadgeTypes.has(achievement.key);
              const isAvailable = achievement.implemented;
              const Icon = achievement.icon;
              
              return (
                <Card key={achievement.key} className={`p-6 transition-all duration-200 ${
                  isEarned 
                    ? 'ring-2 ring-green-500 bg-green-50' 
                    : isAvailable 
                      ? 'hover:shadow-lg cursor-pointer border-blue-200' 
                      : 'opacity-60 bg-gray-50'
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${achievement.gradient} rounded-full flex items-center justify-center ${
                      isEarned ? 'animate-pulse' : ''
                    }`}>
                      <Icon className="text-white h-6 w-6" />
                    </div>
                    <div className="flex flex-col gap-2">
                      {isEarned && (
                        <Badge className="bg-green-500 hover:bg-green-500 text-xs">
                          Earned
                        </Badge>
                      )}
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${difficultyColors[achievement.difficulty as keyof typeof difficultyColors]}`}
                      >
                        {achievement.difficulty}
                      </Badge>
                    </div>
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {achievement.name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {achievement.description}
                  </p>
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className={`px-2 py-1 rounded-full ${
                      isAvailable ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {isAvailable ? 'Available Now' : 'Coming Soon'}
                    </span>
                    {isEarned && (
                      <span className="text-green-600 font-medium">
                        ✓ Unlocked
                      </span>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
      
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">More Achievements Coming!</h3>
        <p className="text-gray-600 text-sm">
          We're constantly adding new challenges and rewards. Keep completing activities to unlock them all!
        </p>
      </div>
    </div>
  );
}