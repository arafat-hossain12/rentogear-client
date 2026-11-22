"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import RequireAuth from "@/components/RequireAuth";
import DashHeader from "@/components/DashHeader";
import EquipmentForm from "@/components/EquipmentForm";
import { api } from "@/lib/api";

function AddEquipment() {
  const router = useRouter();
  return (
    <>
      <DashHeader title="Add Equipment" subtitle="New listings are reviewed by an admin before they go live" />
      <div className="max-w-3xl rounded-box border border-base-300 bg-base-100 p-6">
        <EquipmentForm
          submitLabel="Add equipment"
          onSubmit={async (data) => {
            await api("/equipment", { method: "POST", body: data });
            toast.success("Equipment added. It will appear after admin approval.");
            router.push("/dashboard/my-equipment");
          }}
        />
      </div>
    </>
  );
}

export default function AddEquipmentPage() {
  return (
    <RequireAuth roles={["owner"]} bare>
      <AddEquipment />
    </RequireAuth>
  );
}
