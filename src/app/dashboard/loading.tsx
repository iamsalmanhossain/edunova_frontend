import React from "react";
import CentralBrandLoader from "@/components/shared/CentralBrandLoader";

export default function DashboardLoading() {
  return (
    <CentralBrandLoader
      message="Loading EduNova Portal..."
      subMessage="Synchronizing academic credentials and dashboard modules"
      fullScreen={true}
    />
  );
}

