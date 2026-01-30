import { useEffect, useState } from "react";
import { getPublicForm, submitPublicReview, FeedbackFormType } from "../api/client";

export function PublicReviewPage({ uuid }: { uuid: string }) {
    const [form, setForm] = useState<FeedbackFormType | null>(null);
    const [content, setContent] = useState("");
    const [author, setAuthor] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        getPublicForm(uuid)
            .then(setForm)
            .catch(() => setError("Formulaire introuvable ou invalide."));
    }, [uuid]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        try {
            await submitPublicReview(uuid, { content, author });
            setSubmitted(true);
        } catch (err) {
            alert("Erreur lors de l'envoi de l'avis.");
        }
    };

    if (error) {
        return (
            <div className="flex items-center justify-between" style={{ height: "100vh", justifyContent: "center" }}>
                <p style={{ color: "var(--danger)" }}>{error}</p>
            </div>
        );
    }

    if (!form) {
        return <div className="p-4">Chargement...</div>;
    }

    if (submitted) {
        return (
            <div className="app-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="card" style={{ maxWidth: "600px", textAlign: "center" }}>
                    <h2 style={{ color: "var(--secondary)" }}>Merci !</h2>
                    <p>Votre avis a été enregistré avec succès.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="app-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="card" style={{ width: "100%", maxWidth: "600px" }}>
                <h2 className="text-center">{form.name}</h2>
                <p className="text-center text-muted mb-4">
                    {form.question || "Votre avis est précieux pour nous aider à améliorer ce service."}
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Votre Nom (Optionnel)</label>
                        <input
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>{form.question || "Votre Avis"}</label>
                        <textarea
                            required
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={5}
                            placeholder="Partagez votre expérience..."
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
                        Envoyer mon avis
                    </button>
                </form>
            </div>
        </div>
    );
}
