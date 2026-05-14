import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertCircle, CheckCircle, MailCheck } from "lucide-react";
import { Button, Card } from "../components/ui";
import { authAPI } from "../services";
import { toast } from "react-toastify";

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await authAPI.verifyEmail(token);
        setStatus("success");
        setMessage("Email verified successfully! Redirecting to login...");
        toast.success("Email verified successfully!");
        setTimeout(() => navigate("/login"), 2000);
      } catch (error) {
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "Email verification failed. Please try again.",
        );
        toast.error("Email verification failed");
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token, navigate]);

  return (
    <div className="auth-stage min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="tape">
          <div className="text-center space-y-6">
            {status === "loading" && (
              <>
                <div className="w-16 h-16 mx-auto animate-spin">
                  <div className="w-full h-full border-4 border-sketch-ink border-t-transparent rounded-full" />
                </div>
                <MailCheck size={54} className="mx-auto text-sketch-ink" />
                <p className="text-gray-700 font-semibold">Verifying your email...</p>
              </>
            )}

            {status === "success" && (
              <>
                <CheckCircle size={64} className="mx-auto text-sketch-success" />
                <h2 className="text-4xl font-doodle font-bold text-sketch-ink">
                  Email Verified!
                </h2>
                <p className="text-gray-700">{message}</p>
                <Button onClick={() => navigate("/login")} className="w-full">
                  Go to Login
                </Button>
              </>
            )}

            {status === "error" && (
              <>
                <AlertCircle size={64} className="mx-auto text-sketch-error" />
                <h2 className="text-4xl font-doodle font-bold text-sketch-ink">
                  Verification Failed
                </h2>
                <p className="text-gray-700">{message}</p>
                <Button
                  onClick={() => navigate("/login")}
                  variant="outline"
                  className="w-full"
                >
                  Return to Login
                </Button>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

