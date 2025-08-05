"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RoleCarousel() {
    const [selectedRole, setSelectedRole] = useState("");
  const [otherRole, setOtherRole] = useState("");
  return (
     <div className="max-w-sm mx-auto mt-10 space-y-4">
      <Label htmlFor="role">Select Your Role</Label>
      <Select onValueChange={(value) => setSelectedRole(value)}>
        <SelectTrigger id="role">
          <SelectValue placeholder="Choose a role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="HR">HR</SelectItem>
          <SelectItem value="Student">Student</SelectItem>
          <SelectItem value="Teacher">Teacher</SelectItem>
          <SelectItem value="Other">Other</SelectItem>
        </SelectContent>
      </Select>

      {selectedRole === "Other" && (
        <div className="space-y-2">
          <Label htmlFor="otherRole">Please specify</Label>
          <Input
            id="otherRole"
            placeholder="Enter your role"
            value={otherRole}
            onChange={(e) => setOtherRole(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
