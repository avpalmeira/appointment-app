import { Header } from "@/components/header";
import { ProviderWidget } from "./components/provider-widget";

// This would normally come from your authentication system
const MOCK_USER = {
  id: "doc-1",
  name: "Doctor Stephen Z.",
  role: "provider" as const,
};

export default function ProviderPage() {
  return (
    <div>
      <Header user={MOCK_USER} className="bg-purple-100" />
      <main className="container mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-4 flex flex-col justify-between h-full">
            <h2 className="text-4xl text-gray-700 py-16">
              Manage all your
              <br />
              scheduled appointments and
              <br />
              your available time slots using
              <br />
              the widget
            </h2>
          </div>

          <ProviderWidget />
        </div>
      </main>
    </div>
  );
}
