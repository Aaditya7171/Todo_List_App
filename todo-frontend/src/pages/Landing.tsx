import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-2xl text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-semibold">Your tasks. Clear and simple.</h1>
        <p className="text-base md:text-lg text-gray-300">
          Create, update, and manage your daily todos with a clean interface designed for focus.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            to="/login"
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-900 bg-white hover:bg-gray-50"
          >
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
}
