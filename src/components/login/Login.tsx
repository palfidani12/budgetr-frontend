import { useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import "./Login.css";
import { useAuth } from "../../hooks/auth";
import { useNavigate } from "react-router";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login, isLoading, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    await login(email, password);

    if (isLoggedIn) {
      navigate("/");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2 className="login-title">Sign in to BudgetR</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-input-wrapper">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="show-password-toggle"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        {error && <div className="login-error">{error}</div>}
        <button
          className="login-submit"
          type="submit"
          disabled={isLoading}
          onClick={handleSubmit}
        >
          {isLoading ? (
            "Signing in..."
          ) : (
            <>
              <LogIn size={18} /> Sign In
            </>
          )}
        </button>
      </div>
    </div>
  );
};
