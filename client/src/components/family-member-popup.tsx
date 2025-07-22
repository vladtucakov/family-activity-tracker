import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { CATEGORIES, type FamilyMember, type CategoryKey } from "@shared/schema";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatDisplayDate, getTodayDateString } from "@/lib/date-utils";
import { useToast } from "@/hooks/use-toast";

interface FamilyMemberPopupProps {
  open: boolean;
  onClose: () => void;
  memberName: FamilyMember;
  onAddActivity: (member: FamilyMember, category: CategoryKey, date: string) => void;
}

export default function FamilyMemberPopup({
  open,
  onClose,
  memberName,
  onAddActivity
}: FamilyMemberPopupProps) {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentWeekStart, setCurrentWeekStart] = useState<string>("");

  // Initialize current week start (Monday)
  useEffect(() => {
    if (open) {
      // Get today in Pacific Time
      const now = new Date();
      const pacificTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Los_Angeles"}));
      const dayOfWeek = pacificTime.getDay(); // 0 = Sunday, 1 = Monday, etc.
      
      // Create a new date object using the Pacific time components to avoid timezone issues
      const monday = new Date(pacificTime.getFullYear(), pacificTime.getMonth(), pacificTime.getDate());
      if (dayOfWeek === 0) {
        // Sunday: go back 6 days to get to the Monday that started this week
        monday.setDate(monday.getDate() - 6);
      } else {
        // Any other day: go back to the most recent Monday
        monday.setDate(monday.getDate() - (dayOfWeek - 1));
      }
      
      // Format as YYYY-MM-DD string manually to avoid timezone conversion
      const mondayString = monday.getFullYear() + '-' + 
        String(monday.getMonth() + 1).padStart(2, '0') + '-' + 
        String(monday.getDate()).padStart(2, '0');
      setCurrentWeekStart(mondayString);
    }
  }, [open]);

  // Get user data
  const { data: user } = useQuery({
    queryKey: ['/api/users', memberName.toLowerCase()],
    enabled: open
  });

  // Get week activities - using activities endpoint instead of week endpoint
  const { data: weekData = [] } = useQuery({
    queryKey: ['/api/users', (user as any)?.id, 'activities'],
    enabled: open && !!(user as any)?.id
  });

  // Generate visible dates using string manipulation to avoid timezone issues
  const getVisibleDates = () => {
    if (!currentWeekStart) return [];
    
    const dates = [];
    const daysToShow = isMobile ? 3 : 7;
    
    // Parse the date manually to avoid timezone conversion issues
    const [year, month, day] = currentWeekStart.split('-').map(Number);
    
    for (let i = 0; i < daysToShow; i++) {
      const currentDate = new Date(year, month - 1, day + i); // month is 0-indexed
      const dateString = currentDate.getFullYear() + '-' + 
        String(currentDate.getMonth() + 1).padStart(2, '0') + '-' + 
        String(currentDate.getDate()).padStart(2, '0');
      dates.push(dateString);
    }
    
    return dates;
  };

  const visibleDates = getVisibleDates();
  
  // Get today in Pacific Time for comparison
  const now = new Date();
  const pacificTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Los_Angeles"}));
  const year = pacificTime.getFullYear();
  const month = String(pacificTime.getMonth() + 1).padStart(2, '0');
  const day = String(pacificTime.getDate()).padStart(2, '0');
  const today = `${year}-${month}-${day}`;

  // Navigation functions using proper date handling
  const navigatePrevious = () => {
    const [year, month, day] = currentWeekStart.split('-').map(Number);
    const startDate = new Date(year, month - 1, day); // month is 0-indexed
    const daysToMove = isMobile ? 3 : 7;
    startDate.setDate(startDate.getDate() - daysToMove);
    
    const newDateString = startDate.getFullYear() + '-' + 
      String(startDate.getMonth() + 1).padStart(2, '0') + '-' + 
      String(startDate.getDate()).padStart(2, '0');
    setCurrentWeekStart(newDateString);
  };

  const navigateNext = () => {
    const [year, month, day] = currentWeekStart.split('-').map(Number);
    const startDate = new Date(year, month - 1, day); // month is 0-indexed
    const daysToMove = isMobile ? 3 : 7;
    startDate.setDate(startDate.getDate() + daysToMove);
    
    const newDateString = startDate.getFullYear() + '-' + 
      String(startDate.getMonth() + 1).padStart(2, '0') + '-' + 
      String(startDate.getDate()).padStart(2, '0');
    setCurrentWeekStart(newDateString);
  };

  // Get activities for a specific date
  const getActivitiesForDate = (date: string) => {
    if (!weekData || !Array.isArray(weekData)) return [];
    // weekData contains activities array directly from the API
    return (weekData as any[]).filter((activity: any) => activity.date === date) || [];
  };

  // Get missing categories for a date
  const getMissingCategories = (date: string) => {
    const activities = getActivitiesForDate(date);
    const presentCategories = new Set(activities.map((a: any) => a.category));
    return Object.keys(CATEGORIES).filter(cat => !presentCategories.has(cat)) as CategoryKey[];
  };

  // Simplified styling without colors
  const getCategoryStyles = () => {
    return { bg: 'bg-gray-50', border: 'border-gray-300' };
  };

  // Simplified button styling without colors
  const getButtonProps = () => {
    return { 
      className: 'w-full justify-start h-7 text-xs border-dashed border-gray-300 border px-2 py-1 text-gray-600 hover:text-gray-700 hover:bg-gray-50 transition-colors'
    };
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 md:max-h-[80vh]">
        {/* Fixed Header */}
        <div className="flex-shrink-0 p-6 pb-4 border-b">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-semibold">
              {memberName}'s Activities
            </DialogTitle>
          </DialogHeader>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={navigatePrevious}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              {isMobile ? '3 days' : 'Week'}
            </Button>
            
            <div className="text-sm text-gray-500 text-center flex-1 px-4">
              {visibleDates.length > 0 && (
                <>
                  {new Date(visibleDates[0] + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} - {new Date(visibleDates[visibleDates.length - 1] + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </>
              )}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={navigateNext}
              className="flex items-center gap-2"
            >
              {isMobile ? '3 days' : 'Week'}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto overscroll-contain p-6 pt-4" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="grid gap-4 min-w-max" style={{ gridTemplateColumns: `repeat(${visibleDates.length}, ${isMobile ? '280px' : '1fr'})` }}>

            {visibleDates.map(date => (
              <div key={date} className="border rounded-lg p-4 min-h-[200px]">
                {/* Date Header */}
                <div className={`text-center mb-3 pb-2 border-b ${
                  date === today ? 'bg-blue-50' : ''
                }`}>
                  <div className="font-medium text-sm">
                    {new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className={`text-xs ${date === today ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                    {new Date(date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>

                {/* Activities in Fixed Order */}
                <div className="space-y-2">
                  {(["household", "health", "creative", "learning", "helping", "play"] as CategoryKey[]).map(category => {
                    const dayActivities = getActivitiesForDate(date);
                    const categoryActivities = dayActivities.filter((act: any) => act.category === category);
                    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
                    
                    if (categoryActivities.length > 0) {
                      // Show all activities for this category with single header
                      const styles = getCategoryStyles();
                      return (
                        <div
                          key={`${category}-activities`}
                          className={`p-2 rounded text-xs border-l-2 ${styles.border} ${styles.bg}`}
                        >
                          <div className="font-semibold mb-1">{categoryName}</div>
                          <div className="text-gray-600 space-y-1">
                            {categoryActivities.map((activity: any) => (
                              <div key={`${category}-${activity.id}`} className="flex items-start">
                                <span className="mr-2 mt-0.5 text-gray-400">•</span>
                                <span className="truncate">{activity.description}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    } else {
                      // Show add button for missing category
                      return (
                        <Button
                          key={`${category}-missing`}
                          variant="ghost"
                          size="sm"
                          {...getButtonProps()}
                          onClick={() => onAddActivity(memberName, category, date)}
                        >
                          <Plus className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate font-semibold">{categoryName}</span>
                        </Button>
                      );
                    }
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}