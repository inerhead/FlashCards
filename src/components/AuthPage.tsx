import { useState, type FormEvent } from "react";
import { useAuth } from "../contexts/AuthContext";
import t from "../i18n";
import s from "./AuthPage.module.css";

export default function AuthPage() {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const confirmTouched = confirmPassword.length > 0;
  const passwordsMatch = password === confirmPassword;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isRegister && !passwordsMatch) return;

    setError("");
    setBusy(true);

    try {
      if (isRegister) {
        await register(username, password);
      } else {
        await login(username, password);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.unexpectedError);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={s.backdrop}>
      <div className={s.card}>
        <span className={s.logo}>🃏</span>
        <h1 className={s.heading}>English Flash Cards</h1>
        <p className={s.sub}>
          {isRegister ? t.authSubtitleRegister : t.authSubtitleLogin}
        </p>

        <form className={s.form} onSubmit={handleSubmit}>
          {error && <div className={s.error}>{error}</div>}

          <div className={s.inputWrap}>
            <span className={s.inputIcon}>👤</span>
            <input
              className={s.input}
              type="text"
              placeholder={t.usernamePlaceholder}
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className={s.inputWrap}>
            <span className={s.inputIcon}>🔒</span>
            <input
              className={s.input}
              type="password"
              placeholder={t.passwordPlaceholder}
              autoComplete={isRegister ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {isRegister && (
            <div>
              <div className={s.inputWrap}>
                <span className={s.inputIcon}>🔒</span>
                <input
                  className={
                    !confirmTouched ? s.input
                      : passwordsMatch ? s.inputMatch
                      : s.inputMismatch
                  }
                  type="password"
                  placeholder={t.confirmPasswordPlaceholder}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              {confirmTouched && (
                <p className={passwordsMatch ? s.matchHintOk : s.matchHintBad}>
                  {passwordsMatch ? t.passwordsMatch : t.passwordsMismatch}
                </p>
              )}
            </div>
          )}

          <button className={s.submit} type="submit" disabled={busy || (isRegister && !passwordsMatch)}>
            {busy ? t.submitLoading : isRegister ? t.submitRegister : t.submitLogin}
          </button>
        </form>

        <p className={s.toggle}>
          {isRegister ? t.alreadyHaveAccount : t.noAccount}
          <button
            className={s.toggleLink}
            type="button"
            onClick={() => {
              setIsRegister((r) => !r);
              setError("");
              setConfirmPassword("");
            }}
          >
            {isRegister ? t.switchToLogin : t.switchToRegister}
          </button>
        </p>
        <p className={s.author}>Created by Gossio</p>
      </div>
    </div>
  );
}
