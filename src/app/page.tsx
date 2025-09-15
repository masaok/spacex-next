import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <main className="flex flex-col gap-8 items-center text-center">
        <h1 className="text-6xl font-bold">SpaceX Launch Tracker</h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Explore the latest SpaceX launches, missions, and rocket information using real-time data from the SpaceX GraphQL API.
        </p>

        <Link
          href="/launches"
          className="rounded-full bg-blue-600 text-white px-8 py-4 text-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          View Latest Launches
        </Link>
      </main>
    </div>
  );
}