"use client";

import RequireAuth from "@/components/RequireAuth";
import EquipmentTable from "@/components/EquipmentTable";

export default function ManageEquipmentPage() {
  return (
    <RequireAuth roles={["admin"]} bare>
      <EquipmentTable admin />
    </RequireAuth>
  );
}
