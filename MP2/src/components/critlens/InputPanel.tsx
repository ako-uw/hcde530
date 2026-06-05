import { useState, useRef, useEffect } from "react";
import { Loader2, Upload, Link2, X, ArrowRight } from "lucide-react";

export type AnalysisInput =
  | { kind: "url"; url: string }
  | { kind: "image"; dataUrl: string; mimeType: string };

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

type Tab = "url" | "screenshot";

export function InputPanel({
  onAnalyze,
  loading,
}: {
  onAnalyze: (input: AnalysisInput) => void;
  loading: boolean;
}) {
  const [url, setUrl] = useState("");
  const [preview, setPreview] = useState<{ dataUrl: string; mimeType: string; name: string } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("url");
  const fileRef = useRef<HTMLInputElement>(null);

  // Switch tab when content appears in the other field
  useEffect(() => {
    if (url && !preview) setActiveTab("url");
  }, [url, preview]);

  useEffect(() => {
    if (preview && !url) setActiveTab("screenshot");
  }, [preview, url]);

  async function handleFile(file: File) {
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be under 5MB");
      return;
    }
    const dataUrl = await readFileAsDataUrl(file);
    setPreview({ dataUrl, mimeType: file.type, name: file.name });
    setUrl("");
    setActiveTab("screenshot");
  }

  function onSubmit() {
    if (loading) return;
    if (preview) {
      onAnalyze({ kind: "image", dataUrl: preview.dataUrl, mimeType: preview.mimeType });
    } else if (url) {
      onAnalyze({ kind: "url", url });
    }
  }

  const canSubmit = !loading && (!!url || !!preview);

  const tabBtn = (tab: Tab, label: string, Icon: typeof Link2) => {
    const isActive = activeTab === tab;
    return (
      <button
        type="button"
        onClick={() => {
          if (loading) return;
          setActiveTab(tab);
          if (tab === "url") {
            setPreview(null);
          } else {
            setUrl("");
          }
        }}
        disabled={loading}
        className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 border-b-2 px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] transition-all ${
          isActive
            ? "border-[color:var(--primary)] bg-[color:var(--primary)]/8 text-[color:var(--primary)]"
            : "border-transparent text-muted-foreground hover:bg-[color:var(--surface)] hover:text-foreground"
        } disabled:cursor-not-allowed disabled:opacity-40`}
      >
        <Icon className="size-3.5" />
        {label}
      </button>
    );
  };

  return (
    <div className="border-2 border-[color:var(--border-strong)] bg-[color:var(--card)] shadow-[6px_6px_0_0_var(--border-strong)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-[color:var(--border-strong)] px-6 py-3 md:px-8">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-[color:var(--primary)]" />
          <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em]">
            New evaluation
          </h2>
        </div>
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {activeTab === "url" ? "URL" : "Screenshot"}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[color:var(--border-strong)]">
        {tabBtn("url", "URL", Link2)}
        {tabBtn("screenshot", "Screenshot", Upload)}
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">
        {activeTab === "url" ? (
          <div>
            <label className="text-label flex items-center gap-1.5">
              <Link2 className="size-3" /> Web address
            </label>
            <input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
              onKeyDown={(e) => e.key === "Enter" && canSubmit && onSubmit()}
              className="mt-3 h-12 w-full border-b-2 border-[color:var(--border-strong)] bg-transparent font-display text-[20px] tracking-tight outline-none placeholder:font-display placeholder:text-foreground/30 focus:border-[color:var(--primary)]"
            />
            <p className="mt-3 text-[12.5px] leading-relaxed text-muted-foreground">
              Public pages only. Sites behind login walls, queues, or CDN challenges
              return as{" "}
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-foreground/80">
                blocked
              </span>{" "}
              rather than scored.
            </p>
          </div>
        ) : (
          <div>
            <label className="text-label flex items-center gap-1.5">
              <Upload className="size-3" /> Upload
            </label>
            {!preview ? (
              <div
                role="button"
                tabIndex={0}
                onClick={() => fileRef.current?.click()}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && fileRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (!dragging) setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  const f = e.dataTransfer.files[0];
                  if (f) void handleFile(f);
                }}
                className={`mt-3 flex cursor-pointer flex-col items-center justify-center gap-1.5 border-2 border-dashed px-4 py-10 text-center transition-all ${
                  dragging
                    ? "border-[color:var(--primary)] bg-[color:var(--primary)]/8 scale-[1.01]"
                    : "border-[color:var(--border-strong)]/40 bg-[color:var(--surface)] hover:border-[color:var(--primary)] hover:bg-[color:var(--primary)]/5"
                }`}
              >
                <Upload className={`size-5 ${dragging ? "text-[color:var(--primary)]" : "text-muted-foreground"}`} />
                <div className="font-display text-[16px] font-semibold">
                  {dragging ? "Drop it here" : "Drop or click to upload"}
                </div>
                <div className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground">
                  PNG · JPG · WEBP · max 5 MB
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void handleFile(f);
                  }}
                />
              </div>
            ) : (
              <div className="relative mt-3 overflow-hidden border-2 border-[color:var(--border-strong)]">
                <img
                  src={preview.dataUrl}
                  alt={preview.name}
                  className="max-h-52 w-full object-contain bg-[color:var(--surface)]"
                />
                <button
                  onClick={() => setPreview(null)}
                  aria-label="Remove screenshot"
                  className="absolute right-1.5 top-1.5 border border-[color:var(--border-strong)] bg-[color:var(--card)] p-1 hover:bg-[color:var(--surface)]"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Primary action */}
      <div className="flex items-center justify-between border-t-2 border-[color:var(--border-strong)] bg-[color:var(--surface)] px-6 py-4 md:px-8">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {preview ? "Screenshot ready" : url ? "URL ready" : "\u00A0"}
        </span>
        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className="group inline-flex h-11 cursor-pointer items-center gap-2.5 border-2 border-[color:var(--border-strong)] bg-[color:var(--primary)] px-5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--primary-foreground)] shadow-[3px_3px_0_0_var(--border-strong)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_0_var(--border-strong)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[3px_3px_0_0_var(--border-strong)]"
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
          Evaluate
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}
