type AuthFormProps = {
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
  passwordAutoComplete: "new-password" | "current-password";
};

export function AuthForm({
  action,
  submitLabel,
  passwordAutoComplete,
}: AuthFormProps) {
  return (
    <form action={action} className="flex max-w-sm flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        Email
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="border border-ink/20 bg-white px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Contraseña
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete={passwordAutoComplete}
          className="border border-ink/20 bg-white px-3 py-2"
        />
      </label>
      <button
        type="submit"
        className="self-start underline decoration-ink/30 underline-offset-4"
      >
        {submitLabel}
      </button>
    </form>
  );
}
