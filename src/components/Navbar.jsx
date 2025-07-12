"use client"

import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { toast } from "sonner"

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")
    if (token && userData) {
      setIsLoggedIn(true)
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setIsLoggedIn(false)
    setUser(null)
    toast.success("Logged out successfully")
    navigate("/")
  }

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      {/* Logo */}
      <Link to="/">
        <div className="text-2xl font-bold text-green-600">ReWear</div>
      </Link>

      {/* Desktop Navigation */}
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <Link to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </Link>
        <Link to="/browse" className="flex flex-col items-center gap-1">
          <p>BROWSE ITEMS</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </Link>
        <Link to="/about" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </Link>
        <Link to="/contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </Link>
      </ul>

      {/* Right side icons */}
      <div className="flex items-center gap-6">
        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <Link to="/add-item" className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700">
              List Item
            </Link>
            <Link to="/dashboard" className="text-gray-700 hover:text-green-600">
              Dashboard
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Hi, {user?.name}</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                {user?.points || 0} pts
              </span>
            </div>
            <button onClick={handleLogout} className="text-gray-700 hover:text-red-600 text-sm">
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700">
            Login
          </Link>
        )}

        {/* Mobile menu icon */}
        <div className="sm:hidden">
          <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="absolute top-16 left-0 right-0 bg-white shadow-lg sm:hidden z-50">
          <div className="flex flex-col p-4 space-y-4">
            <Link to="/" onClick={() => setShowMobileMenu(false)}>
              HOME
            </Link>
            <Link to="/browse" onClick={() => setShowMobileMenu(false)}>
              BROWSE ITEMS
            </Link>
            <Link to="/about" onClick={() => setShowMobileMenu(false)}>
              ABOUT
            </Link>
            <Link to="/contact" onClick={() => setShowMobileMenu(false)}>
              CONTACT
            </Link>
            {isLoggedIn && (
              <>
                <Link to="/dashboard" onClick={() => setShowMobileMenu(false)}>
                  DASHBOARD
                </Link>
                <Link to="/add-item" onClick={() => setShowMobileMenu(false)}>
                  LIST ITEM
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar
