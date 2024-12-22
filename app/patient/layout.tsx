import { Header } from "@/components/header";
import NavLinks from "./components/nav-links";

// This would normally come from your authentication system
const MOCK_USER = {
  id: "1",
  name: "Joseph",
  role: "patient" as const,
};
const MOCK_PROVIDER = {
  id: "1",
  name: "Doctor Stephen Z.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header user={MOCK_USER} className="bg-sky-100" />
      <main className="container mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-4 flex flex-col justify-between h-full">
            <h2 className="text-4xl text-gray-700 py-16">
              You can schedule new appointments
              <br />
              or manage existing ones
              <br />
              using the widget
            </h2>
            <p className="text-gray-600">
              Assigned provider: {MOCK_PROVIDER.name}
            </p>
          </div>

          <div className="space-y-6">
            <NavLinks />

            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
