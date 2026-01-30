import { useEffect, useState } from "react";
import { fetchFormStats } from "../api/client";
import { Dashboard } from "./Dashboard";

type Props = {
    formId: number;
    onClose: () => void;
};

export function FormAnalytics({ formId, onClose }: Props) {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFormStats(formId)
            .then(setStats)
            .catch(() => alert("Erreur chargement stats"))
            .finally(() => setLoading(false));
    }, [formId]);

    if (loading) return <div className="p-4">Chargement...</div>;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button
                    onClick={onClose}
                    className="modal-close"
                >
                    ×
                </button>

                <h2>Statistiques du Formulaire</h2>

                {stats && (
                    <>
                        {/* We reuse the Dashboard component, but it has 'grid-2' which might look squashed if we don't handle it. 
                            However, the modal is wide, so it should be fine. */}
                        <Dashboard summary={stats} reviews={stats.latest_reviews} />

                        <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                            <h3>Derniers Avis Reçus</h3>
                            {stats.latest_reviews.length === 0 ? <p className="text-muted">Aucun avis pour le moment.</p> : (
                                <ul style={{ listStyle: "none", padding: 0 }}>
                                    {stats.latest_reviews.map((r: any) => (
                                        <li key={r.id} className="mb-4 pb-4" style={{ borderBottom: "1px solid var(--border)" }}>
                                            <div className="flex justify-between items-center mb-1">
                                                <strong>{r.author || "Anonyme"}</strong>
                                                <span className={`tag tag-${r.sentiment.toLowerCase()}`}>
                                                    {r.sentiment}
                                                </span>
                                            </div>
                                            <p className="text-sm" style={{ margin: 0 }}>{r.content}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
