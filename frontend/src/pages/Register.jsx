import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ClipboardList, UserPlus } from "lucide-react";
import { Button, Card, Input } from "../components/ui";
import { useAuthStore } from "../store";
import { useForm } from "../hooks";
import { toast } from "react-toastify";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuthStore();
  const [errorMsg, setErrorMsg] = useState("");

  const {
    values,
    errors,
    handleChange,
    handleSubmit: handleFormSubmit,
    isSubmitting,
  } = useForm({ username: "", email: "", password: "", confirmPassword: "" }, async (formData) => {
    try {
      setErrorMsg("");

      if (formData.password !== formData.confirmPassword) {
        setErrorMsg("Passwords do not match");
        return;
      }

      const { confirmPassword, ...submitData } = formData;
      await register(submitData);
      toast.success("Registration successful! Please verify your email.");
      navigate("/login");
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed. Please try again.";
      setErrorMsg(message);
      toast.error(message);
    }
  });

  return (
    <div className="auth-stage min-h-screen flex items-center justify-center p-4">
      <span className="doodle-star left-16 bottom-16 hidden md:block" />
      <span className="doodle-orbit -right-16 top-20 hidden md:block" />
      <div className="relative max-w-md w-full">
        <div className="text-center mb-8">
          <div className="brand-mark mx-auto mb-5">
            <ClipboardList size={24} />
          </div>
          <h1 className="text-6xl font-doodle font-bold text-sketch-ink">
            Join ProjectCamp
          </h1>
          <p className="text-gray-700 mt-2 font-semibold">
            Sketch out projects, tasks, notes, and teammates.
          </p>
        </div>

        <Card className="tape">
          <form onSubmit={handleFormSubmit} className="space-y-5">
            {errorMsg && (
              <div className="p-4 bg-[#FFE0DC] border-2 border-sketch-ink rounded-xl text-red-800 text-sm font-semibold">
                {errorMsg}
              </div>
            )}

            <Input
              label="Username"
              name="username"
              type="text"
              placeholder="jane-doe"
              value={values.username}
              onChange={handleChange}
              error={errors.username}
              required
            />

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
              placeholder="Make it memorable"
              value={values.password}
              onChange={handleChange}
              error={errors.password}
              required
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="One more time"
              value={values.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
            />

            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              <UserPlus size={18} /> Create account
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t-2 border-dashed border-sketch-ink text-center">
            <p className="text-gray-600">Already have an account?</p>
            <Link
              to="/login"
              className="text-sketch-ink hover:text-sketch-primary font-black transition"
            >
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

