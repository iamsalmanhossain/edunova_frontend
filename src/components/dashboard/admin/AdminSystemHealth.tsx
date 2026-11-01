"use client";

import React from "react";
import { Server, Database, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminSystemHealth() {
  return (
    <Card className="border-[#e2e8e4] shadow-xs bg-[#fbfcfb]">
      <CardHeader className="pb-2 border-b border-[#e2e8e4]/60">
        <CardTitle className="text-sm font-bold text-[#0f1f17]">
          Backend Infrastructure
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3 text-xs">
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-[#e2e8e4]">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-[#0a4b32]" />
            <span>NestJS API Gateway</span>
          </div>
          <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200">
            Online (5000)
          </Badge>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-[#e2e8e4]">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#0a4b32]" />
            <span>PostgreSQL (Neon)</span>
          </div>
          <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200">
            Connected
          </Badge>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-[#e2e8e4]">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#c48b28]" />
            <span>Redis OTP &amp; Throttle</span>
          </div>
          <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200">
            Ready
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

