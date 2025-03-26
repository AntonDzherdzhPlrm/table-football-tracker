import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="min-h-full flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        404 - Page Not Found
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex space-x-4">
        <Link
          to="/"
          className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-md"
        >
          Go to Individual Matches
        </Link>
        <Link
          to="/team"
          className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-md"
        >
          Go to Team Matches
        </Link>
      </div>
    </div>
  );
}
