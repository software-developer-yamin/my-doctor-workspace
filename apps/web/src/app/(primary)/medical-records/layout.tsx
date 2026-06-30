import React from "react";

export default function MedicalRecordsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto mt-6 px-4 pb-20 lg:px-6">
      {children}
    </div>
  );
}
