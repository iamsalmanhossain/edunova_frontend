"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface AboutProfileFormProps {
  title: string;
  onChangeTitle: (val: string) => void;
  tagline: string;
  onChangeTagline: (val: string) => void;
  slug: string;
  onChangeSlug: (val: string) => void;
  isPublished: boolean;
  onTogglePublished: () => void;
}

export default function AboutProfileForm({
  title,
  onChangeTitle,
  tagline,
  onChangeTagline,
  slug,
  onChangeSlug,
  isPublished,
  onTogglePublished,
}: AboutProfileFormProps) {
  return (
    <Card className="border-[#e2e8e4]">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold text-[#0f1f17] flex items-center justify-between">
          <span>Core Profile Details</span>
          {isPublished ? (
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
              Published
            </Badge>
          ) : (
            <Badge variant="outline" className="text-amber-700 border-amber-300 text-[10px]">
              Draft
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3.5 text-xs">
        <div>
          <Label htmlFor="about-title" className="text-xs font-medium text-gray-700">
            Institute Title <span className="text-rose-500">*</span>
          </Label>
          <Input
            id="about-title"
            value={title}
            onChange={(e) => onChangeTitle(e.target.value)}
            placeholder="e.g. Kishoreganj Government Polytechnic Institute (KIGPI)"
            className="mt-1 h-8 text-xs"
          />
        </div>

        <div>
          <Label htmlFor="about-tagline" className="text-xs font-medium text-gray-700">
            Tagline / Motto
          </Label>
          <Input
            id="about-tagline"
            value={tagline}
            onChange={(e) => onChangeTagline(e.target.value)}
            placeholder="e.g. Empowering Technical Innovation & Engineering"
            className="mt-1 h-8 text-xs"
          />
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <Label htmlFor="about-slug" className="text-xs font-medium text-gray-700">
              Slug ID
            </Label>
            <Input
              id="about-slug"
              value={slug}
              onChange={(e) => onChangeSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
              placeholder="main"
              className="mt-1 h-8 text-xs font-mono"
            />
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-700">Publication State</Label>
            <button
              type="button"
              onClick={onTogglePublished}
              className={`mt-1 w-full h-8 px-2 rounded-md border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                isPublished
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                  : "bg-gray-100 text-gray-700 border-gray-300"
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${isPublished ? "text-emerald-600" : "text-gray-400"}`} />
              {isPublished ? "Published" : "Draft (Hidden)"}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
