import React, { useState } from "react"

interface LoginCardProps {
  title: string
  subtitle: string
  emailLabel: string
  passwordLabel: string
  forgotPassword: string
  loginButton: string
  loggingIn: string
  onLogin: (username: string, password: string) => Promise<void>
  loading?: boolean
}

export const LoginCard: React.FC<LoginCardProps> = ({
  title,
  subtitle,
  emailLabel,
  passwordLabel,
  forgotPassword,
  loginButton,
  loggingIn,
  onLogin,
  loading = false,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div style={{
      width: "100%",
      maxWidth: 1080,
      background: "rgba(251, 240, 218, 0.2)",
      borderRadius: 32,
      boxShadow:
        "0 32px 96px 0 rgba(191,201,191,0.28), 0 0 120px 24px rgba(251,240,218,0.38)",
      margin: "0",
      border: "none",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "32px 32px",
      boxSizing: "border-box",
      minHeight: 320,
      maxHeight: 700,
    }}>
      <h2 className="text-xl font-serif mb-4 text-[#3C2B1C]">{subtitle}</h2>
      <form
        style={{ width: "100%", maxWidth: 600, margin: "0 auto" }}
        className="flex flex-col gap-2"
        onSubmit={e => {
          e.preventDefault();
          onLogin(username, password);
        }}
      >
        <div className="flex flex-col gap-2">
          <div>
            <label htmlFor="email" className="block text-base font-serif text-[#3C2B1C] mb-2">
              {emailLabel}
            </label>
            <input
              id="email"
              type="email"
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{
                background: "#EAE9D0",
                border: "none",
                borderRadius: 18,
                fontSize: 20,
                height: 56,
                width: "100%",
                padding: "0 20px",
              }}
              className="font-serif text-[#3C2B1C]"
            />
            <div className="text-right mt-2">
              <a href="/admin/forgot-password" className="text-xs text-[#3C2B1C] hover:underline">
                {forgotPassword}
              </a>
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-base font-serif text-[#3C2B1C] mb-2">
              {passwordLabel}
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{
                background: "#EAE9D0",
                border: "none",
                borderRadius: 18,
                fontSize: 20,
                height: 56,
                width: "100%",
                padding: "0 20px",
              }}
              className="font-serif text-[#3C2B1C]"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            background: "#BFC9BF",
            color: "#fff",
            borderRadius: 18,
            padding: "18px 0",
            fontSize: 22,
            fontWeight: 600,
            width: "33.33%",
            alignSelf: "left",
            border: "none",
            boxShadow: loading ? "none" : "0 6px 24px rgba(191,201,191,0.22)",
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
            marginTop: "32px",
          }}
          className="font-serif"
        >
          {loading ? loggingIn : loginButton}
        </button>
      </form>
    </div>
  );
};
