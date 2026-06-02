import { useCallback, useState } from "react";
import { Upload, X } from "lucide-react";
import { api } from "@/lib/api/client";
import { Spinner } from "./Spinner";

export function ImageUpload({
  value,
  onChange,
}: {
  value?: string;
  onChange: (url: string | undefined) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [drag, setDrag] = useState(false);

  const upload = useCallback(
    async (file: File) => {
      setUploading(true);
      try {
        const { url } = await api.uploadImage(file);
        onChange(url);
      } finally {
        setUploading(false);
      }
    },
    [onChange],
  );

  if (value) {
    return (
      <div className="relative border-2 border-border">
        <img src={value} alt="" className="aspect-[16/9] w-full object-cover" />
        <button
          type="button"
          onClick={() => onChange(undefined)}
          className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center border-2 border-border bg-background"
          aria-label="Remove image"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <label
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        const f = e.dataTransfer.files?.[0];
        if (f) upload(f);
      }}
      className={
        "flex aspect-[16/9] cursor-pointer flex-col items-center justify-center border-2 border-dashed border-border bg-muted text-center transition-colors " +
        (drag ? "border-primary bg-accent" : "")
      }
    >
      {uploading ? (
        <Spinner className="h-6 w-6" />
      ) : (
        <>
          <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
          <span className="text-sm font-semibold">Drop an image or click to upload</span>
          <span className="text-xs text-muted-foreground">PNG, JPG up to ~5MB</span>
        </>
      )}
      <input
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
        }}
      />
    </label>
  );
}
