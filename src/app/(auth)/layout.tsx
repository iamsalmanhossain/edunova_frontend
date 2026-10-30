import React from "react";

export default function AuthLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen max-h-screen w-full overflow-hidden no-scrollbar">
      {children}
    </div>
  );
}

