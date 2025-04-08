import { useState, useEffect } from "react";

type ApiResponse = {
  success: boolean;
  message: string;
  timestamp: string;
  headers: Record<string, string>;
};

export function CorsTest() {
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [directTestResult, setDirectTestResult] = useState<ApiResponse | null>(
    null
  );
  const [directTestError, setDirectTestError] = useState<string | null>(null);

  async function runCorsTest() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Test using our API client
      const response = await fetch("/api/cors-test");
      const data = (await response.json()) as ApiResponse;
      setResult(data);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      console.error("CORS test error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function runDirectTest() {
    setLoading(true);
    setDirectTestError(null);
    setDirectTestResult(null);

    try {
      // Test with direct fetch to Vercel deployment
      const response = await fetch(
        "https://table-football-tracker.vercel.app/api/cors-test"
      );
      const data = (await response.json()) as ApiResponse;
      setDirectTestResult(data);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setDirectTestError(errorMessage);
      console.error("Direct test error:", err);
    } finally {
      setLoading(false);
    }
  }

  // Run the CORS test on page load
  useEffect(() => {
    runCorsTest();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">CORS Test Page</h1>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Relative API Test</h2>
            <button
              onClick={runCorsTest}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md mb-4"
            >
              {loading ? "Testing..." : "Run Test"}
            </button>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            {result && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                <h3 className="font-bold mb-2">Test Results:</h3>
                <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Direct API Test</h2>
            <button
              onClick={runDirectTest}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md mb-4"
            >
              {loading ? "Testing..." : "Run Direct Test"}
            </button>

            {directTestError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{directTestError}</span>
              </div>
            )}

            {directTestResult && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                <h3 className="font-bold mb-2">Direct Test Results:</h3>
                <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
                  {JSON.stringify(directTestResult, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-bold mb-2">Browser Network Info:</h3>
            <pre className="bg-white p-4 rounded overflow-auto text-sm">
              {`User Agent: ${navigator.userAgent}
Location: ${window.location.href}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
