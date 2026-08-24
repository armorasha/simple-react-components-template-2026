import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router";
import AuthLayout from "../layouts/AuthLayout";
import Card from "./Card";
import Button from "./Button";
import { Heading2, Muted } from "./Typography";

// Root errorElement (see renderer.js) — catches any loader/render error or
// unmatched path anywhere in the router tree, so a failed fetch or a typo'd
// URL shows this instead of a blank screen.
export default function RouteError() {
  const error = useRouteError();
  const navigate = useNavigate();

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error?.message || "Something went wrong";

  return (
    <AuthLayout>
      <Card>
        <Heading2>Something went wrong</Heading2>
        <Muted>{message}</Muted>

        <div className="flex gap-3 mt-6">
          <Button variant="secondary" onClick={() => navigate(0)}>
            Retry
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate("/", { replace: true })}
          >
            Go home
          </Button>
        </div>
      </Card>
    </AuthLayout>
  );
}
