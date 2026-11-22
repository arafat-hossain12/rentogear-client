"use client";

export default function ConfirmModal({
  title,
  text,
  confirmLabel = "Delete",
  busy,
  onConfirm,
  onCancel,
}: {
  title: string;
  text: string;
  confirmLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="py-4 opacity-80">{text}</p>
        <div className="modal-action">
          <button className="btn" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button className="btn btn-error" onClick={onConfirm} disabled={busy}>
            {busy && <span className="loading loading-spinner loading-sm" />} {confirmLabel}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={busy ? undefined : onCancel} />
    </dialog>
  );
}
