"use client";
import { useState } from "react";
import Link from "next/link";
import { saveLesson } from "@/app/actions";

export default function LessonForm({ courseId, lesson }) {
  const [videoUrl, setVideoUrl] = useState(lesson?.videoUrl || "");
  const [duration, setDuration] = useState(lesson?.duration ?? "");
  const [progress, setProgress] = useState(null);
  const [msg, setMsg] = useState("");

  async function upload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setMsg("");
    setProgress(0);
    try {
      const res = await fetch("/api/upload/sign", { method: "POST" });
      const sig = await res.json();
      if (!res.ok) throw new Error(sig.error || "Upload is not available");
      const fd = new FormData();
      fd.append("file", file);
      fd.append("api_key", sig.apiKey);
      fd.append("timestamp", sig.timestamp);
      fd.append("signature", sig.signature);
      fd.append("folder", sig.folder);
      const out = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${sig.cloudName}/video/upload`);
        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) setProgress(Math.round((ev.loaded / ev.total) * 100));
        };
        xhr.onload = () => {
          let j = {};
          try { j = JSON.parse(xhr.responseText); } catch {}
          xhr.status < 300 ? resolve(j) : reject(new Error(j.error?.message || "Upload failed"));
        };
        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.send(fd);
      });
      setVideoUrl(out.secure_url);
      if (out.duration) setDuration(Math.max(1, Math.round(out.duration / 60)));
      setMsg("Video uploaded. Save the lesson to keep it.");
    } catch (err) {
      setMsg(err.message);
    }
    setProgress(null);
  }

  return (
    <form action={saveLesson} className="card grid gap-4 p-5">
      <input type="hidden" name="courseId" value={courseId} />
      {lesson && <input type="hidden" name="id" value={lesson._id} />}
      <div className="grid gap-4 sm:grid-cols-[1fr_120px_100px]">
        <div>
          <label className="label">Lesson title</label>
          <input name="title" required className="input" defaultValue={lesson?.title} />
        </div>
        <div>
          <label className="label">Minutes</label>
          <input name="duration" type="number" min="0" className="input" value={duration} onChange={(e) => setDuration(e.target.value)} />
        </div>
        <div>
          <label className="label">Order</label>
          <input name="order" type="number" min="1" className="input" defaultValue={lesson?.order} placeholder="auto" />
        </div>
      </div>
      <div>
        <label className="label">Description</label>
        <textarea name="description" rows={2} className="input" defaultValue={lesson?.description} />
      </div>
      <div className="grid gap-3 rounded-lg border border-dashed border-line p-4">
        <div>
          <label className="label">Upload a video file</label>
          <input type="file" accept="video/*" onChange={upload} disabled={progress !== null} className="text-sm" />
          {progress !== null && (
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
              <div className="h-full bg-brand transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}
          {msg && <p className="mt-2 text-sm text-mute">{msg}</p>}
        </div>
        <div>
          <label className="label">Or paste a video link (mp4 or YouTube)</label>
          <input name="videoUrl" className="input" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://..." />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isPreview" defaultChecked={lesson?.isPreview} />
        Free preview (anyone can watch this lesson)
      </label>
      <div className="flex gap-2">
        <button className="btn btn-primary" disabled={progress !== null}>{lesson ? "Save lesson" : "Add lesson"}</button>
        {lesson && <Link href={`/admin/courses/${courseId}`} className="btn btn-ghost">Cancel</Link>}
      </div>
    </form>
  );
}
