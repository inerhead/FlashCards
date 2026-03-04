import { useState, type FormEvent } from "react";
import { useAuth } from "../contexts/AuthContext";
import t from "../i18n";
import s from "./AuthPage.module.css";

export default function ResetPassword() {
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);

  const confirmTouched = confirmPassword.length > 0;
  const passwordsMatch = password === confirmPassword;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch) return;

    setError("");
    setBusy(true);

    try {
      await updatePassword(password);
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.unexpectedError);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={s.backdrop}>
      <div className={s.card}>
        <span className={s.logo}>🔑</span>
        <h1 className={s.heading}>{t.resetPasswordTitle}</h1>
        <p className={s.sub}>{t.resetPasswordSubtitle}</p>

        {success ? (
          <p className={s.sub} style={{ color: "#4ADE80", marginTop: 12 }}>
            {t.resetPasswordSuccess}
          </p>
        ) : (
          <form className={s.form} onSubmit={handleSubmit}>
            {error && <div className={s.error}>{error}</div>}

            <div className={s.inputWrap}>
              <span className={s.inputIcon}>🔒</span>
              <input
                className={s.input}
                type="password"
                placeholder={t.newPasswordPlaceholder}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

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

            <button
              className={s.submit}
              type="submit"
              disabled={busy || !passwordsMatch || password.length === 0}
            >
              {busy ? t.submitLoading : t.resetPasswordSubmit}
            </button>
          </form>
        )}

        <p className={s.author}>Created by Gossio</p>
      </div>
    </div>
  );
}
