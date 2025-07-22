import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Calendar, Edit } from "lucide-react";
import { CATEGORIES, type FamilyMember, type CategoryKey } from "@shared/schema";
import { format } from "date-fns";

interface ActivityHistoryProps {
  memberName: FamilyMember;
  category?: CategoryKey;
  onClose: () => void;
  onEditActivity: (activity: any) => void;
}

export default function ActivityHistory({ 
  memberName, 
  category, 
  onClose, 
  onEditActivity 
}: ActivityHistoryProps) {
  const { data: user } = useQuery({
    queryKey: ["/api/users", memberName.toLowerCase()],
  });

  const { data: activities = [] } = useQuery({
    queryKey: ["/api/users", user?.id, "activities"],
    enabled: !!user?.id,
  });

  const filteredActivities = category 
    ? activities.filter((activity: any) => activity.category === category)
    : activities;

  // Sort by date descending (newest first)
  const sortedActivities = [...filteredActivities].sort((a: any, b: any) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const categoryName = category ? CATEGORIES[category] : "All Activities";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {memberName}'s {categoryName}
            </h2>
            <p className="text-sm text-gray-500">
              {sortedActivities.length} activities found
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="overflow-y-auto max-h-[60vh]">
          {sortedActivities.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No activities found</p>
              <p className="text-sm">Start logging activities to see them here!</p>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {sortedActivities.map((activity: any) => (
                <Card key={activity.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-primary">
                          {CATEGORIES[activity.category as CategoryKey]}
                        </span>
                        <span className="text-sm text-gray-500">
                          {format(new Date(activity.date), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <p className="text-gray-700">
                        {activity.description}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        onEditActivity(activity);
                        onClose();
                      }}
                      className="text-gray-400 hover:text-primary"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}