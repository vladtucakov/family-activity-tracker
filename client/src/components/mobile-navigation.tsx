import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import type { FamilyMember } from "@shared/schema";

interface MobileNavigationProps {
  selectedMember: FamilyMember | "family";
  onMemberChange: (member: FamilyMember | "family") => void;
}

export default function MobileNavigation({ selectedMember, onMemberChange }: MobileNavigationProps) {
  const handlePersonClick = () => {
    // Cycle through family members
    const members: Array<FamilyMember | "family"> = ["Andrea", "Sasha", "Matti", "Vlad", "family"];
    const currentIndex = members.indexOf(selectedMember);
    const nextIndex = (currentIndex + 1) % members.length;
    onMemberChange(members[nextIndex]);
  };

  return (
    <nav className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-50 sm:hidden">
      <div className="flex justify-center py-2">
        <Button 
          variant="ghost" 
          className="flex flex-col items-center py-2 px-6 text-primary"
          onClick={handlePersonClick}
        >
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">
            {selectedMember === "family" ? "Switch to Member" : selectedMember}
          </span>
        </Button>
      </div>
    </nav>
  );
}
