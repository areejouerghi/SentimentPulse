import { FormEvent, useRef, useState } from "react";
import { api } from "../api/client";

export function ReviewForm({ onCreated }: { onCreated: () => void }) {
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await api.post("/reviews", { content, source: "manual" });
      setContent("");
      setStatus("Avis analysé !");
      onCreated();
    } catch {
      setStatus("Erreur lors de l'analyse");
    }
  };

  const handleImport = async () => {
    if (!fileInput.current?.files?.length) {
      return;
    }
    const formData = new FormData();
    formData.append("file", fileInput.current.files[0]);
    try {
      await api.post("/reviews/import", formData);
      setStatus("Import CSV réussi");
      onCreated();
      fileInput.current.value = "";
    } catch {
      setStatus("Import impossible");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          rows={4}
          placeholder="Saisir un avis client..."
          value={content}
          onChange={(event) => setContent(event.target.value)}
          className="mb-4"
        />
        <button type="submit" disabled={!content} className="btn btn-primary" style={{ width: '100%' }}>
          Analyser
        </button>
      </form>

      <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
        <h4 className="text-sm mb-4">Import CSV</h4>
        <div className="flex gap-2">
          <input ref={fileInput} type="file" accept=".csv" style={{ padding: '0.25rem' }} />
          <button className="btn btn-secondary btn-sm" onClick={handleImport}>
            Importer
          </button>
        </div>
      </div>
      {status && <p className="text-sm mt-4 text-green-600">{status}</p>}
    </>
  );
}
