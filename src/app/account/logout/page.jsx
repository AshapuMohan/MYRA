import useAuth from "@/utils/useAuth";

function MainComponent() {
  const { signOut } = useAuth();
  
  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };
  
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl border-2 border-yellow-400">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Voice Browser
          </h1>
          <p className="text-lg text-gray-600">Sign Out</p>
        </div>

        <div className="text-center space-y-6">
          <p className="text-lg text-gray-700">
            Are you sure you want to sign out of Voice Browser?
          </p>
          
          <button
            onClick={handleSignOut}
            className="w-full rounded-lg bg-red-600 px-4 py-4 text-lg font-bold text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 border-2 border-red-800"
            aria-label="Sign out of Voice Browser"
          >
            Sign Out
          </button>
          
          <a
            href="/"
            className="block w-full rounded-lg bg-gray-200 px-4 py-4 text-lg font-bold text-gray-800 transition-colors hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300 border-2 border-gray-400 text-center"
          >
            Cancel
          </a>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;