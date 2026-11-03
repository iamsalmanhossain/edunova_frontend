import React from "react";
import CentralBrandLoader from "@/components/shared/CentralBrandLoader";

export default function RootLoading() {
  return (
    <CentralBrandLoader
      message="Loading EduNova IMS..."
      subMessage="Connecting to digital campus infrastructure"
      fullScreen={true}
    />
  );
}

