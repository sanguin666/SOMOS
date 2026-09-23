import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useI18n } from '../i18n/I18nContext';
import { ApiError } from '../api/client';
import { LogoMark } from '../components/LogoMark';
import { LanguagePicker } from '../components/LanguagePicker';

export function LoginPage() {
  const { login } = useAuth();
  const { t } = useI18n();
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

  // The app's welcome screen: the logo and the words in a patch of white
  // light over the illustration, then one white form, the orange button
  // and the language row — nothing else to read and nothing to get wrong.
  return (
    <div className="login-page">
      <form className="login-panel" onSubmit={handleSubmit}>
        <LogoMark size={180} />
        <h1 className="login-wordmark">{t('login.heading')}</h1>
        <p className="login-subtitle">{t('login.subtitle')}</p>

        <div className="card form">
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
        </div>

        {error && <p className="error-text">{error}</p>}
        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? t('login.signingIn') : t('login.signIn')}
        </button>

        <LanguagePicker />
      </form>
    </div>
  );
}
