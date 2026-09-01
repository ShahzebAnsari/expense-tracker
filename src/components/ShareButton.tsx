"use client";

import { useState } from "react";
import { toPng } from "html-to-image";
import { IconShare, IconDownload, IconCheck } from "./Icons";

interface ShareButtonProps {
  targetRef: React.RefObject<HTMLElement | null>;
  filename: string;
  label?: string;
  csvData?: string;
  csvFilename?: string;
}

export default function ShareButton({
  targetRef,
  filename,
  label = "Share",
  csvData,
  csvFilename,
}: ShareButtonProps) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  async function capturePng(): Promise<Blob | null> {
    if (!targetRef.current) return null;
    const dataUrl = await toPng(targetRef.current, {
      backgroundColor: getComputedStyle(document.body).getPropertyValue("--surface") || "#151922",
      pixelRatio: 2,
      cacheBust: true,
    });
    const res = await fetch(dataUrl);
    return res.blob();
  }

  async function handleShareImage() {
    setMenuOpen(false);
    setBusy(true);
    try {
      const blob = await capturePng();
      if (!blob) return;
      const file = new File([blob], `${filename}.png`, { type: "image/png" });

      if (
        typeof navigator !== "undefined" &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          files: [file],
          title: filename,
        });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${filename}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      setDone(true);
      setTimeout(() => setDone(false), 1800);
    } catch {
      // user cancelled share sheet or capture failed — no-op
    } finally {
      setBusy(false);
    }
  }

  function handleDownloadCsv() {
    setMenuOpen(false);
    if (!csvData) return;
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = csvFilename ?? `${filename}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="relative">
      <button
        onClick={() => (csvData ? setMenuOpen((v) => !v) : handleShareImage())}
        disabled={busy}
        className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-[12.5px] font-medium text-[var(--text-muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--text)] disabled:opacity-60"
      >
        {done ? <IconCheck size={14} className="text-[var(--positive)]" /> : <IconShare size={14} />}
        {busy ? "Preparing…" : done ? "Shared" : label}
      </button>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 top-full z-20 mt-1.5 w-44 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] py-1 shadow-xl animate-fade-in">
            <button
              onClick={handleShareImage}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-[var(--text)] hover:bg-[var(--surface-hover)]"
            >
              <IconShare size={14} /> Share as image
            </button>
            <button
              onClick={handleDownloadCsv}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-[var(--text)] hover:bg-[var(--surface-hover)]"
            >
              <IconDownload size={14} /> Export as CSV
            </button>
          </div>
        </>
      )}
    </div>
  );
}
