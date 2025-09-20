'use client'

import React, { useState, useRef } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/upload";

export default function UploadPage() {
  const fileInputRef = useRef(null);
  const [items, setItems] = useState([]);

  function addFiles(fileList) {
    const files = Array.from(fileList).map((f) => ({
      file: f,
      preview: f.type.startsWith("image/") ? URL.createObjectURL(f) : null,
      progress: 0,
      status: "ready",
      response: null,
      metaOpen: false,
      metadata: {
        title: f.name,
        author: "",
        tags: "",
        language: "",
        description: "",
        index: true 
      }
    }));
    setItems((prev) => [...prev, ...files]);
  }

  function onFileChange(e) {
    if (e.target.files) addFiles(e.target.files);
  }

  function onDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer?.files?.length) addFiles(e.dataTransfer.files);
  }

  function onDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function removeItem(i) {
    setItems((prev) => {
      const copy = [...prev];
      const it = copy.splice(i, 1)[0];
      if (it?.preview) URL.revokeObjectURL(it.preview);
      return copy;
    });
  }

  function clearAll() {
    items.forEach((it) => { if (it.preview) URL.revokeObjectURL(it.preview); });
    setItems([]);
  }

  function updateMetadata(index, key, value) {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], metadata: { ...copy[index].metadata, [key]: value } };
      return copy;
    });
  }

  function toggleMetaOpen(index) {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], metaOpen: !copy[index].metaOpen };
      return copy;
    });
  }

  function uploadSingle(index) {
    return new Promise((resolve) => {
      setItems((prev) => {
        const copy = [...prev];
        copy[index] = { ...copy[index], status: "uploading" };
        return copy;
      });

      const item = items[index];
      const xhr = new XMLHttpRequest();
      const fd = new FormData();
      fd.append("file", item.file);
      fd.append("metadata", JSON.stringify(item.metadata));

      xhr.open("POST", BACKEND_URL);

      xhr.upload.onprogress = (ev) => {
        if (!ev.lengthComputable) return;
        const percent = Math.round((ev.loaded / ev.total) * 100);
        setItems((prev) => {
          const copy = [...prev];
          copy[index] = { ...copy[index], progress: percent, status: "uploading" };
          return copy;
        });
      };

      xhr.onload = () => {
        setItems((prev) => {
          const copy = [...prev];
          copy[index] = {
            ...copy[index],
            progress: 100,
            status: xhr.status >= 200 && xhr.status < 300 ? "done" : "error",
            response: xhr.responseText,
          };
          return copy;
        });
        resolve({ ok: xhr.status >= 200 && xhr.status < 300, status: xhr.status, text: xhr.responseText });
      };

      xhr.onerror = () => {
        setItems((prev) => {
          const copy = [...prev];
          copy[index] = { ...copy[index], status: "error" };
          return copy;
        });
        resolve({ ok: false, status: 0, text: null });
      };

      xhr.send(fd);
    });
  }

  async function uploadAll() {
    for (let i = 0; i < items.length; i++) {
      if (items[i].status === "ready" || items[i].status === "error") {

        await uploadSingle(i);
      }
    }
  }

  function formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  function normalizeTags(tagString) {
    return tagString.split(",").map((t) => t.trim()).filter(Boolean);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col items-center justify-start p-8">
  <div className="max-w-5xl w-full bg-white shadow-2xl rounded-3xl p-8 mt-12">
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
      <h1 className="text-3xl font-bold text-slate-900">Upload Documents</h1>
      <div className="text-sm text-slate-500">
        Sends files to your Flask backend at <code className="bg-slate-100 px-2 py-1 rounded">{BACKEND_URL}</code>
      </div>
    </header>

    <section
      onDrop={onDrop}
      onDragOver={onDragOver}
      className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center cursor-pointer hover:border-slate-400 transition duration-300"
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        multiple
        accept="image/*,application/pdf"
        onChange={onFileChange}
      />

      <div className="flex flex-col items-center gap-3">
        <svg className="w-14 h-14 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5A4.5 4.5 0 017.5 3h9A3.75 3.75 0 0120.25 6.75V18a3 3 0 01-3 3H6a3 3 0 01-3-3V7.5z" />
        </svg>
        <div className="text-xl font-semibold text-slate-700">Drag & drop files here, or click to browse</div>
        <div className="text-sm text-slate-500">Images and PDFs are accepted. Multiple files allowed.</div>
        <div className="mt-3 flex gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
            className="px-5 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition"
          >
            Choose Files
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); clearAll(); }}
            className="px-5 py-2 bg-white border border-slate-300 rounded-lg font-medium hover:bg-slate-50 transition"
          >
            Clear List
          </button>
        </div>
      </div>
    </section>

    <section className="mt-8">
      {items.length === 0 ? (
        <div className="text-sm text-slate-500">No files added yet.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((it, i) => (
            <div key={i} className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 border rounded-2xl shadow-sm hover:shadow-md transition bg-white">
              <div className="w-24 h-24 flex items-center justify-center bg-slate-50 rounded-xl overflow-hidden flex-shrink-0">
                {it.preview ? (
                  <img src={it.preview} alt={it.file.name} className="object-cover w-full h-full" />
                ) : (
                  <div className="text-sm text-slate-400 px-2 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mx-auto" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <div className="mt-1">{it.file.type || 'file'}</div>
                  </div>
                )}
              </div>

              <div className="flex-1 w-full">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                  <div>
                    <div className="font-semibold text-slate-800">{it.file.name}</div>
                    <div className="text-xs text-slate-500">{formatBytes(it.file.size)}</div>
                  </div>
                  <div className="text-right text-xs text-slate-400">
                    {it.status} {it.response && "• response ready"}
                  </div>
                </div>

                <div className="mt-3">
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div style={{ width: `${it.progress}%` }} className={`h-2 rounded-full ${it.status === 'error' ? 'bg-red-400' : 'bg-emerald-500'} transition-all`} />
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2 items-center">
                    <button onClick={() => uploadSingle(i)} className="px-3 py-1 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800 transition">Upload</button>
                    <button onClick={() => removeItem(i)} className="px-3 py-1 bg-white border rounded-lg text-sm hover:bg-slate-50 transition">Remove</button>
                    <button onClick={() => toggleMetaOpen(i)} className="px-3 py-1 bg-white border rounded-lg text-sm hover:bg-slate-50 transition">{it.metaOpen ? 'Hide metadata' : 'Edit metadata'}</button>
                    <div className="text-xs text-slate-500 mt-1">{it.progress}%</div>
                  </div>

                  {it.metaOpen && (
                    <div className="mt-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 transition">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-slate-600">Title</label>
                          <input value={it.metadata.title} onChange={(e) => updateMetadata(i, 'title', e.target.value)} className="w-full mt-1 p-2 border rounded-lg text-sm" />
                        </div>
                        <div>
                          <label className="text-xs text-slate-600">Author</label>
                          <input value={it.metadata.author} onChange={(e) => updateMetadata(i, 'author', e.target.value)} className="w-full mt-1 p-2 border rounded-lg text-sm" />
                        </div>
                        <div>
                          <label className="text-xs text-slate-600">Tags (comma separated)</label>
                          <input value={it.metadata.tags} onChange={(e) => updateMetadata(i, 'tags', e.target.value)} className="w-full mt-1 p-2 border rounded-lg text-sm" />
                        </div>
                        <div>
                          <label className="text-xs text-slate-600">Language</label>
                          <input value={it.metadata.language} onChange={(e) => updateMetadata(i, 'language', e.target.value)} className="w-full mt-1 p-2 border rounded-lg text-sm" placeholder="e.g. en, hi" />
                        </div>
                        <div className="col-span-2">
                          <label className="text-xs text-slate-600">Description</label>
                          <textarea value={it.metadata.description} onChange={(e) => updateMetadata(i, 'description', e.target.value)} className="w-full mt-1 p-2 border rounded-lg text-sm" rows={3} />
                        </div>
                        <div className="col-span-2 flex items-center gap-2 mt-2">
                          <input id={`index_${i}`} checked={it.metadata.index} onChange={(e) => updateMetadata(i, 'index', e.target.checked)} type="checkbox" />
                          <label htmlFor={`index_${i}`} className="text-sm">Include this file in embeddings / indexing</label>
                        </div>
                      </div>
                    </div>
                  )}

                  {it.response && (
                    <pre className="mt-2 p-3 bg-slate-50 text-xs text-slate-700 rounded-2xl">{it.response}</pre>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-end gap-2 mt-4">
            <button onClick={uploadAll} className="px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition">Upload All</button>
          </div>
        </div>
      )}
    </section>
  </div>
</main>
  );
}
