"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"

const FeaturedItems = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedItems()
  }, [])

  const fetchFeaturedItems = async () => {
    try {
      const response = await fetch("http://localhost:5328/api/items/featured")
      const data = await response.json()

      if (data.success) {
        setItems(data.items)
      } else {
        toast.error("Failed to load featured items")
      }
    } catch (error) {
      console.error("Error fetching featured items:", error)
      toast.error("Failed to load featured items")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="my-10">
        <div className="text-center py-8 text-3xl">
          <div className="inline-block">
            <p className="text-gray-500">FEATURED</p>
            <p className="text-gray-800 font-medium">ITEMS</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-lg"></div>
              <div className="mt-2 space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <div className="inline-block">
          <p className="text-gray-500">FEATURED</p>
          <p className="text-gray-800 font-medium">ITEMS</p>
          <p className="w-3/4 h-[1px] sm:h-[2px] bg-gray-800 m-auto"></p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {items.map((item) => (
          <Link
            key={item._id}
            to={`/items/${item._id}`}
            className="text-gray-700 cursor-pointer hover:scale-105 transition-transform"
          >
            <div className="overflow-hidden rounded-lg">
              <img
                className="hover:scale-110 transition ease-in-out w-full aspect-square object-cover"
                src={item.images?.[0] || "/placeholder.svg?height=300&width=300"}
                alt={item.title}
              />
            </div>
            <p className="pt-3 pb-1 text-sm font-medium">{item.title}</p>
            <p className="text-sm text-gray-600">
              {item.condition} • Size {item.size}
            </p>
            <p className="text-sm font-medium text-green-600">{item.points_value} points</p>
            <p className="text-xs text-gray-500">by {item.uploader_name}</p>
          </Link>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link
          to="/browse"
          className="inline-block bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 transition-colors"
        >
          Browse All Items
        </Link>
      </div>
    </div>
  )
}

export default FeaturedItems
