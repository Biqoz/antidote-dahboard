import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DefaultTabProps {
  title: string;
}

export function DefaultTab({ title }: DefaultTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500">
          Cette section sera développée prochainement.
        </p>
      </CardContent>
    </Card>
  );
}