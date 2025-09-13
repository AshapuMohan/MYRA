export function UnauthenticatedView() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-purple-900">
      <div className="text-center text-white space-y-6">
        <h1 className="text-4xl font-bold mb-4">Voice Browser</h1>
        <p className="text-xl mb-8">Accessible Web Navigation</p>
        <div className="space-x-4">
          <a
            href="/account/signin"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Sign In
          </a>
          <a
            href="/account/signup"
            className="inline-block bg-white text-blue-900 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
