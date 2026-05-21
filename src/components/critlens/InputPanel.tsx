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
    <div className="rounded-2xl border bg-card p-5 md:p-6">
      <Tabs defaultValue="url">
        <TabsList>
          <TabsTrigger value="url">
            <Link2 className="size-3.5" /> Enter URL
          </TabsTrigger>
          <TabsTrigger value="image">
            <Upload className="size-3.5" /> Upload screenshot
          </TabsTrigger>
        </TabsList>

        <TabsContent value="url" className="mt-4 space-y-3">
          <Input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
          />
          <Button
            onClick={() => onAnalyze({ kind: "url", url })}
            disabled={loading || !url}
            className="w-full sm:w-auto"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            Analyze design
          </Button>
        </TabsContent>

        <TabsContent value="image" className="mt-4 space-y-3">
          {!preview ? (
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files[0];
                if (f) handleFile(f);
              }}
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 px-6 py-10 text-center transition-colors hover:bg-muted/50"
            >
              <Upload className="size-6 text-muted-foreground" />
              <div className="text-sm font-medium">Drop image or click to upload</div>
              <div className="text-xs text-muted-foreground">PNG, JPG or WEBP · up to 5MB</div>
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
            <div className="relative overflow-hidden rounded-xl border">
              <img src={preview.dataUrl} alt={preview.name} className="max-h-72 w-full object-contain bg-muted" />
              <button
                onClick={() => setPreview(null)}
                className="absolute right-2 top-2 rounded-full bg-background/90 p-1.5 shadow hover:bg-background"
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
            className="w-full sm:w-auto"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            Analyze screenshot
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}