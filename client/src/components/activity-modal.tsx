import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DeleteConfirmation } from "@/components/delete-confirmation";
import { X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CATEGORIES, type FamilyMember, type CategoryKey } from "@shared/schema";
import { getTodayDateString } from "@/lib/date-utils";
import { Trash2 } from "lucide-react";

const activityFormSchema = z.object({
  category: z.string().min(1, "Please select a category"),
  description: z.string().min(1, "Please enter a description"),
  date: z.string().min(1, "Please select a date"),
});

type ActivityFormData = z.infer<typeof activityFormSchema>;

interface ActivityModalProps {
  open: boolean;
  onClose: () => void;
  memberName: FamilyMember;
  editingActivity?: any;
  preselectedCategory?: string | null;
  defaultDate?: string;
}

export default function ActivityModal({ 
  open, 
  onClose, 
  memberName, 
  editingActivity,
  preselectedCategory,
  defaultDate 
}: ActivityModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!editingActivity?.id) throw new Error("No activity to delete");
      return apiRequest("DELETE", `/api/activities/${editingActivity.id}`);
    },
    onSuccess: () => {
      toast({ title: "Activity deleted successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: ["/api/users", user.id, "week"] });
        queryClient.invalidateQueries({ queryKey: ["/api/users", user.id, "stats"] });
        queryClient.invalidateQueries({ queryKey: ["/api/users", user.id, "activities"] });
      }
      onClose();
    },
    onError: () => {
      toast({ 
        title: "Error deleting activity", 
        description: "Please try again.",
        variant: "destructive" 
      });
    },
  });

  const { data: user } = useQuery({
    queryKey: ["/api/users", memberName.toLowerCase()],
  });

  const form = useForm<ActivityFormData>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      category: "",
      description: "",
      date: defaultDate || getTodayDateString(),
    },
  });

  useEffect(() => {
    if (editingActivity) {
      form.setValue("category", editingActivity.category);
      form.setValue("description", editingActivity.description);
      form.setValue("date", editingActivity.date);
    } else {
      form.reset({
        category: preselectedCategory || "",
        description: "",
        date: defaultDate || getTodayDateString(),
      });
    }
  }, [editingActivity, preselectedCategory, defaultDate, form]);

  const createMutation = useMutation({
    mutationFn: async (data: ActivityFormData) => {
      if (!user?.id) throw new Error("User not found");
      
      return apiRequest("POST", "/api/activities", {
        userId: user.id,
        category: data.category,
        description: data.description,
        date: data.date,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users", user?.id, "activities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users", user?.id, "activities", variables.date] });
      queryClient.invalidateQueries({ queryKey: ["/api/users", user?.id, "week"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users", user?.id, "stats"] });
      toast({
        title: "Success",
        description: "Activity saved successfully!",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save activity. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: ActivityFormData) => {
      if (!editingActivity?.id) throw new Error("Activity ID not found");
      
      return apiRequest("PUT", `/api/activities/${editingActivity.id}`, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users", user?.id, "activities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users", user?.id, "activities", variables.date] });
      queryClient.invalidateQueries({ queryKey: ["/api/users", user?.id, "week"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users", user?.id, "stats"] });
      toast({
        title: "Success",
        description: "Activity updated successfully!",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update activity. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ActivityFormData) => {
    if (editingActivity) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingActivity ? "Edit Activity" : "Add Activity"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(CATEGORIES).map(([key, name]) => (
                        <SelectItem key={key} value={key}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what you did..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field}
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-3 pt-4">
              <Button
                type="submit"
                disabled={isLoading || deleteMutation.isPending}
                className="flex-1"
              >
                {isLoading ? "Saving..." : "Save Activity"}
              </Button>
              {editingActivity && (
                <DeleteConfirmation onConfirm={() => deleteMutation.mutate()}>
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={isLoading || deleteMutation.isPending}
                    className="px-3"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </DeleteConfirmation>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading || deleteMutation.isPending}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
