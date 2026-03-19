import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { AdminPage } from "./pages/AdminPage";
import { HomePage } from "./pages/HomePage";

const queryClient = new QueryClient();

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-background flex flex-col">
      <Outlet />
    </div>
  ),
});

const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "layout",
  component: () => (
    <>
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/",
  component: HomePage,
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : undefined,
    category: typeof search.category === "string" ? search.category : undefined,
  }),
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  layoutRoute.addChildren([homeRoute]),
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  );
}
