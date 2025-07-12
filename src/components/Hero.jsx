import { Link } from "react-router-dom"

const Hero = () => {
  return (
    <div className="flex flex-col sm:flex-row border border-gray-400">
      {/* Hero Left Side */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
        <div className="text-[#414141]">
          <div className="flex items-center gap-2">
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
            <p className="font-medium text-sm md:text-base">SUSTAINABLE FASHION</p>
          </div>
          <h1 className="prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed">
            Give Your Clothes
            <br />A Second Life
          </h1>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm md:text-base">SWAP • SHARE • SUSTAIN</p>
            <p className="w-8 md:w-11 h-[1px] bg-[#414141]"></p>
          </div>
          <div className="mt-8 space-y-4">
            <p className="text-gray-600 max-w-md">
              Join our community of eco-conscious fashion lovers. Exchange your unused clothes for something new-to-you
              and help reduce textile waste.
            </p>
            <div className="flex gap-4">
              <Link
                to="/browse"
                className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
              >
                Start Swapping
              </Link>
              <Link
                to="/add-item"
                className="border border-green-600 text-green-600 px-6 py-3 rounded-md hover:bg-green-50 transition-colors"
              >
                List an Item
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Right Side */}
      <div className="w-full sm:w-1/2">
        <img
          className="w-full h-full object-cover"
          src="/placeholder.svg?height=400&width=600"
          alt="Sustainable Fashion"
        />
      </div>
    </div>
  )
}

export default Hero
