import { useState, useEffect } from "react";
import { useParams } from "wouter";
import NavigationHeader from "@/components/navigation-header";
import QuickStats from "@/components/quick-stats";
import ActivityCategories from "@/components/activity-categories";
import WeeklyOverview from "@/components/weekly-overview";
import FamilyProgress from "@/components/family-progress";
import RecentBadges from "@/components/recent-badges";
import AchievementsGallery from "@/components/achievements-gallery";
import ActivityModal from "@/components/activity-modal";
import ActivityHistory from "@/components/activity-history";
import MobileNavigation from "@/components/mobile-navigation";
import FamilyMemberSelector from "@/components/family-member-selector";
import NotificationAdmin from "@/components/notification-admin";
import NativeNotificationAdmin from "@/components/native-notification-admin";
import { useNotifications } from "@/hooks/use-notifications";
import { useCapacitorNotifications } from "@/hooks/use-capacitor-notifications";

import { DeleteConfirmation } from "@/components/delete-confirmation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { FamilyMember, CategoryKey } from "@shared/schema";
import { getTodayDateString } from "@/lib/date-utils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getStoredFamilyMember, storeFamilyMember, hasStoredFamilyMember, clearStoredFamilyMember } from "@/lib/storage";

export default function Dashboard() {
  const { member } = useParams<{ member?: string }>();
  const { toast } = useToast();
  
  // Connect to real-time notifications (web version)
  useNotifications();
  
  // Check if running as native app
  const { isNative } = useCapacitorNotifications();
  
  // All hooks must be declared before any early returns
  const [showSelector, setShowSelector] = useState(false);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | "family" | null>(null);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<any>(null);
  const [preselectedCategory, setPreselectedCategory] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [historyCategory, setHistoryCategory] = useState<CategoryKey | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return getTodayDateString();
  });

  // Initialize selected member from URL params, localStorage, or show selector
  useEffect(() => {
    if (member && member !== "family") {
      // URL parameter takes precedence
      setSelectedMember(member as FamilyMember);
      storeFamilyMember(member as FamilyMember);
    } else if (hasStoredFamilyMember()) {
      // Use stored member
      const stored = getStoredFamilyMember();
      if (stored) {
        setSelectedMember(stored);
      }
    } else {
      // First time user - show selector
      setShowSelector(true);
    }
  }, [member]);

  const handleMemberSelect = (member: FamilyMember) => {
    setSelectedMember(member);
    storeFamilyMember(member);
    setShowSelector(false);
  };

  const handleMemberChange = (member: FamilyMember | "family") => {
    setSelectedMember(member);
    if (member !== "family") {
      storeFamilyMember(member);
    }
  };

  // Show selector if no member is selected
  if (showSelector || selectedMember === null) {
    return <FamilyMemberSelector onSelect={handleMemberSelect} />;
  }

  const handleOpenModal = (activity?: any, preselectedCategory?: string) => {
    setEditingActivity(activity || null);
    setPreselectedCategory(preselectedCategory || null);
    setIsActivityModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsActivityModalOpen(false);
    setEditingActivity(null);
    setPreselectedCategory(null);
  };

  const handleDeleteActivity = async (activity: any) => {
    try {
      await apiRequest("DELETE", `/api/activities/${activity.id}`);
      // Force refresh all related data
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      if (selectedMember && selectedMember !== "family") {
        const userId = selectedMember === "Andrea" ? 1 : selectedMember === "Sasha" ? 2 : selectedMember === "Matti" ? 3 : 4;
        queryClient.invalidateQueries({ queryKey: ["/api/users", userId, "week"] });
        queryClient.invalidateQueries({ queryKey: ["/api/users", userId, "stats"] });
        queryClient.invalidateQueries({ queryKey: ["/api/users", userId, "activities"] });
      }
      toast({ title: "Activity deleted successfully!" });
    } catch (error) {
      console.error("Delete error:", error);
      toast({ 
        title: "Error deleting activity", 
        description: "Please try again.",
        variant: "destructive" 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader 
        selectedMember={selectedMember}
        onMemberChange={handleMemberChange}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 sm:pb-6">
        {selectedMember !== "family" && (
          <>
            <QuickStats memberName={selectedMember} selectedDate={selectedDate} />
            <WeeklyOverview 
              memberName={selectedMember} 
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
            <ActivityCategories 
              memberName={selectedMember} 
              selectedDate={selectedDate}
              onEditActivity={handleOpenModal}
              onAddActivity={(category) => handleOpenModal(null, category)}
              onShowHistory={(category) => {
                setHistoryCategory(category);
                setShowHistory(true);
              }}
              onDeleteActivity={handleDeleteActivity}
            />
          </>
        )}
        
        <FamilyProgress 
          currentMember={selectedMember} 
          onAddActivity={(member, category, date) => {
            // Change selected member to the clicked member
            setSelectedMember(member);
            // Set the date if provided
            if (date) {
              setSelectedDate(date);
            }
            // Open modal with preselected category
            handleOpenModal(null, category);
          }}
        />
        <RecentBadges memberName={selectedMember !== "family" ? selectedMember : undefined} />
        
        {/* Show notification admin only for family view or vlad */}
        {(selectedMember === "family" || selectedMember === "Vlad") && (
          <div className="mt-8 space-y-4">
            {isNative ? (
              <NativeNotificationAdmin />
            ) : (
              <NotificationAdmin />
            )}
          </div>
        )}
        
        <AchievementsGallery memberName={selectedMember !== "family" ? selectedMember : undefined} />
      </div>

      {/* Floating Action Button */}
      {selectedMember !== "family" && (
        <Button
          onClick={() => handleOpenModal(null, undefined)}
          className="fixed bottom-20 sm:bottom-6 right-6 w-14 h-14 rounded-full shadow-lg hover:shadow-xl z-40"
          size="icon"
        >
          <Plus className="h-6 w-6" />
          <span className="sr-only">Quick add activity</span>
        </Button>
      )}

      <MobileNavigation 
        selectedMember={selectedMember}
        onMemberChange={handleMemberChange}
      />

      <ActivityModal
        open={isActivityModalOpen}
        onClose={handleCloseModal}
        memberName={selectedMember !== "family" ? selectedMember : "Andrea"}
        editingActivity={editingActivity}
        preselectedCategory={preselectedCategory}
        defaultDate={selectedDate}
      />

      {showHistory && selectedMember !== "family" && (
        <ActivityHistory
          memberName={selectedMember}
          category={historyCategory}
          onClose={() => setShowHistory(false)}
          onEditActivity={handleOpenModal}
        />
      )}
    </div>
  );
}
