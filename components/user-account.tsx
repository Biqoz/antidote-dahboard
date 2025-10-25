"use client";

import { User } from "lucide-react";

export function UserAccount() {
  return (
    <div className="flex items-center gap-2 px-2 py-1">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
        <User className="h-4 w-4" />
      </div>
      <div className="flex-1 text-left text-sm">
        <div className="font-medium">Utilisateur</div>
        <div className="text-xs text-muted-foreground">admin@antidote.com</div>
      </div>
    </div>
  );
}
