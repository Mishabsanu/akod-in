import { Compass } from "lucide-react";
import EmptyState from "@/components/EmptyState";

export default function NotFound() {
  return (
    <EmptyState
      icon={Compass}
      title="Page not found"
      text="The page you're looking for has moved or no longer exists."
      action={{ href: "/", label: "Back to home" }}
    />
  );
}
