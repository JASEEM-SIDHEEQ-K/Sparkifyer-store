import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold text-blue-700">404</h1>
      <p className="text-slate-500 text-lg">Page not found!</p>
      <Link
        to="/"
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Go Home
      </Link>
    </div>
  );
};
export default NotFound;