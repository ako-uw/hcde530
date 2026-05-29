import { useState, useRef } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, Link2, X } from "lucide-react";

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

export function InputPanel({
  onAnalyze,
  loading,
}: {
  onAnalyze: (input: AnalysisInput) => void;
  loading: boolean;
}) {
  const [url, setUrl] = useState("");
  const [preview, setPreview] = useState<{ dataUrl: string; mimeType: string; name: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be under 5MB");
      return;
    }
    const dataUrl = await readFileAsDataUrl(file);
    setPreview({ dataUrl, mimeType: file.type, name: file.name });
  }

  return (
    <div className="rounded-lg border border-border bg-card p-5 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-medium">New evaluation</h2>
        <span className="text-label">10 heuristics · 0–10 score</span>
      </div>
      <Tabs defaultValue="url">
        <TabsList className="bg-[color:var(--surface)]">
          <TabsTrigger value="url">
            <Link2 className="size-3.5" /> URL
          </TabsTrigger>
          <TabsTrigger value="image">
            <Upload className="size-3.5" /> Screenshot
          </TabsTrigger>
        </TabsList>

        <TabsContent value="url" className="mt-4 space-y-2">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              type="url"
              placeholder="https://your-product.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
              className="h-10"
            />
            <Button
              onClick={() => onAnalyze({ kind: "url", url })}
              disabled={loading || !url}
              className="h-10 px-5"
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              Analyze
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Public pages only. JS-heavy sites may critique partial content; if the page is gated by
            a CDN challenge or queue, the evaluation will be blocked rather than scored.
          </p>
        </TabsContent>

        <TabsContent value="image" className="mt-4 space-y-2">
          {!preview ? (
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files[0];
                if (f) handleFile(f);
              }}
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-[color:var(--surface)] px-6 py-10 text-center hover:border-foreground/30 transition-colors"
            >
              <Upload className="size-5 text-muted-foreground" />
              <div className="text-sm font-medium">Drop your screenshot</div>
              <div className="text-xs text-muted-foreground">PNG · JPG · WEBP — max 5MB</div>
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
          ) : (
            <div className="relative overflow-hidden rounded-md border border-border">
              <img src={preview.dataUrl} alt={preview.name} className="max-h-80 w-full object-contain bg-[color:var(--surface)]" />
              <button
                onClick={() => setPreview(null)}
                className="absolute right-2 top-2 rounded-full bg-white p-1.5 border border-border hover:bg-[color:var(--surface)]"
              >
                <X className="size-3.5" />
              </button>
            </div>
          )}
          <Button
            onClick={() =>
              preview &&
              onAnalyze({ kind: "image", dataUrl: preview.dataUrl, mimeType: preview.mimeType })
            }
            disabled={loading || !preview}
            className="h-10 w-full sm:w-auto px-5"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            Analyze screenshot
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
