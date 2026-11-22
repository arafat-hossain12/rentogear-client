"use client";

import RequireAuth from "@/components/RequireAuth";
import EquipmentTable from "@/components/EquipmentTable";

export default function MyEquipmentPage() {
  return (
    <RequireAuth roles={["owner"]} bare>
      <EquipmentTable admin={false} />
    </RequireAuth>
  );
}
