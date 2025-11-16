import { Routes, Route, Link, Navigate } from "react-router-dom";
import Login from "./features/auth/Login";
import Signup from "./features/auth/Signup";
import Forgot from "./features/auth/Forgot";
import ResetPassword from "./features/auth/ResetPassword";
import TodosPage from "./features/todos/TodosPage";
import Landing from "./pages/Landing";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import { useAuthStore } from "./store/authStore";
import { useLocation } from "react-router-dom";
import FloatingLines from "@/components/ui/FloatingLines";

function HomeGate() {
  const token = useAuthStore((s) => s.token);
  if (token) return <Navigate to="/todos" replace />;
  return <Landing />;
}

export default function App() {
  const token = useAuthStore((s) => s.token);
  const location = useLocation();
  const isHomeLoggedOut = location.pathname === "/" && !token;
  return (
    <div className="min-h-screen relative">
      {!isHomeLoggedOut && (
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <FloatingLines
            enabledWaves={["top", "middle", "bottom"]}
            lineCount={[10, 15, 20]}
            lineDistance={[8, 6, 4]}
            interactive={true}
            parallax={true}
            className="w-full h-full"
          />
        </div>
      )}
      <nav className="flex gap-3 mb-6 p-4">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
        <Link to="/todos">Todos</Link>
      </nav>
      <div className="p-4">
        <Routes>
          <Route path="/" element={<HomeGate />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route element={<ProtectedRoutes /> }>
            <Route path="/todos" element={<TodosPage />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}
