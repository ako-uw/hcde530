import { useState, useRef } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, Link2, Sparkles, X } from "lucide-react";

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
    <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/60 p-5 backdrop-blur md:p-7 shadow-[0_30px_80px_-40px_oklch(0_0_0_/_0.6)]">
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="mb-5 flex items-center justify-between">
        <div className="font-mono-label text-muted-foreground">/ new evaluation</div>
        <div className="font-mono-label text-muted-foreground hidden sm:block">10 heuristics · 0–10 score</div>
      </div>
      <Tabs defaultValue="url">
        <TabsList className="bg-muted/60">
          <TabsTrigger value="url">
            <Link2 className="size-3.5" /> Enter URL
          </TabsTrigger>
          <TabsTrigger value="image">
            <Upload className="size-3.5" /> Upload screenshot
          </TabsTrigger>
        </TabsList>

        <TabsContent value="url" className="mt-5 space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              type="url"
              placeholder="https://your-product.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
              className="h-12 rounded-xl bg-background/60 px-4 text-base"
            />
            <Button
              onClick={() => onAnalyze({ kind: "url", url })}
              disabled={loading || !url}
              className="h-12 rounded-xl px-6 font-semibold"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              Analyze
            </Button>
          </div>
          <p className="font-mono-label text-muted-foreground">
            Tip · Public pages only. JS-heavy sites may critique partial content.
          </p>
        </TabsContent>

        <TabsContent value="image" className="mt-5 space-y-3">
          {!preview ? (
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files[0];
                if (f) handleFile(f);
              }}
              className="group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border/70 bg-background/40 px-6 py-14 text-center transition-all hover:border-primary/60 hover:bg-primary/5"
            >
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <Upload className="size-5" />
              </div>
              <div className="mt-2 font-display text-xl">Drop your screenshot</div>
              <div className="font-mono-label text-muted-foreground">PNG · JPG · WEBP — max 5MB</div>
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
            <div className="relative overflow-hidden rounded-2xl border border-border/60">
              <img src={preview.dataUrl} alt={preview.name} className="max-h-80 w-full object-contain bg-background/40" />
              <button
                onClick={() => setPreview(null)}
                className="absolute right-3 top-3 rounded-full bg-background/90 p-2 shadow hover:bg-background"
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
            className="h-12 w-full rounded-xl px-6 font-semibold sm:w-auto"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            Analyze screenshot
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}