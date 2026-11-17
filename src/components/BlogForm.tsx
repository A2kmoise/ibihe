import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { Editor } from "@/components/Editor";
import { ImageUpload } from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import { X, Eye, EyeOff, Globe, Share2, FileText, CheckCircle } from "lucide-react";
import type { Blog } from "@/lib/api/types";

export interface BlogFormValue {
  title: string;
  content: string;
  excerpt: string;
  coverImage?: File; // file to upload
  categoryId: string;
  tags: string[];
  published: boolean;
  scheduledAt?: string | null; // ISO string
}

export function BlogForm({
  initial,
  submitting,
  onSubmit,
  onDelete,
}: {
  initial?: Partial<Blog> & { categoryId?: string };
  submitting?: boolean;
  onSubmit: (v: BlogFormValue) => void;
  onDelete?: () => void;
}) {
  // Hardcoded categories based on backend enum BlogCategory
  const categories = [
    { id: "ENTERTAINMENT", name: "Entertainment" },
    { id: "SPORTS", name: "Sports" },
    { id: "TRANSPORT", name: "Transport" },
    { id: "TECHNOLOGY", name: "Technology" },
    { id: "BUSINESS", name: "Business" },
    { id: "EDUCATION", name: "Education" },
  ];

  const [title, setTitle] = useState(initial?.title || "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt || "");
  const [content, setContent] = useState(initial?.content || "");
  const [coverImage, setCoverImage] = useState<string | undefined>(initial?.coverImage);
  const [coverImageFile, setCoverImageFile] = useState<File | undefined>(undefined);
  const [categoryId, setCategoryId] = useState(initial?.categoryId || initial?.category?.id || "");
  const [tags, setTags] = useState<string[]>(initial?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [preview, setPreview] = useState(false);
  const [previewTab, setPreviewTab] = useState<"story" | "social">("story");
  const [error, setError] = useState("");
  const toLocalDatetime = (iso?: string) => {
    if (!iso) return undefined
    const d = new Date(iso)
    const offset = d.getTimezoneOffset()
    const local = new Date(d.getTime() - offset * 60000)
    return local.toISOString().slice(0, 16)
  }
  const [scheduledAt, setScheduledAt] = useState<string | undefined>(() => {
    const init = (initial as any)?.scheduledAt
    return toLocalDatetime(init)
  })
  const [isScheduled, setIsScheduled] = useState<boolean>(() => !!scheduledAt)

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (!t) return;
    if (tags.includes(t)) return;
    if (tags.length >= 10) return;
    setTags([...tags, t]);
    setTagInput("");
  };

  const handle = (published: boolean) => {
    setError("");
    if (!title.trim()) return setError("Title is required");
    if (!content || content === "<p></p>") return setError("Content is required");
    if (!categoryId) return setError("Pick a category");
    const payload = {
      title: title.trim(),
      content,
      excerpt,
      coverImage: coverImageFile,
      categoryId,
      tags,
      published,
      scheduledAt: isScheduled && scheduledAt ? new Date(scheduledAt).toISOString() : "",
    }
    onSubmit(payload as BlogFormValue)
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b-2 border-border pb-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">{initial?.id ? "Edit blog" : "New blog"}</h1>
          <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <CheckCircle className="h-3.5 w-3.5 text-primary" />
            {initial?.id ? "Draft sync ready" : "New draft in progress"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {preview && (
            <div className="flex rounded-lg border-2 border-border bg-card p-0.5">
              <button
                type="button"
                onClick={() => setPreviewTab("story")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-bold transition-colors ${previewTab === "story" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                <FileText className="h-3.5 w-3.5" /> Story
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab("social")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-bold transition-colors ${previewTab === "social" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Share2 className="h-3.5 w-3.5" /> SEO & Social
              </button>
            </div>
          )}
          <Button variant="outline" className="border-2 border-border font-semibold" onClick={() => setPreview((p) => !p)}>
            {preview ? <><EyeOff className="mr-2 h-4 w-4" /> Edit</> : <><Eye className="mr-2 h-4 w-4" /> Preview</>}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 border-2 border-destructive bg-destructive/10 p-3 text-sm font-semibold text-destructive">
          {error}
        </div>
      )}

      {preview ? (
        previewTab === "story" ? (
          <article className="rounded-2xl border-2 border-border bg-card p-6 md:p-10 shadow-modern">
            <h1 className="text-4xl font-black tracking-tight md:text-5xl">{title || "Untitled"}</h1>
            {coverImage && <img src={coverImage} className="mt-6 aspect-[16/9] w-full rounded-xl border-2 border-border object-cover" alt="" />}
            <div className="prose-content mt-8" dangerouslySetInnerHTML={{ __html: content }} />
          </article>
        ) : (
          <div className="space-y-8 rounded-2xl border-2 border-border bg-card p-6 md:p-8 shadow-modern">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-black">
                <Globe className="h-5 w-5 text-primary" />
                Google Search Result Preview
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">How this post appears when discovered on search engines.</p>
              <div className="mt-4 rounded-xl border border-border bg-background p-4 max-w-xl">
                <p className="text-xs text-muted-foreground">https://menya.rw › blogs › {(title || "untitled").toLowerCase().replace(/[^a-z0-9]+/g, "-")}</p>
                <h3 className="mt-1 text-lg font-bold text-blue-600 hover:underline cursor-pointer">{title || "Post title appears here"}</h3>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                  {excerpt || "Add an excerpt to control the summary text shown under your title on Google search results."}
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h2 className="flex items-center gap-2 text-lg font-black">
                <Share2 className="h-5 w-5 text-primary" />
                Social Card Preview (X & LinkedIn)
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">How this post looks when shared across social networks.</p>
              <div className="mt-4 overflow-hidden rounded-xl border border-border bg-background max-w-lg shadow-sm">
                {coverImage ? (
                  <img src={coverImage} alt="Social Card" className="aspect-[1.91/1] w-full object-cover" />
                ) : (
                  <div className="aspect-[1.91/1] w-full bg-muted flex items-center justify-center text-xs text-muted-foreground font-semibold">
                    No cover image uploaded yet
                  </div>
                )}
                <div className="p-4">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold">menya.rw</p>
                  <h4 className="mt-1 font-bold leading-tight">{title || "Your Post Title"}</h4>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    {excerpt || "Your excerpt summary will be previewed here when readers share your link."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="space-y-6">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              className="h-12 w-full border-2 border-border bg-background px-3 text-lg font-bold outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider">Cover image</label>
            <ImageUpload value={coverImage} onChange={setCoverImage} onFileChange={setCoverImageFile} />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider">Excerpt (optional)</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              maxLength={240}
              className="w-full border-2 border-border bg-background p-3 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider">Content</label>
            <Editor value={content} onChange={setContent} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="h-11 w-full border-2 border-border bg-background px-3 text-sm font-semibold"
              >
                <option value="">Select a category…</option>
                {categories?.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider">Tags ({tags.length}/10)</label>
              <div className="flex gap-2">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }}
                  placeholder="Add tag and press Enter"
                  className="h-11 flex-1 border-2 border-border bg-background px-3 text-sm outline-none focus:border-primary"
                />
                <Button type="button" onClick={addTag} variant="outline" className="border-2 border-border font-bold">Add</Button>
              </div>
              {tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {tags.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 border-2 border-border bg-accent px-2 py-0.5 text-xs font-semibold">
                      #{t}
                      <button type="button" onClick={() => setTags(tags.filter((x) => x !== t))}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t-2 border-border pt-6">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isScheduled}
              onChange={(e) => {
                const checked = e.target.checked
                setIsScheduled(checked)
                if (!checked) setScheduledAt(undefined)
              }}
              className="h-4 w-4 rounded accent-primary"
            />
            <span className="font-medium">Schedule post</span>
          </label>

          {isScheduled && (
            <input
              type="datetime-local"
              value={scheduledAt || ""}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="h-11 w-[220px] rounded border-2 border-border bg-background px-3 text-sm outline-none focus:border-primary"
            />
          )}

          <div className="flex gap-2">
            <Button onClick={() => handle(false)} disabled={submitting} variant="outline" className="border-2 border-border font-bold">
              Save as draft
            </Button>
            <Button onClick={() => handle(true)} disabled={submitting} className="border-2 border-border bg-primary font-bold text-primary-foreground hover:bg-primary/90">
              {submitting ? "Saving…" : "Publish"}
            </Button>
          </div>
        </div>
        {onDelete && (
          <Button variant="ghost" onClick={onDelete} className="text-destructive hover:bg-destructive/10">
            Delete blog
          </Button>
        )}
      </div>
    </div>
  );
}
