import { useEffect, useState } from "react";
import { fetchForms, createForm, deleteForm, FeedbackFormType } from "../api/client";
import { FormAnalytics } from "./FormAnalytics";
import { Pagination } from "./Pagination";

export function FormsManager() {
    const [forms, setForms] = useState<FeedbackFormType[]>([]);
    const [newFormName, setNewFormName] = useState("");
    const [newFormQuestion, setNewFormQuestion] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [selectedFormId, setSelectedFormId] = useState<number | null>(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const loadForms = async () => {
        try {
            const data = await fetchForms();
            setForms(data);
        } catch (err) {
            console.error("Failed to load forms", err);
        }
    };

    useEffect(() => {
        loadForms();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newFormName.trim()) return;
        try {
            await createForm(newFormName, newFormQuestion || "Votre avis ?");
            setNewFormName("");
            setNewFormQuestion("");
            setIsCreating(false);
            loadForms();
        } catch (err) {
            alert("Failed to create form");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce formulaire ?")) return;
        try {
            await deleteForm(id);
            loadForms();
        } catch (err) {
            alert("Impossible de supprimer le formulaire.");
        }
    };

    const copyLink = (uuid: string) => {
        const url = `${window.location.origin}/collect/${uuid}`;
        navigator.clipboard.writeText(url);
        alert("Lien copié !");
    };

    const totalPages = Math.ceil(forms.length / itemsPerPage);
    const displayedForms = forms.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 style={{ margin: 0 }}>Formulaires</h3>
                <button className="btn btn-primary btn-sm" onClick={() => setIsCreating(!isCreating)}>
                    {isCreating ? "Annuler" : "Nouveau"}
                </button>
            </div>

            {isCreating && (
                <form onSubmit={handleCreate} className="mb-4 p-4 border rounded" style={{ borderColor: "var(--border)" }}>
                    <div className="form-group">
                        <label>Nom du formulaire</label>
                        <input
                            type="text"
                            placeholder="ex: Service Client"
                            value={newFormName}
                            onChange={(e) => setNewFormName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Question personnalisée (Optionnel)</label>
                        <input
                            type="text"
                            placeholder="ex: Qu'avez-vous pensé de l'accueil ?"
                            value={newFormQuestion}
                            onChange={(e) => setNewFormQuestion(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Créer</button>
                </form>
            )}

            {forms.length === 0 ? (
                <p className="text-muted">Aucun formulaire créé.</p>
            ) : (
                <>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Question</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedForms.map((form) => (
                                    <tr key={form.id}>
                                        <td>
                                            <div style={{ fontWeight: 500 }}>{form.name}</div>
                                            <a href={`/collect/${form.uuid}`} target="_blank" rel="noreferrer" className="text-sm" style={{ color: 'var(--primary)' }}>
                                                Lien public ↗
                                            </a>
                                        </td>
                                        <td className="text-sm text-muted">{form.question}</td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button onClick={() => setSelectedFormId(form.id)} className="btn btn-secondary btn-sm">
                                                    Stats
                                                </button>
                                                <button onClick={() => copyLink(form.uuid)} className="btn btn-secondary btn-sm">
                                                    Copier
                                                </button>
                                                <button onClick={() => handleDelete(form.id)} className="btn btn-danger btn-sm">
                                                    Suppr.
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}

            {selectedFormId && (
                <FormAnalytics formId={selectedFormId} onClose={() => setSelectedFormId(null)} />
            )}
        </div>
    );
}
