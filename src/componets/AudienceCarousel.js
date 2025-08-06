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

export default function AudienceCarousel() {
  const [open, setOpen] = useState(true);
  const [otherAudience, setOtherAudience] = useState("");
  const { formData, updateFormData } = useFormContext();
  const router = useRouter();

  const handleAudienceChange = (value) => {
    if (value !== "Others") {
      updateFormData({ audience: value });
      router.push(`/form`);
    } else {
      updateFormData({ audience: "Others" });
    }
    console.log(`audience:${value}`);
  };

  const handleOtherSubmit = () => {
    const trimmed = otherAudience.trim();

    // ✅ Only alphabets allowed — regex: /^[A-Za-z\s]+$/
    if (!trimmed || !/^[A-Za-z\s]+$/.test(trimmed)) {
      toast("Please provide a proper specification of the audience.");
      return;
    }

    updateFormData({ audience: trimmed });
    router.push(`/form`);
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
          <DialogTitle className="font-bold text-3xl">Select Audience</DialogTitle>
          <DialogDescription className="font-bold text-xl">
           Let’s match your content to the right people.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Label htmlFor="audience">Audience</Label>
          <Select onValueChange={handleAudienceChange}>
            <SelectTrigger id="audience" className="w-full">
              <SelectValue placeholder="Choose an Audience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Trainees">Trainees</SelectItem>
              <SelectItem value="Students">Students</SelectItem>
              <SelectItem value="Interns">Interns</SelectItem>
              <SelectItem value="Workshop">Workshop</SelectItem>
              <SelectItem value="Freshers">Freshers</SelectItem>
              <SelectItem value="Applicants">Applicants</SelectItem>
              <SelectItem value="Employees">Employees</SelectItem>
              <SelectItem value="Others">Others</SelectItem>
            </SelectContent>
          </Select>

          {formData.audience === "Others" && (
            <div className="space-y-2">
              <Label htmlFor="otherAudience">Please Specify</Label>
              <Input
                id="otherAudience"
                placeholder="Enter audience"
                value={otherAudience}
                onChange={(e) => setOtherAudience(e.target.value)}
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
