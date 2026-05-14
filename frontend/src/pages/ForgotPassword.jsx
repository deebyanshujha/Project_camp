import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Send } from "lucide-react";
import { Button, Card, Input } from "../components/ui";
import { authAPI } from "../services";
import { useForm } from "../hooks";
import { toast } from "react-toastify";

export default function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);

  const {
    values,
    handleChange,
    handleSubmit: handleFormSubmit,
    isSubmitting,
  } = useForm({ email: "" }, async (formData) => {
    try {
      await authAPI.forgotPassword(formData.email);
      setSubmitted(true);
      toast.success("Password reset link sent to your email!");
    } catch (error) {
      toast.error("Failed to send reset link. Please try again.");
    }
  });

  return (
    <div className="auth-stage min-h-screen flex items-center justify-center p-4">
      <div className="relative max-w-md w-full">
        <div className="text-center mb-8">
          <div className="brand-mark mx-auto mb-5">
            <Mail size={24} />
          </div>
          <h1 className="text-6xl font-doodle font-bold text-sketch-ink">
            Reset Password
          </h1>
          <p className="text-gray-700 mt-2 font-semibold">
            We'll send you a reset link.
          </p>
        </div>

        <Card className="tape">
          {!submitted ? (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="you@camp.dev"
                value={values.email}
                onChange={handleChange}
                required
              />

              <Button type="submit" className="w-full" isLoading={isSubmitting}>
                <Send size={18} /> Send Reset Link
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <Mail size={60} className="mx-auto text-sketch-ink" />
              <h2 className="text-3xl font-doodle font-bold text-sketch-ink">
                Check your email
              </h2>
              <p className="text-gray-700">
                We sent a password reset link to your inbox.
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setSubmitted(false)}
              >
                Send Another Link
              </Button>
            </div>
          )}

          <div className="mt-8 pt-6 border-t-2 border-dashed border-sketch-ink text-center">
            <Link
              to="/login"
              className="text-sketch-primary hover:text-sketch-secondary font-black"
            >
              Back to login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

