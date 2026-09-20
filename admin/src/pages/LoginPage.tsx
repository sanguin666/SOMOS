import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useI18n } from '../i18n/I18nContext';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../i18n/translations';
import { ApiError } from '../api/client';
import { LogoMark } from '../components/LogoMark';

const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  en: 'EN',
  es: 'ES',
  fr: 'FR',
};

export function LoginPage() {
  const { login } = useAuth();
  const { t, language, setLanguage } = useI18n();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('login.genericError'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <LogoMark size={44} />
        <h1>{t('login.heading')}</h1>
        <p className="muted" style={{ marginBottom: 20 }}>
          {t('login.subtitle')}
        </p>
        <form className="form" onSubmit={handleSubmit}>
          <label>
            {t('login.emailLabel')}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <label>
            {t('login.passwordLabel')}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? t('login.signingIn') : t('login.signIn')}
          </button>
        </form>

        <div className="login-language-switcher">
          {SUPPORTED_LANGUAGES.map((code) => (
            <button
              key={code}
              type="button"
              className={`lang-pill ${code === language ? 'lang-pill-active' : ''}`}
              onClick={() => setLanguage(code)}
            >
              {LANGUAGE_LABELS[code]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
