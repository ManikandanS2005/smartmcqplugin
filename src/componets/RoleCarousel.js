"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormContext } from "@/context/FormContext";
import { toast } from "sonner";

export default function RoleCarousel() {
  const [open, setOpen] = useState(true);
  const [otherRole, setOtherRole] = useState("");
  const { formData, updateFormData } = useFormContext();
  const router = useRouter();

  const handleRoleChange = (value) => {
    if (value !== "Other") {
      updateFormData({ role: value });
      console.log(`role:${value}`)
      router.push("/audience");

    } else {
      updateFormData({ role: "Other" });
    }
    
  };

  const handleOtherSubmit = () => {
    const trimmedRole = otherRole.trim();

    // ✅ Only alphabets and spaces allowed
    if (!trimmedRole || !/^[A-Za-z\s]+$/.test(trimmedRole)) {
      toast("Please provide a proper Specification of your Role");
      return;
    }

    updateFormData({ role: trimmedRole });
    console.log(`role:${trimmedRole}`)
    router.push("/audience");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleOtherSubmit();
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          router.back();
        }
      }}
    >
      <DialogContent className="max-w-sm mx-auto bg-white text-black rounded-lg shadow-lg">
        <DialogHeader className="flex items-center">
          <DialogTitle className="font-bold text-3xl">Select Your Role</DialogTitle>
          <DialogDescription className="font-bold text-xl">
           Let us know your role to personalize 
           your setup.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Label htmlFor="role">Role</Label>
          <Select onValueChange={handleRoleChange}>
            <SelectTrigger id="role" className="w-full">
              <SelectValue placeholder="Choose a Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HR">HR</SelectItem>
              <SelectItem value="Student">Student</SelectItem>
              <SelectItem value="Teacher">Teacher</SelectItem>
              <SelectItem value="Trainer">Trainer</SelectItem>
              <SelectItem value="Developer">Developer</SelectItem>
              <SelectItem value="Interviewer">Interviewer</SelectItem>
              <SelectItem value="Survey/Workshop">Survey/Workshop</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>

          {formData.role === "Other" && (
            <div className="space-y-2">
              <Label htmlFor="otherRole">Please Specify</Label>
              <Input
                id="otherRole"
                placeholder="Enter your role"
                value={otherRole}
                onChange={(e) => setOtherRole(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <Button className="w-full mt-2" onClick={handleOtherSubmit}>
                Continue
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
