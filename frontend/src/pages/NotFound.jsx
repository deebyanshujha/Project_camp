import { Link } from "react-router-dom";
import { MapPinned } from "lucide-react";
import { Button, Card } from "../components/ui";

export default function NotFound() {
  return (
    <div className="auth-stage min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <Card className="tape">
          <MapPinned size={64} className="mx-auto mb-4 text-sketch-ink" />
          <h1 className="text-6xl font-doodle font-bold text-sketch-ink mb-2">404</h1>
          <p className="text-gray-700 font-semibold mb-8">
            This page wandered off the project map.
          </p>
          <Link to="/">
            <Button className="w-full">Go Home</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}

