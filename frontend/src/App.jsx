import { useEffect, useState } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";
import { setAuthToken } from "./api";

export default function App() {
  const [user, setUser] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
      setUser(true);
    }
  }, []);

  return user ? <Dashboard /> : <Login setUser={setUser} />;
}