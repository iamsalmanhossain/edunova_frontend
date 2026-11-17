"use client";

import React from "react";
import { Compass, Sparkles, History, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AboutMissionHistoryFormProps {
  mission: string;
  onChangeMission: (val: string) => void;
  vision: string;
  onChangeVision: (val: string) => void;
  history: string;
  onChangeHistory: (val: string) => void;
}

export default function AboutMissionHistoryForm({
  mission,
  onChangeMission,
  vision,
  onChangeVision,
  history,
  onChangeHistory,
}: AboutMissionHistoryFormProps) {
  return (
    <div className="space-y-5 -mt-5">
      {/* Mission & Vision Card */}
      <Card className="border-[#e2e8e4] rounded-t-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold text-[#0f1f17] flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-600" />
            <span>Institutional Mission &amp; Vision</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Clear strategic direction presented to prospective students, industry partners, and governing boards.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="about-mission" className="text-xs font-semibold text-gray-800 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-600" />
              Institutional Mission
            </Label>
            <Textarea
              id="about-mission"
              value={mission}
              onChange={(e) => onChangeMission(e.target.value)}
              placeholder="To deliver accessible, high-quality technical education that equips students with real-world engineering skills..."
              rows={4}
              className="mt-1 text-xs text-gray-900 leading-relaxed"
            />
          </div>

          <div>
            <Label htmlFor="about-vision" className="text-xs font-semibold text-gray-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Institutional Vision
            </Label>
            <Textarea
              id="about-vision"
              value={vision}
              onChange={(e) => onChangeVision(e.target.value)}
              placeholder="To be recognized as a leading technical institute producing globally competent diploma engineers..."
              rows={4}
              className="mt-1 text-xs text-gray-900 leading-relaxed"
            />
          </div>
        </CardContent>
      </Card>

      {/* History & Legacy Card */}
      <Card className="border-[#e2e8e4]">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold text-[#0f1f17] flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-600" />
            <span>History &amp; Pedagogical Legacy</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={history}
            onChange={(e) => onChangeHistory(e.target.value)}
            placeholder="Established under BTEB to meet regional technical demands..."
            rows={5}
            className="text-xs text-gray-900 leading-relaxed"
          />
        </CardContent>
      </Card>
    </div>
  );
}
