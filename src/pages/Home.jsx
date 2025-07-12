import Hero from "../components/Hero"
import FeaturedItems from "../components/FeaturedItems"

const Home = () => {
  return (
    <div>
      <Hero />
      <FeaturedItems />

      {/* How it works section */}
      <div className="my-20">
        <div className="text-center py-8 text-3xl">
          <div className="inline-block">
            <p className="text-gray-500">HOW IT</p>
            <p className="text-gray-800 font-medium">WORKS</p>
            <p className="w-3/4 h-[1px] sm:h-[2px] bg-gray-800 m-auto"></p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📷</span>
            </div>
            <h3 className="text-lg font-medium mb-2">1. Upload Your Items</h3>
            <p className="text-gray-600">Take photos of clothes you no longer wear and list them on our platform.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔄</span>
            </div>
            <h3 className="text-lg font-medium mb-2">2. Browse & Swap</h3>
            <p className="text-gray-600">Find items you love and request swaps or use points to redeem them.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🌱</span>
            </div>
            <h3 className="text-lg font-medium mb-2">3. Reduce Waste</h3>
            <p className="text-gray-600">Give clothes a second life and contribute to a more sustainable future.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
