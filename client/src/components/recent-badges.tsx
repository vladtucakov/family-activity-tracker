import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Flame, Heart, Star, Palette } from "lucide-react";
import type { FamilyMember } from "@shared/schema";

interface RecentBadgesProps {
  memberName?: FamilyMember;
}

const badgeConfig = {
  week_warrior: {
    name: "Week Warrior",
    description: "7 days complete",
    icon: Flame,
    gradient: "from-accent to-yellow-500",
    animate: "animate-bounce"
  },
  helper_hero: {
    name: "Helper Hero", 
    description: "5 helping activities",
    icon: Heart,
    gradient: "from-secondary to-green-600",
    animate: ""
  },
  all_rounder: {
    name: "All-Rounder",
    description: "All 6 categories in one day", 
    icon: Star,
    gradient: "from-primary to-indigo-600",
    animate: ""
  },
  creative_genius: {
    name: "Creative Genius",
    description: "Creative streak of 5 days",
    icon: Palette,
    gradient: "from-purple-500 to-pink-600", 
    animate: ""
  }
};

export default function RecentBadges({ memberName }: RecentBadgesProps) {
  const { data: user } = useQuery({
    queryKey: ["/api/users", memberName?.toLowerCase()],
    enabled: !!memberName,
  });

  const { data: badges = [] } = useQuery({
    queryKey: ["/api/users", user?.id, "badges"],
    enabled: !!user?.id,
  });

  // Use real badges from database
  const recentBadges = badges.slice(0, 4).map((badge: any) => ({
    type: badge.badgeType,
    earnedDate: new Date(badge.earnedAt).toLocaleDateString()
  }));

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recent Achievements</h2>
        <Button variant="ghost" className="text-primary">
          View All Badges
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
      
      {recentBadges.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {recentBadges.map((badge, index) => {
            const config = badgeConfig[badge.type as keyof typeof badgeConfig];
            if (!config) return null;
            
            const Icon = config.icon;

            return (
              <Card key={index} className="p-4 text-center">
                <div className={`w-16 h-16 bg-gradient-to-br ${config.gradient} rounded-full flex items-center justify-center mx-auto mb-3 ${config.animate}`}>
                  <Icon className="text-white h-8 w-8" />
                </div>
                <h3 className="font-medium text-gray-900 text-sm mb-1">
                  {config.name}
                </h3>
                <p className="text-xs text-gray-500">
                  {config.description}
                </p>
                <div className="text-xs text-gray-400 mt-2">
                  {badge.earnedDate}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">No achievements yet</p>
          <p className="text-sm text-gray-400">Start completing activities to earn badges!</p>
        </Card>
      )}
    </div>
  );
}
