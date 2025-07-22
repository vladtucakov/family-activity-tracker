import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { FamilyMember } from "@shared/schema";
import { getTodayDateString } from "@/lib/date-utils";

interface WeeklyOverviewProps {
  memberName: FamilyMember;
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

export default function WeeklyOverview({ memberName, selectedDate, onDateSelect }: WeeklyOverviewProps) {
  const [weekOffset, setWeekOffset] = useState(0);

  const { data: user } = useQuery({
    queryKey: ["/api/users", memberName.toLowerCase()],
  });

  // Calculate week start based on offset (Monday start)
  const getWeekStart = (offset: number) => {
    const now = new Date();
    const pacificTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Los_Angeles"}));
    const dayOfWeek = pacificTime.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // For Monday-Sunday weeks: if today is Sunday, we're in the week that started last Monday
    // Otherwise, go back to the most recent Monday
    const monday = new Date(pacificTime);
    if (dayOfWeek === 0) {
      // Sunday: go back 6 days to get to the Monday that started this week
      monday.setDate(pacificTime.getDate() - 6 + (offset * 7));
    } else {
      const daysToMonday = dayOfWeek - 1; // How many days back to get to Monday
      monday.setDate(pacificTime.getDate() - daysToMonday + (offset * 7));
    }
    
    // Use same date format as our date utils to avoid timezone issues
    const year = monday.getFullYear();
    const month = String(monday.getMonth() + 1).padStart(2, '0');
    const day = String(monday.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const weekStart = getWeekStart(weekOffset);
  
  const { data: weekData = {} } = useQuery({
    queryKey: ["/api/users", user?.id, "week", weekStart],
    queryFn: async () => {
      const response = await fetch(`/api/users/${user?.id}/week?startDate=${weekStart}`);
      if (!response.ok) throw new Error('Failed to fetch week data');
      return response.json();
    },
    enabled: !!user?.id,
  });

  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    // Parse the date string more explicitly to avoid timezone issues
    const [year, month, day] = weekStart.split('-').map(Number);
    const date = new Date(year, month - 1, day + i); // month is 0-indexed
    weekDays.push(date);
  }


  
  const formatWeekRange = () => {
    const start = new Date(weekStart);
    const end = new Date(weekStart);
    end.setDate(start.getDate() + 6);
    
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}-${end.toLocaleDateString('en-US', { day: 'numeric', year: 'numeric' })}`;
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">This Week's Progress</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setWeekOffset(weekOffset - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-600 px-2">
            {formatWeekRange()}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setWeekOffset(weekOffset + 1)}
            disabled={weekOffset >= 0}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Card className="overflow-hidden">
        <div className="grid grid-cols-7 gap-0">
          {weekDays.map((date, index) => {
            // Use same date format as our date utils to avoid timezone issues
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;
            
            const dayData = weekData[dateStr] || { count: 0 };
            const isToday = dateStr === getTodayDateString();
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const dayNum = date.getDate();
            
            // Create dots for categories completed
            const dots = [];
            for (let i = 0; i < 6; i++) {
              dots.push(
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < dayData.count ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              );
            }

            const isSelected = selectedDate === dateStr;

            return (
              <button
                key={dateStr}
                onClick={() => onDateSelect(dateStr)}
                className={`p-3 text-center border-r border-gray-200 last:border-r-0 w-full hover:bg-gray-100 transition-colors ${
                  isSelected 
                    ? 'bg-blue-100 border-2 border-blue-500' 
                    : isToday 
                      ? 'bg-blue-50 border border-blue-400' 
                      : 'bg-white'
                }`}
              >
                <div className={`text-xs font-medium uppercase mb-1 ${
                  isSelected ? 'text-blue-700' : isToday ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {dayName}
                </div>
                <div className={`text-lg font-semibold mb-2 ${
                  isSelected ? 'text-blue-700' : isToday ? 'text-blue-600' : dayData.count > 0 ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {dayNum}
                </div>
                <div className="flex justify-center space-x-1 mt-2">
                  {dots}
                </div>
                <div className={`text-xs mt-1 ${
                  isSelected ? 'text-blue-700 font-medium' : isToday ? 'text-blue-600 font-medium' : 'text-gray-600'
                }`}>
                  {dayData.count}/6
                </div>
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
