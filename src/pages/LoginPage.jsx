import { useAuth } from "../context/AuthContext.jsx";

export function LoginPage() {
  const { loginWithGoogle } = useAuth();

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: "80vh" }}
    >
      <h2 className="mb-4">Welcome to Comyxius</h2>
      <p className="text-muted mb-4">Sign in to access the full catalog</p>
      <button className="btn btn-warning px-4 py-2" onClick={loginWithGoogle}>
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google"
          style={{ width: "20px", marginRight: "10px" }}
        />
        Sign in with Google
      </button>

      <p className="text-muted mt-4" style={{ fontSize: "0.8rem" }}>
        By signing in, you agree to our{" "}
        <a href="#NAV_TERMS" style={{ color: "#d4a520" }}>
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#NAV_PRIVACY" style={{ color: "#d4a520" }}>
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
