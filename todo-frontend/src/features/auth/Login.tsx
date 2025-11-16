import { useForm } from "react-hook-form";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

type FormValues = { email: string; password: string };

export default function Login() {
  const { register, handleSubmit } = useForm<FormValues>();
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const onSubmit = async (values: FormValues) => {
    const res = await api.post<{ token: string; user: { id: string; email: string; name?: string } }>(
      "/auth/login",
      values
    );
    setAuth(res.token, res.user);
    navigate("/todos", { replace: true });
  };

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-xl font-semibold mb-4">Login</h1>
      <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Email" type="email" id="email" {...register("email", { required: true })} />
        <Input label="Password" type="password" id="password" {...register("password", { required: true })} />
        <Button type="submit">Sign in</Button>
      </form>
      <div className="mt-3 text-sm">
        <Link to="/forgot" className="text-blue-600">Forgot password?</Link>
      </div>
    </div>
  );
}