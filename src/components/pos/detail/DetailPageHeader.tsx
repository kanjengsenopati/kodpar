
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface DetailPageHeaderProps {
  title: string;
  backLink: string;
}

export function DetailPageHeader({ title, backLink }: DetailPageHeaderProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <Link to={backLink}>
        <Button variant="outline" size="icon" className="rounded-full h-9 w-9 shadow-sm">
          <ArrowLeft size={16} />
        </Button>
      </Link>
      <h1 className="text-xl font-semibold">{title}</h1>
    </div>
  );
}
