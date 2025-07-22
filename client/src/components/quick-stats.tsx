import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Check, Flame, Star, TrendingUp } from "lucide-react";
import type { FamilyMember } from "@shared/schema";
import { isToday, formatDisplayDate } from "@/lib/date-utils";

interface QuickStatsProps {
  memberName: FamilyMember;
  selectedDate: string;
}

export default function QuickStats({ memberName, selectedDate }: QuickStatsProps) {
  const { data: user } = useQuery({
    queryKey: ["/api/users", memberName.toLowerCase()],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/users", user?.id, "stats", selectedDate],
    enabled: !!user?.id,
  });

  const { data: streak } = useQuery({
    queryKey: ["/api/users", user?.id, "streak"],
    enabled: !!user?.id,
  });

  // Generate appropriate label based on selected date
  const progressLabel = isToday(selectedDate) ? "Today's Progress" : `${formatDisplayDate(selectedDate)} Progress`;

  return (
    <div className="mb-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{progressLabel}</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.todayProgress || "0/6"}
              </p>
            </div>
            <div className="w-10 h-10 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
              <Check className="text-primary h-5 w-5" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Streak</p>
              <p className="text-2xl font-bold text-secondary">
                {streak?.currentStreak || 0} days
              </p>
            </div>
            <div className="w-10 h-10 bg-secondary bg-opacity-10 rounded-full flex items-center justify-center">
              <Flame className="text-secondary h-5 w-5" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Badges Earned</p>
              <p className="text-2xl font-bold text-accent">
                {stats?.badgesEarned || 0}
              </p>
            </div>
            <div className="w-10 h-10 bg-accent bg-opacity-10 rounded-full flex items-center justify-center">
              <Star className="text-accent h-5 w-5" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Weekly Score</p>
              <p className="text-2xl font-bold text-primary">
                {stats?.weeklyScore || "0%"}
              </p>
            </div>
            <div className="w-10 h-10 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
              <TrendingUp className="text-primary h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
