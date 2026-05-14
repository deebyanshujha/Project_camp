import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { KeyRound } from "lucide-react";
import { Button, Card, Input } from "../components/ui";
import { authAPI } from "../services";
import { useForm } from "../hooks";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");

  const {
    values,
    errors,
    handleChange,
    handleSubmit: handleFormSubmit,
    isSubmitting,
  } = useForm({ password: "", confirmPassword: "" }, async (formData) => {
    try {
      setErrorMsg("");

      if (formData.password !== formData.confirmPassword) {
        setErrorMsg("Passwords do not match");
        return;
      }

      await authAPI.resetPassword(token, { password: formData.password });
      toast.success("Password reset successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to reset password. Please try again.";
      setErrorMsg(message);
      toast.error(message);
    }
  });

  return (
    <div className="auth-stage min-h-screen flex items-center justify-center p-4">
      <div className="relative max-w-md w-full">
        <div className="text-center mb-8">
          <div className="brand-mark mx-auto mb-5">
            <KeyRound size={24} />
          </div>
          <h1 className="text-6xl font-doodle font-bold text-sketch-ink">
            New Password
          </h1>
          <p className="text-gray-700 mt-2 font-semibold">
            Pick a fresh key for your account.
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
              label="New Password"
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
              Reset Password
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

