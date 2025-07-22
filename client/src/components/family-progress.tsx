import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Star, Flame, Trophy, Heart, Medal, Leaf, GraduationCap } from "lucide-react";
import { FAMILY_MEMBERS, type FamilyMember, type CategoryKey } from "@shared/schema";
import FamilyMemberPopup from "./family-member-popup";

interface FamilyProgressProps {
  currentMember: FamilyMember | "family";
  onAddActivity?: (member: FamilyMember, category?: CategoryKey, date?: string) => void;
}

const memberColors = {
  Andrea: "primary",
  Sasha: "secondary", 
  Matti: "accent",
  Vlad: "purple"
};

const badgeIcons = {
  star: Star,
  fire: Flame,
  trophy: Trophy,
  heart: Heart,
  medal: Medal,
  leaf: Leaf,
  graduation: GraduationCap
};

export default function FamilyProgress({ currentMember, onAddActivity }: FamilyProgressProps) {
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const { data: users = [] } = useQuery({
    queryKey: ["/api/users"],
  });

  // Get real stats for each family member using individual hooks
  const andreaUser = (users as any[]).find((u: any) => u.username === "andrea");
  const sashaUser = (users as any[]).find((u: any) => u.username === "sasha");
  const mattiUser = (users as any[]).find((u: any) => u.username === "matti");
  const vladUser = (users as any[]).find((u: any) => u.username === "vlad");

  const { data: andreaStats } = useQuery({
    queryKey: ["/api/users", andreaUser?.id, "stats"],
    enabled: !!andreaUser?.id,
  });
  const { data: sashaStats } = useQuery({
    queryKey: ["/api/users", sashaUser?.id, "stats"],
    enabled: !!sashaUser?.id,
  });
  const { data: mattiStats } = useQuery({
    queryKey: ["/api/users", mattiUser?.id, "stats"],
    enabled: !!mattiUser?.id,
  });
  const { data: vladStats } = useQuery({
    queryKey: ["/api/users", vladUser?.id, "stats"],
    enabled: !!vladUser?.id,
  });

  const { data: andreaStreak } = useQuery({
    queryKey: ["/api/users", andreaUser?.id, "streak"],
    enabled: !!andreaUser?.id,
  });
  const { data: sashaStreak } = useQuery({
    queryKey: ["/api/users", sashaUser?.id, "streak"],
    enabled: !!sashaUser?.id,
  });
  const { data: mattiStreak } = useQuery({
    queryKey: ["/api/users", mattiUser?.id, "streak"],
    enabled: !!mattiUser?.id,
  });
  const { data: vladStreak } = useQuery({
    queryKey: ["/api/users", vladUser?.id, "streak"],
    enabled: !!vladUser?.id,
  });

  const { data: andreaBadges = [] } = useQuery({
    queryKey: ["/api/users", andreaUser?.id, "badges"],
    enabled: !!andreaUser?.id,
  });
  const { data: sashaBadges = [] } = useQuery({
    queryKey: ["/api/users", sashaUser?.id, "badges"],
    enabled: !!sashaUser?.id,
  });
  const { data: mattiBadges = [] } = useQuery({
    queryKey: ["/api/users", mattiUser?.id, "badges"],
    enabled: !!mattiUser?.id,
  });
  const { data: vladBadges = [] } = useQuery({
    queryKey: ["/api/users", vladUser?.id, "badges"],
    enabled: !!vladUser?.id,
  });

  const familyData = [
    { memberName: "Andrea" as const, user: andreaUser, stats: andreaStats, streak: andreaStreak, badges: andreaBadges },
    { memberName: "Sasha" as const, user: sashaUser, stats: sashaStats, streak: sashaStreak, badges: sashaBadges },
    { memberName: "Matti" as const, user: mattiUser, stats: mattiStats, streak: mattiStreak, badges: mattiBadges },
    { memberName: "Vlad" as const, user: vladUser, stats: vladStats, streak: vladStreak, badges: vladBadges },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Family Progress</h2>
        <Button variant="ghost" className="text-primary">
          View All
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {familyData.map(({ memberName, user, stats, streak, badges }) => {
          const color = memberColors[memberName as keyof typeof memberColors];
          const initial = memberName[0];
          
          // Extract numeric value from weeklyScore - handle both percentage and fraction formats
          let weeklyScore = 0;
          if ((stats as any)?.weeklyScore) {
            if ((stats as any).weeklyScore.includes('%')) {
              weeklyScore = parseInt((stats as any).weeklyScore.replace('%', ''));
            } else if ((stats as any).weeklyScore.includes('/')) {
              const [numerator, denominator] = (stats as any).weeklyScore.split('/').map((s: string) => parseInt(s.trim()));
              weeklyScore = Math.round((numerator / denominator) * 100);
            }
          }
          const currentStreak = (streak as any)?.currentStreak || 0;

          return (
            <Card 
              key={memberName} 
              className="p-6 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedMember(memberName)}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-12 h-12 bg-${color} bg-opacity-20 rounded-full flex items-center justify-center`}>
                  <span className={`text-lg font-semibold text-${color}`}>
                    {initial}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{memberName}</h3>
                  <p className="text-sm text-gray-500">{currentStreak}-day streak</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">This Week</span>
                  <span className="text-sm font-medium text-gray-900">
                    {(stats as any)?.weeklyScore || '0/7 days'}
                  </span>
                </div>
                <Progress value={weeklyScore} className="h-2" />
                
                <div className="flex justify-center space-x-1 pt-2">
                  {(badges as any[]).length > 0 ? (badges as any[]).slice(0, 3).map((badge: any, index: number) => (
                    <div
                      key={badge.id}
                      className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center"
                    >
                      <Star className="text-white h-3 w-3" />
                    </div>
                  )) : (
                    <span className="text-xs text-gray-400">No badges yet</span>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      
      {/* Family Member Popup */}
      {selectedMember && (
        <FamilyMemberPopup
          open={!!selectedMember}
          onClose={() => setSelectedMember(null)}
          memberName={selectedMember}
          onAddActivity={(member, category, date) => {
            if (onAddActivity) {
              onAddActivity(member, category, date);
            }
            setSelectedMember(null);
          }}
        />
      )}
    </div>
  );
}
