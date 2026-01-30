import { useState } from "react";
import { useForm } from "react-hook-form";
import { registerUser } from "../api/client";

type RegisterFormFields = {
    email: string;
    password: string;
    full_name: string;
};

interface Props {
    onSuccess: () => void;
    onSwitch: () => void;
}

export function RegisterForm({ onSuccess, onSwitch }: Props) {
    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<RegisterFormFields>();
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (values: RegisterFormFields) => {
        try {
            setError(null);
            await registerUser(values);
            alert("Compte créé avec succès ! Connectez-vous.");
            onSwitch();
        } catch (err: any) {
            console.error(err);
            const msg = err.response?.data?.detail || "Erreur lors de l'inscription";
            setError(String(msg));
        }
    };

    return (
        <div className="auth-page auth-page-gradient">
            <div className="auth-card">
                <div className="text-center mb-4">
                    <span className="brand-logo-large">🚀</span>
                    <h2 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>Rejoindre</h2>
                    <p className="text-muted">Créez votre compte gratuitement</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label>Nom complet</label>
                        <input
                            type="text"
                            placeholder="Jean Dupont"
                            {...register("full_name", { required: true })}
                            style={{ padding: '0.75rem' }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Email professionnel</label>
                        <input
                            type="email"
                            placeholder="nom@entreprise.com"
                            {...register("email", { required: true })}
                            style={{ padding: '0.75rem' }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Mot de passe</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                {...register("password", { required: true })}
                                style={{ padding: '0.75rem', paddingRight: '2.5rem' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '0.75rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '1.2rem',
                                    padding: 0,
                                    color: '#6B7280'
                                }}
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded text-sm text-center" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '0.875rem', fontSize: '1rem', marginTop: '1rem' }}
                    >
                        {isSubmitting ? "Création..." : "Commencer l'aventure"}
                    </button>

                    <div className="mt-4 text-center">
                        <p className="text-sm text-muted">
                            Déjà membre ?{' '}
                            <button type="button" onClick={onSwitch} style={{ background: "none", color: "var(--primary)", border: "none", cursor: "pointer", fontWeight: 600 }}>
                                Se connecter
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
