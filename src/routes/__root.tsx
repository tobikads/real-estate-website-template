import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { REALTOR_PROFILE } from "@/data/realtor-profile";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

const SOCIAL_PREVIEW_IMAGE =
  "https://raw.githubusercontent.com/tobikads/real-estate-website-template/demo/savannah-lavender/src/assets/Alexandra/alexandra-portrait.jpg";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${REALTOR_PROFILE.name} | ${REALTOR_PROFILE.title} in ${REALTOR_PROFILE.location}` },
      {
        name: "description",
        content:
          `${REALTOR_PROFILE.name} is a trusted ${REALTOR_PROFILE.location} real estate agent helping buyers, sellers, and curious neighbors take one calm, clear step at a time.`,
      },
      { name: "author", content: `${REALTOR_PROFILE.name}` },
      { property: "og:title", content: `${REALTOR_PROFILE.name} | Real Estate Agent in ${REALTOR_PROFILE.location}` },
      {
        property: "og:description",
        content: "Personal, calm, premium real estate guidance in Atlanta, Georgia.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: SOCIAL_PREVIEW_IMAGE },
      { property: "og:image:secure_url", content: SOCIAL_PREVIEW_IMAGE },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1024" },
      { property: "og:image:height", content: "1024" },
      {
        property: "og:image:alt",
        content: "Professional real estate agent portrait",
      },
      { name: "twitter:title", content: `${REALTOR_PROFILE.name} | Real Estate Agent in ${REALTOR_PROFILE.location}` },
      { name: "description", content: `${REALTOR_PROFILE.name}: ${REALTOR_PROFILE.location} is a premium realtor website showcasing ${REALTOR_PROFILE.location} properties and services.` },
      { property: "og:description", content: `${REALTOR_PROFILE.name}: ${REALTOR_PROFILE.location} is a premium realtor website showcasing ${REALTOR_PROFILE.location} properties and services.` },
      { name: "twitter:description", content: `${REALTOR_PROFILE.name}: ${REALTOR_PROFILE.location} is a premium realtor website showcasing ${REALTOR_PROFILE.location} properties and services.` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: SOCIAL_PREVIEW_IMAGE },
      {
        name: "twitter:image:alt",
        content: "Professional real estate agent portrait",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Inter:wght@300;400;500;600&display=swap",
      },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
