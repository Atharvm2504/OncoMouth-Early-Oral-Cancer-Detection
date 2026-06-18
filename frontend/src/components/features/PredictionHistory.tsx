"use client";

import React, { useEffect, useState } from "react";
import { History, Clock, Activity } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface HistoryItem {
  request_id: string;
  prediction: string;
  confidence: number;
  timestamp: string;
}

export function PredictionHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const loadHistory = () => {
      try {
        const stored = localStorage.getItem("oncomouth_history");
        if (stored) {
          setHistory(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    };

    loadHistory();
    // Re-load on storage event (optional)
    window.addEventListener("storage", loadHistory);
    return () => window.removeEventListener("storage", loadHistory);
  }, []);

  return (
    <Sheet>
      <SheetTrigger className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-900 h-10 px-4 py-2 border border-slate-200 bg-white text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50">
        <History className="w-4 h-4" />
        History
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-slate-800">
            <Activity className="w-5 h-5 text-primary" />
            Recent Predictions
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 flex flex-col gap-4">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No prediction history available.</p>
            </div>
          ) : (
            history.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col gap-2 relative group hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      item.prediction === "Cancer" ? "bg-red-500" :
                      item.prediction === "PreCancer" ? "bg-amber-500" :
                      "bg-emerald-500"
                    }`} />
                    <span className="font-semibold text-slate-900">{item.prediction}</span>
                  </div>
                  <span className="text-xs text-slate-500">{(item.confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span className="truncate w-32" title={item.request_id}>{item.request_id}</span>
                  <span>{new Date(item.timestamp).toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
