import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FAMILY_MEMBERS, type FamilyMember } from "@shared/schema";

interface FamilyMemberSelectorProps {
  onSelect: (member: FamilyMember) => void;
}

export default function FamilyMemberSelector({ onSelect }: FamilyMemberSelectorProps) {
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);

  const handleMemberClick = (member: FamilyMember) => {
    setSelectedMember(member);
  };

  const handleConfirm = () => {
    if (selectedMember) {
      onSelect(selectedMember);
    }
  };

  const getMemberInitials = (name: FamilyMember) => {
    return name.slice(0, 2).toUpperCase();
  };

  const getMemberColor = (name: FamilyMember) => {
    const colors = {
      "Andrea": "bg-blue-500",
      "Sasha": "bg-green-500", 
      "Matti": "bg-purple-500",
      "Vlad": "bg-orange-500"
    };
    return colors[name] || "bg-gray-500";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to Family Activities</CardTitle>
          <CardDescription>
            Select your profile to get started tracking your daily activities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {FAMILY_MEMBERS.map((member) => (
              <button
                key={member}
                onClick={() => handleMemberClick(member)}
                className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                  selectedMember === member
                    ? "border-primary bg-primary/10"
                    : "border-muted hover:border-primary/50"
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <Avatar className={`w-12 h-12 ${getMemberColor(member)}`}>
                    <AvatarFallback className="text-white font-semibold">
                      {getMemberInitials(member)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{member}</span>
                </div>
              </button>
            ))}
          </div>
          
          <Button 
            onClick={handleConfirm}
            disabled={!selectedMember}
            className="w-full"
            size="lg"
          >
            Continue as {selectedMember || "..."}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}