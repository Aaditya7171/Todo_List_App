import { useForm } from "react-hook-form";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { api } from "@/lib/api";
import { useState } from "react";

type FormValues = { email: string };

export default function Forgot() {
  const { register, handleSubmit } = useForm<FormValues>();
  const [sent, setSent] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      const res = await api.post<{ ok: boolean; preview?: string }>("/auth/forgot", values);
      setSent(true);
      setPreviewUrl(res.preview ?? null);
    } catch (e: any) {
      // Show specific message from backend (e.error) if provided
      setError(e?.error || "Unable to send reset link right now");
    }
  };

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-xl font-semibold mb-4">Forgot password</h1>
      <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Email" type="email" id="email" {...register("email", { required: true })} />
        <Button type="submit">Send reset link</Button>
      </form>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      {sent && (
        <div className="text-sm text-green-600 mt-2 space-y-1">
          <p>If the email exists, a reset link has been sent.</p>
          {previewUrl && (
            <p>
              Preview (Ethereal): {""}
              <a href={previewUrl} target="_blank" rel="noreferrer" className="underline text-blue-600">
                Open email
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
