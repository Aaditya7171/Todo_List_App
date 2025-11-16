import { useForm } from "react-hook-form";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

type FormValues = { name?: string; email: string; password: string };

export default function Signup() {
  const { register, handleSubmit } = useForm<FormValues>();
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const onSubmit = async (values: FormValues) => {
    const res = await api.post<{ token: string; user: { id: string; email: string; name?: string } }>(
      "/auth/signup",
      values
    );
    setAuth(res.token, res.user);
    navigate("/todos", { replace: true });
  };

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-xl font-semibold mb-4">Create account</h1>
      <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Name" id="name" {...register("name")} />
        <Input label="Email" type="email" id="email" {...register("email", { required: true })} />
        <Input label="Password" type="password" id="password" {...register("password", { required: true })} />
        <Button type="submit">Sign up</Button>
      </form>
    </div>
  );
}
