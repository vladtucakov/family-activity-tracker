import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FAMILY_MEMBERS, type FamilyMember } from "@shared/schema";

export default function DashboardSimple() {
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);

  const handleMemberSelect = (member: FamilyMember) => {
    setSelectedMember(member);
  };

  if (!selectedMember) {
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
                  onClick={() => setSelectedMember(member)}
                  className="p-4 rounded-lg border-2 transition-all hover:scale-105 border-gray-200 hover:border-primary"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-blue-500 text-white">
                        {member.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{member}</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Welcome, {selectedMember}!</h1>
        <p>Dashboard is working! Your family activity tracker is ready.</p>
        <Button onClick={() => setSelectedMember(null)} className="mt-4">
          Switch Family Member
        </Button>
      </div>
    </div>
  );
}