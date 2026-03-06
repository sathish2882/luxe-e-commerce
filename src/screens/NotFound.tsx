import { Link } from "react-router-dom"
import { NotFoundImg } from "../utils/images"

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      
      <img src={NotFoundImg} alt="not found" className="w-50 mb-6" />

      <h2 className="text-2xl font-semibold mb-3">
        Page Not Found
      </h2>

      <p className="text-gray-500 mb-6">
        The page you are looking for doesn't exist.
      </p>

      <Link
        to="/"
        className="bg-[var(--secondary-color)] text-white px-6 py-3 rounded-lg hover:bg-orange-400 transition"
      >
        Go Back Home
      </Link>

    </div>
  )
}

export default NotFound