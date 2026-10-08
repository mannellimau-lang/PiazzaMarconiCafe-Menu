"use client";

import { useState } from "react";
import { Bell, X } from "lucide-react";
import { useInSituAdmin } from "@/context/InSituAdminContext";

export default function AlertBanner() {
  const [dismissed, setDismissed] = useState(false);
  const { isEditMode, alerts, setAlerts } = useInSituAdmin();

  if (dismissed || !alerts.active) return null;

  return (
    <div className="bg-[#1e293b] text-white border-b border-amber-500/30 px-4 py-2.5 sm:px-6 relative z-[9990] backdrop-blur-md shadow-md">
      <div className="container mx-auto flex items-center justify-between gap-4 text-xs sm:text-sm">
        <div className="flex items-center gap-2.5 font-medium overflow-hidden text-ellipsis whitespace-nowrap flex-1">
          <span className="bg-amber-500/20 text-amber-400 p-1 rounded-full flex items-center justify-center shrink-0">
            <Bell className="w-3.5 h-3.5" />
          </span>
          <span
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onBlur={(e) =>
              setAlerts((prev) => ({ ...prev, title: e.currentTarget.innerText }))
            }
            className={`font-bold text-amber-300 shrink-0 ${
              isEditMode
                ? "outline-dashed outline-1 outline-amber-400 bg-amber-500/20 px-1 rounded cursor-text"
                : ""
            }`}
          >
            {alerts.title}:
          </span>
          <span
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onBlur={(e) =>
              setAlerts((prev) => ({ ...prev, message: e.currentTarget.innerText }))
            }
            className={`text-gray-200 truncate flex-1 ${
              isEditMode
                ? "outline-dashed outline-1 outline-amber-400 bg-amber-500/20 px-1 rounded cursor-text"
                : ""
            }`}
          >
            {alerts.message}
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Chiudi avviso"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
