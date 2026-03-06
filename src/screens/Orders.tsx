import { Link } from "react-router-dom"
import { NoOrders } from "../utils/images"

interface Order {
  id: string
  date: string
  total: number
  status: string
}

const orders = []

function Orders() {

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <img
          src={NoOrders}
          alt="no orders"
          className="w-50 mb-6"
        />

        <h2 className="text-2xl font-semibold mb-2">
          No Orders Yet
        </h2>

        <p className="text-gray-500 mb-6">
          Looks like you haven't placed any orders.
        </p>

        <Link
          to="/shop"
          className="bg-[var(--secondary-color)] text-white px-6 py-3 rounded-lg hover:bg-orange-400 transition"
        >
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">
        My Orders
      </h1>

      
        <div
          
          className="border rounded-lg p-4 mb-4 flex justify-between items-center"
        >
          <div>
            <p className="font-semibold">Order #{Date.now()}</p>
            <p className="text-sm text-gray-500">
              06/03/2026
            </p>
          </div>

          <div>
            <p className="font-semibold">$249.99</p>
            <p className="text-green-600 text-sm">
               Shipped
            </p>
          </div>
        </div>
 
    </div>
  )
}

export default Orders