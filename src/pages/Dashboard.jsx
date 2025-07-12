"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

const Dashboard = () => {
  const [user, setUser] = useState(null)
  const [myItems, setMyItems] = useState([])
  const [mySwaps, setMySwaps] = useState([])
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      navigate("/login")
      return
    }

    setUser(JSON.parse(userData))
    fetchDashboardData()
  }, [navigate])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token")

      // Fetch user profile to get updated points
      const profileResponse = await fetch("http://localhost:5328/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const profileData = await profileResponse.json()

      if (profileData.success) {
        setUser(profileData.user)
        localStorage.setItem("user", JSON.stringify(profileData.user))
      }

      // Fetch user's items
      const itemsResponse = await fetch("http://localhost:5328/api/items/my-items", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const itemsData = await itemsResponse.json()

      if (itemsData.success) {
        setMyItems(itemsData.items)
      }

      // Fetch user's swaps
      const swapsResponse = await fetch("http://localhost:5328/api/swaps/my-swaps", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const swapsData = await swapsResponse.json()

      if (swapsData.success) {
        setMySwaps(swapsData.swaps)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast.error("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const handleSwapResponse = async (swapId, action) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:5328/api/swaps/${swapId}/respond`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(`Swap ${action}ed successfully`)
        fetchDashboardData()
      } else {
        toast.error(data.error || `Failed to ${action} swap`)
      }
    } catch (error) {
      console.error(`Error ${action}ing swap:`, error)
      toast.error(`Failed to ${action} swap`)
    }
  }

  const handleCompleteSwap = async (swapId) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:5328/api/swaps/${swapId}/complete`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (data.success) {
        toast.success(data.message)
        fetchDashboardData()
      } else {
        toast.error(data.error || "Failed to complete swap")
      }
    } catch (error) {
      console.error("Error completing swap:", error)
      toast.error("Failed to complete swap")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const pendingItems = myItems.filter((item) => item.status === "pending")
  const approvedItems = myItems.filter((item) => item.status === "approved")
  const pendingSwaps = mySwaps.filter((swap) => swap.status === "pending")
  const activeSwaps = mySwaps.filter((swap) => swap.status === "accepted")

  return (
    <div className="max-w-6xl mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user.name}!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">P</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600">Points Balance</p>
              <p className="text-2xl font-bold text-green-900">{user.points}</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">I</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">My Items</p>
              <p className="text-2xl font-bold text-blue-900">{myItems.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">S</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-600">Active Swaps</p>
              <p className="text-2xl font-bold text-purple-900">{activeSwaps.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">P</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-orange-600">Pending Items</p>
              <p className="text-2xl font-bold text-orange-900">{pendingItems.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "overview"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("items")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "items"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            My Items
          </button>
          <button
            onClick={() => setActiveTab("swaps")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "swaps"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Swaps
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
            <div className="flex gap-4">
              <Link to="/add-item" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                List New Item
              </Link>
              <Link
                to="/browse"
                className="border border-green-600 text-green-600 px-4 py-2 rounded-md hover:bg-green-50"
              >
                Browse Items
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
            {mySwaps.length > 0 ? (
              <div className="space-y-3">
                {mySwaps.slice(0, 3).map((swap) => (
                  <div key={swap._id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">
                        {swap.requester_id === user._id ? "You requested" : "Request for"}: {swap.requested_item?.title}
                      </p>
                      <p className="text-sm text-gray-600">Status: {swap.status}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        swap.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : swap.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : swap.status === "completed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                      }`}
                    >
                      {swap.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No recent activity</p>
            )}
          </div>
        </div>
      )}

      {activeTab === "items" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">My Items</h3>
            <Link to="/add-item" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
              Add New Item
            </Link>
          </div>

          {myItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myItems.map((item) => (
                <div key={item._id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={item.images?.[0] || "/placeholder.svg?height=200&width=300"}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-sm text-gray-600">
                      {item.condition} • Size {item.size}
                    </p>
                    <p className="text-sm font-medium text-green-600">{item.points_value} points</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          item.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : item.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.status}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          item.availability === "available"
                            ? "bg-blue-100 text-blue-800"
                            : item.availability === "reserved"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.availability}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">You haven't listed any items yet</p>
              <Link to="/add-item" className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700">
                List Your First Item
              </Link>
            </div>
          )}
        </div>
      )}

      {activeTab === "swaps" && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium">My Swaps</h3>

          {mySwaps.length > 0 ? (
            <div className="space-y-4">
              {mySwaps.map((swap) => (
                <div key={swap._id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <h4 className="font-medium">
                          {swap.requester_id === user._id ? "You requested" : "Request from"}: {swap.other_user?.name}
                        </h4>
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            swap.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : swap.status === "accepted"
                                ? "bg-green-100 text-green-800"
                                : swap.status === "completed"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-red-100 text-red-800"
                          }`}
                        >
                          {swap.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Requested Item:</p>
                          <p className="font-medium">{swap.requested_item?.title}</p>
                        </div>
                        {swap.offered_item && (
                          <div>
                            <p className="text-sm font-medium text-gray-600">Offered Item:</p>
                            <p className="font-medium">{swap.offered_item?.title}</p>
                          </div>
                        )}
                      </div>

                      {swap.message && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-600">Message:</p>
                          <p className="text-gray-700">{swap.message}</p>
                        </div>
                      )}
                    </div>

                    <div className="ml-4 flex flex-col gap-2">
                      {swap.status === "pending" && swap.owner_id === user._id && (
                        <>
                          <button
                            onClick={() => handleSwapResponse(swap._id, "accept")}
                            className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleSwapResponse(swap._id, "reject")}
                            className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {swap.status === "accepted" && (
                        <button
                          onClick={() => handleCompleteSwap(swap._id)}
                          className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                        >
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No swaps yet</p>
              <Link to="/browse" className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700">
                Browse Items to Swap
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Dashboard
