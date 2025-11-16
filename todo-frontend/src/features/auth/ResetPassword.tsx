import { useForm } from "react-hook-form";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

type FormValues = { token: string; password: string };

export default function ResetPassword() {
  const { register, handleSubmit, setValue } = useForm<FormValues>();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) setValue("token", token);
  }, [searchParams, setValue]);

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      await api.post("/auth/reset", values);
      setDone(true);
    } catch (e: any) {
      setError(e?.error || "Reset failed");
    }
  };

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-xl font-semibold mb-4">Reset password</h1>
      <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Token" id="token" {...register("token", { required: true })} />
        <Input label="New password" type="password" id="password" {...register("password", { required: true })} />
        <Button type="submit">Reset</Button>
      </form>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      {done && <p className="text-green-600 text-sm mt-2">Password reset successful. You can now log in.</p>}
    </div>
  );
}
