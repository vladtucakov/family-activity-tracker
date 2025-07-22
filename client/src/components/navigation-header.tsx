import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FamilyMember } from "@shared/schema";

interface NavigationHeaderProps {
  selectedMember: FamilyMember | "family";
  onMemberChange: (member: FamilyMember | "family") => void;
}

export default function NavigationHeader({ 
  selectedMember, 
  onMemberChange 
}: NavigationHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">
              Family Activity Tracker
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 hidden sm:inline">Viewing as:</span>
            <Select value={selectedMember} onValueChange={onMemberChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Andrea">Andrea</SelectItem>
                <SelectItem value="Sasha">Sasha</SelectItem>
                <SelectItem value="Matti">Matti</SelectItem>
                <SelectItem value="Vlad">Vlad</SelectItem>
                <SelectItem value="family">Family View</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </header>
  );
}
