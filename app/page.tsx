import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-normal text-gray-800 mb-2">
          Appointment App
        </h1>
        <p className="text-xl text-gray-600">
          The app for medical appointments
        </p>
      </div>

      <Card className="w-full max-w-3xl">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-6">
                Access the system as a<br />
                PATIENT clicking the
                <br />
                button below
              </h2>
              <Button
                asChild
                className="bg-sky-100 hover:bg-sky-200 text-gray-800 text-lg px-8 py-6 h-auto"
              >
                <Link href="/patient/scheduler">Access as patient</Link>
              </Button>
            </div>

            <div className="text-center pt-8 border-t md:border-t-0 md:border-l md:border-gray-200 md:pl-8 md:pt-0">
              <h2 className="text-xl font-semibold mb-6">
                Access the system as a<br />
                PROVIDER clicking the
                <br />
                button below
              </h2>
              <Button
                asChild
                className="bg-purple-100 hover:bg-purple-200 text-gray-800 text-lg px-8 py-6 h-auto"
              >
                <Link href="/provider/appointments">Access as provider</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
