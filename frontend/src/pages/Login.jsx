import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ClipboardList, Lock, Mail } from "lucide-react";
import { Button, Card, Input } from "../components/ui";
import { useAuthStore } from "../store";
import { useForm } from "../hooks";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [errorMsg, setErrorMsg] = useState("");

  const {
    values,
    errors,
    handleChange,
    handleSubmit: handleFormSubmit,
    isSubmitting,
  } = useForm({ email: "", password: "" }, async (formData) => {
    try {
      setErrorMsg("");
      await login(formData);
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      setErrorMsg(message);
      toast.error(message);
    }
  });

  return (
    <div className="auth-stage min-h-screen flex items-center justify-center p-4">
      <span className="doodle-orbit -left-16 top-20 hidden md:block" />
      <span className="doodle-star right-16 bottom-20 hidden md:block" />
      <div className="relative max-w-md w-full">
        <div className="text-center mb-8">
          <div className="brand-mark mx-auto mb-5">
            <ClipboardList size={24} />
          </div>
          <h1 className="text-6xl font-doodle font-bold text-sketch-ink">
            ProjectCamp
          </h1>
          <p className="text-gray-700 mt-2 font-semibold">
            Pull your team back onto the same page.
          </p>
        </div>

        <Card className="tape">
          <form onSubmit={handleFormSubmit} className="space-y-6">
            {errorMsg && (
              <div className="p-4 bg-[#FFE0DC] border-2 border-sketch-ink rounded-xl text-red-800 text-sm font-semibold">
                {errorMsg}
              </div>
            )}

            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="you@camp.dev"
              value={values.email}
              onChange={handleChange}
              error={errors.email}
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Your secret passphrase"
              value={values.password}
              onChange={handleChange}
              error={errors.password}
              required
            />

            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              <Lock size={18} /> Sign in
            </Button>

            <Link
              to="/forgot-password"
              className="text-sketch-primary hover:text-sketch-secondary font-black text-center block"
            >
              Forgot password?
            </Link>
          </form>

          <div className="mt-8 pt-6 border-t-2 border-dashed border-sketch-ink text-center">
            <p className="text-gray-600">No camp badge yet?</p>
            <Link
              to="/register"
              className="text-sketch-ink hover:text-sketch-primary font-black transition"
            >
              Create an account
            </Link>
          </div>
        </Card>

        <p className="text-center text-gray-700 text-sm mt-7 font-semibold">
          <Mail size={16} className="inline mr-1" />
          Your workspace stays private.
        </p>
      </div>
    </div>
  );
}

