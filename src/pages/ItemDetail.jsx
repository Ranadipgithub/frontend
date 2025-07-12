"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "sonner"

const ItemDetail = () => {
  const { itemId } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [showSwapModal, setShowSwapModal] = useState(false)
  const [userItems, setUserItems] = useState([])
  const [selectedItem, setSelectedItem] = useState("")
  const [swapMessage, setSwapMessage] = useState("")

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
    fetchItem()
  }, [itemId])

  const fetchItem = async () => {
    try {
      const response = await fetch(`http://localhost:5328/api/items/${itemId}`)
      const data = await response.json()

      if (data.success) {
        setItem(data.item)
      } else {
        toast.error("Item not found")
        navigate("/browse")
      }
    } catch (error) {
      console.error("Error fetching item:", error)
      toast.error("Failed to load item")
    } finally {
      setLoading(false)
    }
  }

  const fetchUserItems = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5328/api/items/my-items", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()

      if (data.success) {
        // Filter available items only
        const availableItems = data.items.filter(
          (item) => item.availability === "available" && item.status === "approved",
        )
        setUserItems(availableItems)
      }
    } catch (error) {
      console.error("Error fetching user items:", error)
    }
  }

  const handleRedeemWithPoints = async () => {
    if (!user) {
      toast.error("Please login to redeem items")
      navigate("/login")
      return
    }

    if (user.points < item.points_value) {
      toast.error(`You need ${item.points_value} points to redeem this item`)
      return
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:5328/api/items/${itemId}/redeem`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Item redeemed successfully!")
        // Update user points
        const updatedUser = { ...user, points: user.points - item.points_value }
        localStorage.setItem("user", JSON.stringify(updatedUser))
        setUser(updatedUser)
        navigate("/dashboard")
      } else {
        toast.error(data.error || "Failed to redeem item")
      }
    } catch (error) {
      console.error("Error redeeming item:", error)
      toast.error("Failed to redeem item")
    }
  }

  const handleSwapRequest = async () => {
    if (!user) {
      toast.error("Please login to request swaps")
      navigate("/login")
      return
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5328/api/swaps/request", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requested_item_id: itemId,
          offered_item_id: selectedItem || null,
          message: swapMessage,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Swap request sent successfully!")
        setShowSwapModal(false)
        setSelectedItem("")
        setSwapMessage("")
      } else {
        toast.error(data.error || "Failed to send swap request")
      }
    } catch (error) {
      console.error("Error sending swap request:", error)
      toast.error("Failed to send swap request")
    }
  }

  const openSwapModal = () => {
    if (!user) {
      toast.error("Please login to request swaps")
      navigate("/login")
      return
    }
    setShowSwapModal(true)
    fetchUserItems()
  }

  if (loading) {
    return (
      <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
        <div className="animate-pulse">
          <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
            <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
              <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 bg-gray-200 aspect-square rounded"
                  ></div>
                ))}
              </div>
              <div className="w-full sm:w-[80%] bg-gray-200 aspect-square rounded"></div>
            </div>
            <div className="flex-1">
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">Item not found</p>
      </div>
    )
  }

  const isOwner = user && user._id === item.uploader_id

  return (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* Product Data */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* Product Images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {item.images?.map((image, index) => (
              <img
                key={index}
                src={image || "/placeholder.svg"}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer rounded"
                alt={`${item.title} ${index + 1}`}
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img
              className="w-full h-auto rounded-lg"
              src={item.images?.[0] || "/placeholder.svg?height=500&width=500"}
              alt={item.title}
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{item.title}</h1>
          <div className="flex items-center gap-1 mt-2">
            <p className="text-green-600 font-semibold text-lg">{item.points_value} points</p>
          </div>

          <div className="flex flex-col gap-4 my-8">
            <div>
              <p className="text-gray-600">
                <span className="font-medium">Category:</span> {item.category}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Type:</span> {item.type}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Size:</span> {item.size}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Condition:</span> {item.condition}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Listed by:</span> {item.uploader_name}
              </p>
            </div>

            <div>
              <p className="font-medium mb-2">Description:</p>
              <p className="text-gray-600">{item.description}</p>
            </div>

            {item.tags && item.tags.length > 0 && (
              <div>
                <p className="font-medium mb-2">Tags:</p>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {!isOwner && item.availability === "available" && (
            <div className="flex flex-col gap-4">
              <button
                onClick={handleRedeemWithPoints}
                className="bg-green-600 text-white px-8 py-3 text-sm active:bg-green-700 rounded hover:bg-green-700 transition-colors"
                disabled={!user || user.points < item.points_value}
              >
                {user && user.points < item.points_value
                  ? `Need ${item.points_value - user.points} more points`
                  : `Redeem for ${item.points_value} points`}
              </button>

              <button
                onClick={openSwapModal}
                className="border border-green-600 text-green-600 px-8 py-3 text-sm hover:bg-green-50 rounded transition-colors"
              >
                Request Swap
              </button>
            </div>
          )}

          {isOwner && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 font-medium">This is your item</p>
              <p className="text-blue-600 text-sm">Status: {item.status}</p>
              <p className="text-blue-600 text-sm">Availability: {item.availability}</p>
            </div>
          )}

          {item.availability !== "available" && !isOwner && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-gray-800 font-medium">This item is no longer available</p>
            </div>
          )}
        </div>
      </div>

      {/* Swap Modal */}
      {showSwapModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Request Swap</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Offer an item (optional):</label>
              <select
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Select an item to offer</option>
                {userItems.map((userItem) => (
                  <option key={userItem._id} value={userItem._id}>
                    {userItem.title} - {userItem.condition}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Message to owner:</label>
              <textarea
                value={swapMessage}
                onChange={(e) => setSwapMessage(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 h-24"
                placeholder="Tell the owner why you'd like this item..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSwapRequest}
                className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
              >
                Send Request
              </button>
              <button
                onClick={() => setShowSwapModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ItemDetail
