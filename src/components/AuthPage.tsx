import { useState, type FormEvent } from "react";
import { useAuth } from "../contexts/AuthContext";
import t from "../i18n";
import s from "./AuthPage.module.css";

export default function AuthPage() {
  const { login, register, resetPassword } = useAuth();
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  const isRegister = mode === "register";
  const isForgot = mode === "forgot";
  const confirmTouched = confirmPassword.length > 0;
  const passwordsMatch = password === confirmPassword;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isRegister && !passwordsMatch) return;

    setError("");
    setInfo("");
    setBusy(true);

    try {
      if (isForgot) {
        await resetPassword(email);
        setInfo(t.resetEmailSent);
      } else if (isRegister) {
        await register(email, password, displayName);
      } else {
        await login(email, password);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.unexpectedError);
    } finally {
      setBusy(false);
    }
  };

  const switchMode = (newMode: "login" | "register" | "forgot") => {
    setMode(newMode);
    setError("");
    setInfo("");
    setConfirmPassword("");
  };

  const subtitle = isForgot
    ? t.forgotPasswordSubtitle
    : isRegister
      ? t.authSubtitleRegister
      : t.authSubtitleLogin;

  return (
    <div className={s.backdrop}>
      <div className={s.card}>
        <span className={s.logo}>🃏</span>
        <h1 className={s.heading}>English Flash Cards</h1>
        <p className={s.sub}>{subtitle}</p>

        <form className={s.form} onSubmit={handleSubmit}>
          {error && <div className={s.error}>{error}</div>}
          {info && (
            <div className={s.error} style={{ background: "#065F4640", borderColor: "#10B98140", color: "#6EE7B7" }}>
              {info}
            </div>
          )}

          <div className={s.inputWrap}>
            <span className={s.inputIcon}>✉️</span>
            <input
              className={s.input}
              type="email"
              placeholder={t.emailPlaceholder}
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {isRegister && (
            <div className={s.inputWrap}>
              <span className={s.inputIcon}>👤</span>
              <input
                className={s.input}
                type="text"
                placeholder={t.displayNamePlaceholder}
                autoComplete="name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>
          )}

          {!isForgot && (
            <>
              <div className={s.inputWrap}>
                <span className={s.inputIcon}>🔒</span>
                <input
                  className={s.input}
                  type="password"
                  placeholder={t.passwordPlaceholder}
                  autoComplete={isRegister ? "new-password" : "current-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
            </>
          )}

          <button
            className={s.submit}
            type="submit"
            disabled={busy || (isRegister && !passwordsMatch)}
          >
            {busy
              ? t.submitLoading
              : isForgot
                ? t.sendResetLink
                : isRegister
                  ? t.submitRegister
                  : t.submitLogin}
          </button>
        </form>

        {!isForgot && !isRegister && (
          <p className={s.toggle}>
            <button
              className={s.toggleLink}
              type="button"
              onClick={() => switchMode("forgot")}
            >
              {t.forgotPassword}
            </button>
          </p>
        )}

        <p className={s.toggle}>
          {isForgot ? (
            <>
              {t.rememberPassword}
              <button
                className={s.toggleLink}
                type="button"
                onClick={() => switchMode("login")}
              >
                {t.switchToLogin}
              </button>
            </>
          ) : isRegister ? (
            <>
              {t.alreadyHaveAccount}
              <button
                className={s.toggleLink}
                type="button"
                onClick={() => switchMode("login")}
              >
                {t.switchToLogin}
              </button>
            </>
          ) : (
            <>
              {t.noAccount}
              <button
                className={s.toggleLink}
                type="button"
                onClick={() => switchMode("register")}
              >
                {t.switchToRegister}
              </button>
            </>
          )}
        </p>
        <p className={s.author}>Created by Gossio</p>
      </div>
    </div>
  );
}
