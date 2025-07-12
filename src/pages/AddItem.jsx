"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

const AddItem = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    type: "",
    size: "",
    condition: "",
    tags: "",
    images: [],
    points_value: 50,
  })
  const [loading, setLoading] = useState(false)

  const categories = ["Tops", "Bottoms", "Dresses", "Outerwear", "Footwear", "Accessories"]
  const types = {
    Tops: ["T-Shirt", "Shirt", "Blouse", "Sweater", "Hoodie", "Tank Top"],
    Bottoms: ["Jeans", "Pants", "Shorts", "Skirt", "Leggings"],
    Dresses: ["Casual Dress", "Formal Dress", "Maxi Dress", "Mini Dress"],
    Outerwear: ["Jacket", "Coat", "Blazer", "Cardigan", "Vest"],
    Footwear: ["Sneakers", "Boots", "Heels", "Flats", "Sandals"],
    Accessories: ["Bag", "Hat", "Scarf", "Belt", "Jewelry"],
  }
  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "6", "7", "8", "9", "10", "11", "12"]
  const conditions = ["Excellent", "Good", "Fair"]

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
    }
  }, [navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    // For now, we'll use placeholder images
    // In a real app, you'd upload to a service like Cloudinary
    const imageUrls = files.map(
      (file, index) => `/placeholder.svg?height=300&width=300&text=${encodeURIComponent(file.name)}`,
    )
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...imageUrls].slice(0, 5), // Max 5 images
    }))
  }

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem("token")

      // Validate required fields
      const requiredFields = ["title", "description", "category", "type", "size", "condition"]
      for (const field of requiredFields) {
        if (!formData[field]) {
          toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`)
          setLoading(false)
          return
        }
      }

      const submitData = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        points_value: Number.parseInt(formData.points_value),
      }

      const response = await fetch("http://localhost:5328/api/items/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Item uploaded successfully! It will be reviewed by our team.")
        navigate("/dashboard")
      } else {
        toast.error(data.error || "Failed to upload item")
      }
    } catch (error) {
      console.error("Error uploading item:", error)
      toast.error("Failed to upload item")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">List New Item</h1>
        <p className="text-gray-600">Share your unused clothes with the community</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Images (Max 5)</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
              <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <p className="text-gray-600">Click to upload images</p>
            </label>
          </div>

          {formData.images.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mt-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-24 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="e.g., Vintage Denim Jacket"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="Describe the item, its condition, and any special features..."
            required
          />
        </div>

        {/* Category and Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
              disabled={!formData.category}
            >
              <option value="">Select Type</option>
              {formData.category &&
                types[formData.category]?.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Size and Condition */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Size *</label>
            <select
              name="size"
              value={formData.size}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            >
              <option value="">Select Size</option>
              {sizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Condition *</label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            >
              <option value="">Select Condition</option>
              {conditions.map((condition) => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="e.g., vintage, casual, summer"
          />
          <p className="text-sm text-gray-500 mt-1">Add tags to help others find your item</p>
        </div>

        {/* Points Value */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Points Value</label>
          <input
            type="number"
            name="points_value"
            value={formData.points_value}
            onChange={handleInputChange}
            min="10"
            max="200"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
          <p className="text-sm text-gray-500 mt-1">How many points should this item cost? (10-200)</p>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-green-600 text-white py-3 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Uploading..." : "List Item"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="px-6 border border-gray-300 text-gray-700 py-3 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddItem
