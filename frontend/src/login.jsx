import { useState } from "react";
import API, { setAuthToken } from "./api";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        const res = await API.post("/auth/login", { email, password });

        const token = res.data.access_token;
        localStorage.setItem("token", token);
        setAuthToken(token);
        setUser(true);
      } else {
        await API.post("/auth/register", { email, password });
        alert("Registered! Now login.");
        setIsLogin(true);
      }
    } catch (err) {
      alert("Error: " + (err.response?.data?.detail || "Something went wrong"));
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>{isLogin ? "Login" : "Register"}</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      /><br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      /><br /><br />

      <button onClick={handleSubmit}>
        {isLogin ? "Login" : "Register"}
      </button>

      <p style={{ cursor: "pointer", marginTop: "10px" }}
         onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Create account" : "Already have account? Login"}
      </p>
    </div>
  );
}