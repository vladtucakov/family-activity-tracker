import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DeleteConfirmation } from "@/components/delete-confirmation";
import { 
  Home, 
  Leaf, 
  Palette, 
  Book, 
  Heart, 
  Gamepad2, 
  Edit, 
  Plus,
  Check,
  Trash2
} from "lucide-react";
import { CATEGORIES, type FamilyMember, type CategoryKey } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { isToday, formatDisplayDate } from "@/lib/date-utils";

interface ActivityCategoriesProps {
  memberName: FamilyMember;
  selectedDate: string;
  onEditActivity: (activity?: any) => void;
  onAddActivity: (category?: CategoryKey) => void;
  onShowHistory: (category: CategoryKey) => void;
  onDeleteActivity: (activity: any) => void;
}

const categoryIcons: Record<CategoryKey, any> = {
  household: Home,
  health: Leaf,
  creative: Palette,
  learning: Book,
  helping: Heart,
  play: Gamepad2,
};

const categoryColors: Record<CategoryKey, string> = {
  household: "blue",
  health: "green",
  creative: "purple",
  learning: "indigo",
  helping: "orange",
  play: "pink",
};

export default function ActivityCategories({ 
  memberName, 
  selectedDate,
  onEditActivity, 
  onAddActivity,
  onShowHistory,
  onDeleteActivity
}: ActivityCategoriesProps) {
  const { data: user } = useQuery({
    queryKey: ["/api/users", memberName.toLowerCase()],
  });

  const { data: todayActivities = [], isLoading, refetch } = useQuery({
    queryKey: ["/api/users", user?.id, "activities", selectedDate],
    queryFn: () => apiRequest("GET", `/api/users/${user?.id}/activities?date=${selectedDate}`),
    enabled: !!user?.id,

  });
  




  const todayActivitiesFiltered = todayActivities;

  // Group activities by category
  const activitiesByCategory = todayActivitiesFiltered.reduce((acc: any, activity: any) => {
    if (!acc[activity.category]) {
      acc[activity.category] = [];
    }
    acc[activity.category].push(activity);
    return acc;
  }, {});

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {isToday(selectedDate) ? "Today's Activities" : "Activities"}
        </h2>
        <div className="text-sm text-gray-500">
          {formatDisplayDate(selectedDate)}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(CATEGORIES).map(([key, name]) => {
          const categoryKey = key as CategoryKey;
          const Icon = categoryIcons[categoryKey];
          const color = categoryColors[categoryKey];
          const categoryActivities = activitiesByCategory[categoryKey] || [];
          const hasActivities = categoryActivities.length > 0;

          return (
            <Card 
              key={categoryKey} 
              className={`p-6 hover:shadow-md transition-shadow ${
                !hasActivities ? 'border-dashed border-gray-300' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity flex-1"
                  onClick={() => onAddActivity(categoryKey)}
                >
                  <div className={`w-10 h-10 bg-${color}-100 rounded-full flex items-center justify-center`}>
                    <Icon className={`text-${color}-600 h-5 w-5`} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {name.split(' ')[0]}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {name.split(' ').slice(1).join(' ')}
                    </p>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  hasActivities 
                    ? 'bg-secondary' 
                    : 'bg-gray-200'
                }`}>
                  {hasActivities ? (
                    <span className="text-white text-xs font-bold">{categoryActivities.length}</span>
                  ) : (
                    <Plus className="text-gray-400 h-4 w-4" />
                  )}
                </div>
              </div>
              
              <div className="mb-4">
                <Progress 
                  value={hasActivities ? 100 : 0} 
                  className="h-2"
                />
              </div>
              
              <div className="space-y-2">
                {hasActivities ? (
                  <>
                    <div className="space-y-1 max-h-20 overflow-y-auto">
                      {categoryActivities.map((activity: any, index: number) => (
                        <div key={activity.id} className="flex items-start space-x-2">
                          <span className="text-green-600 font-bold text-sm mt-0.5">•</span>
                          <p className="text-sm text-gray-700 line-clamp-1 flex-1">
                            {activity.description}
                          </p>
                          <DeleteConfirmation onConfirm={() => onDeleteActivity(activity)}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-auto ml-2"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </DeleteConfirmation>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between pt-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onAddActivity(categoryKey)}
                        className="text-primary hover:text-primary p-0 h-auto font-medium"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add more
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onShowHistory(categoryKey)}
                        className="text-gray-500 hover:text-gray-700 p-0 h-auto font-medium text-xs"
                      >
                        View history
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-400 italic">
                      Click to add your {name.toLowerCase()} activity...
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onAddActivity(categoryKey)}
                      className="text-primary hover:text-primary p-0 h-auto font-medium"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add entry
                    </Button>
                  </>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
