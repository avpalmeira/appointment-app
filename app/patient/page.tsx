import { Header } from "@/components/header";
import { AppointmentWidget } from "@/app/patient/components/appointment-widget";

// This would normally come from your authentication system
const MOCK_USER = {
  id: "1",
  name: "Joseph",
  role: "patient" as const,
};

export default function Home() {
  return (
    <div>
      <Header user={MOCK_USER} />
      <main className="container mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left column with text */}
          <div className="space-y-4 flex flex-col justify-between h-full">
            <h2 className="text-4xl text-gray-700 py-16">
              You can schedule new appointments
              <br />
              or manage existing ones
              <br />
              using the widget
            </h2>
            <p className="text-gray-600">Assigned provider: Doc. Stephen Z.</p>
          </div>

          {/* Right column with scheduler */}
          <AppointmentWidget />
        </div>
      </main>
    </div>
  );
}
