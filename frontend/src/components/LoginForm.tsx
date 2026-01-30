import { useState } from "react";
import { useForm } from "react-hook-form";
import { login } from "../api/client";

type LoginFormFields = {
  email: string;
  password: string;
};

interface Props {
  onSuccess: () => void;
  onSwitch: () => void;
}

export function LoginForm({ onSuccess, onSwitch }: Props) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormFields>();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (values: LoginFormFields) => {
    try {
      setError(null);
      await login(values);
      onSuccess();
    } catch {
      setError("Identifiants invalides");
    }
  };

  return (
    <div className="auth-page auth-page-gradient">
      <div className="auth-card">
        <div className="text-center mb-4">
          <span className="brand-logo-large">⚡</span>
          <h2 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>Bon retour</h2>
          <p className="text-muted">Connectez-vous à votre espace</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
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
            {isSubmitting ? "Chargement..." : "Se connecter"}
          </button>

          <div className="mt-4 text-center">
            <p className="text-sm text-muted">
              Vous n'avez pas de compte ?{' '}
              <button type="button" onClick={onSwitch} style={{ background: "none", color: "var(--primary)", border: "none", cursor: "pointer", fontWeight: 600 }}>
                Créer un compte
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
