import { useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import "./Login.css";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    // Mock login delay
    setTimeout(() => {
      setLoading(false);
      if (email === "demo@budgetr.com" && password === "password") {
        // Success: In a real app, set auth state here
        alert("Login successful! (Demo)");
      } else {
        setError("Invalid email or password.");
      }
    }, 1200);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Sign in to Budgetr</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            placeholder="you@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
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
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="show-password-toggle"
              onClick={() => setShowPassword(v => !v)}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        {error && <div className="login-error">{error}</div>}
        <button className="login-submit" type="submit" disabled={loading}>
          {loading ? "Signing in..." : <><LogIn size={18} /> Sign In</>}
        </button>
        <div className="login-demo-info">
          <span>Demo: demo@budgetr.com / password</span>
        </div>
      </form>
    </div>
  );
};