export default function NotAllowed403() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4 text-red-500">403</h1>
                <p className="text-xl text-gray-600 mb-4">Access Denied: You don't have permission to view this page.</p>
                <a href="/" className="text-blue-500 hover:text-blue-700 underline">
                    Return to Home
                </a>
            </div>
        </div>
    );
}
