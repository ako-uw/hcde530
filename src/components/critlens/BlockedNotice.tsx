import { useRef } from "react";
import { AlertTriangle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

export function BlockedNotice({
  reason,
  kind,
  source,
  onImageSelected,
}: {
  reason: string;
  kind?: "fetch_failed" | "challenge" | "other";
  source: { kind: "url"; url: string } | { kind: "image" };
  onImageSelected?: (dataUrl: string, mimeType: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const isFetchFail = kind === "fetch_failed";

  const title = isFetchFail
    ? "Couldn't fetch this URL automatically"
    : "Evaluation blocked — interface did not load successfully";

  const body = isFetchFail
    ? "This URL could not be fetched automatically. This is common for sites with login walls, heavy bot protection, or traffic queues. Upload a screenshot of the live interface instead to continue."
    : `Reason: ${reason}. No scores assigned.`;

  async function handleFile(file: File) {
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be under 5MB");
      return;
    }
    const dataUrl = await readFileAsDataUrl(file);
    onImageSelected?.(dataUrl, file.type);
  }

  return (
    <div
      className="rounded-lg shadow-card p-6"
      style={{
        background: "var(--warn-bg)",
        borderLeft: "4px solid var(--warn-border)",
        border: "1px solid var(--border)",
        borderLeftWidth: "4px",
        borderLeftColor: "var(--warn-border)",
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full"
          style={{ background: "white", color: "var(--warn-border)", border: "1px solid var(--border)" }}
        >
          <AlertTriangle className="size-4" />
        </div>
        <div className="space-y-3 flex-1 min-w-0">
          <h2 className="text-[15px] font-semibold text-foreground">{title}</h2>
          <p className="text-[14px] text-foreground/80 leading-[1.7]">{body}</p>
          {!isFetchFail && (
            <div className="text-xs text-muted-foreground">
              <span className="text-label mr-1">Detected</span>
              {reason}
            </div>
          )}
          {source.kind === "url" && (
            <div className="text-xs text-muted-foreground break-all">
              <span className="text-label mr-1">Source</span>
              {source.url}
            </div>
          )}

          {onImageSelected && (
            <div className="pt-2">
              <Button
                onClick={() => fileRef.current?.click()}
                className="h-10 px-5 cursor-pointer"
              >
                <Upload className="size-4" /> Upload a screenshot instead
              </Button>
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
            </div>
          )}

          <p
            className="text-xs text-muted-foreground pt-3 mt-2"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            Server errors, redirect loops, CDN challenges, and queue systems are infrastructure
            concerns — not UX heuristic violations.
          </p>
        </div>
      </div>
    </div>
  );
}
