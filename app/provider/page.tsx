import { Header } from "@/components/header";
import { AppointmentsList } from "./components/appointments-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
          {/* Left column with text */}
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

          {/* Right column with appointments list */}
          <div className="space-y-6">
            <div className="flex gap-4">
              <Button asChild variant="outline">
                <Link href="/provider/time-slots">Manage Time Slots</Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                className="bg-purple-100 hover:bg-purple-200"
              >
                <Link href="/provider">Manage Appointments</Link>
              </Button>
            </div>

            <AppointmentsList />
          </div>
        </div>
      </main>
    </div>
  );
}
