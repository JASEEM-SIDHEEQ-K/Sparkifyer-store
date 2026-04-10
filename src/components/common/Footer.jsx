const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        
        <div>
          <h2 className="text-xl font-bold text-white mb-3">
            ⚡ Sparkifyer
          </h2>
          <p className="text-sm text-slate-400">
            Your one-stop shop for the latest tech gadgets.
            Quality products, best prices, and fast delivery.
          </p>
        </div>

        
        <div>
          <h3 className="text-white font-semibold mb-3">Shop</h3>
          <ul className="flex flex-col gap-2 text-sm">
            <li className="hover:text-white cursor-pointer">All Products</li>
            <li className="hover:text-white cursor-pointer">New Arrivals</li>
            <li className="hover:text-white cursor-pointer">Best Sellers</li>
            <li className="hover:text-white cursor-pointer">Offers</li>
          </ul>
        </div>

        
        <div>
          <h3 className="text-white font-semibold mb-3">Support</h3>
          <ul className="flex flex-col gap-2 text-sm">
            <li className="hover:text-white cursor-pointer">Contact Us</li>
            <li className="hover:text-white cursor-pointer">FAQs</li>
            <li className="hover:text-white cursor-pointer">Shipping</li>
            <li className="hover:text-white cursor-pointer">Returns</li>
          </ul>
        </div>

        
        <div>
          <h3 className="text-white font-semibold mb-3">Stay Updated</h3>
          <p className="text-sm text-slate-400 mb-3">
            Subscribe to get latest offers & updates.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 rounded-l-lg text-sm text-black outline-none"
            />
            <button className="bg-blue-600 hover:bg-blue-700 px-4 rounded-r-lg text-sm font-medium">
              Subscribe
            </button>
          </div>
        </div>

      </div>

      
      <div className="border-t border-slate-700 text-center py-4 text-sm text-slate-400">
        © {new Date().getFullYear()} Sparkifyer. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;