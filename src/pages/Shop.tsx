import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from '@/contexts/CartContext';
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Filter } from "lucide-react";

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  const products = [
    { id: 1, name: "Guardian Bot X1", category: "security", price: 34999, image: "/placeholder.svg", description: "Compact perimeter security robot with night vision.", features: ["Night vision & PIR sensors","Autonomous patrol routes","Tamper alerts","Local storage & cloud sync"] },
    { id: 2, name: "Sentinel Rover P3", category: "security", price: 42999, image: "/placeholder.svg", description: "Rugged rover for outdoor perimeter surveillance.", features: ["All-terrain wheels","4K zoom camera","Two-way audio","GPS geofencing"] },
    { id: 3, name: "EyeGuard V2", category: "security", price: 25499, image: "/placeholder.svg", description: "Compact camera drone for quick indoor inspections.", features: ["Stabilized 1080p camera","Low-light performance","Auto-return home","AI motion detection"] },
    { id: 4, name: "TitanSentinel R9", category: "security", price: 174999, image: "/placeholder.svg", description: "Enterprise-grade heavy security bot with extended endurance.", features: ["Long-range LIDAR","Thermal + optical sensors","Armored chassis","Edge AI for threat classification"] },

    { id: 5, name: "RoboMaid S7", category: "assistant", price: 18999, image: "/placeholder.svg", description: "Household assistant for cleaning and basic chores.", features: ["Vacuum + mop modes","Smart scheduling","Voice assistant integration","Slim profile for under-furniture"] },
    { id: 6, name: "HomeMate MiniBot A2", category: "assistant", price: 29499, image: "/placeholder.svg", description: "Compact companion for reminders and light tasks.", features: ["Personal reminders","Smart home hub","Gesture control","Low-noise operation"] },
    { id: 7, name: "SmartButler R3", category: "assistant", price: 21499, image: "/placeholder.svg", description: "Personal butler robot for household assistance.", features: ["Item fetching","Schedule management","Secure storage compartment","Custom voice responses"] },
    { id: 8, name: "EchoCompanion R5", category: "assistant", price: 19999, image: "/placeholder.svg", description: "Social companion bot with conversational AI.", features: ["Conversational AI","Media playback","Facial recognition","Emotion-aware responses"] },
    { id: 9, name: "HandyMate B2", category: "assistant", price: 32999, image: "/placeholder.svg", description: "Multi-purpose helper for home workshops.", features: ["Tool carrier","Precise arm movements","Safety interlocks","Modular attachments"] },
    { id: 10, name: "OmniServe H1", category: "assistant", price: 159999, image: "/placeholder.svg", description: "High-end home server & service robot for large homes.", features: ["Multi-room navigation","High-capacity storage","Pro service integrations","Enterprise-grade security"] },
    { id: 11, name: "PetPal Mini", category: "assistant", price: 23999, image: "/placeholder.svg", description: "Companion robot designed for pet interaction and care.", features: ["Treat dispenser","Play routines","Pet monitoring camera","Safe low-speed movement"] },

    { id: 12, name: "TaskPro M2", category: "industrial", price: 44499, image: "/placeholder.svg", description: "Compact industrial automation arm for small factories.", features: ["6-axis precision arm","PLC integration","High payload","Safety-rated stops"] },
    { id: 13, name: "MiniWorker Z4", category: "industrial", price: 49999, image: "/placeholder.svg", description: "Mobile worker robot for warehouses and sorting.", features: ["Autonomous navigation","Barcode scanning","Dynamic routing","Battery hot-swap"] },
    { id: 14, name: "ForgeMate X10", category: "industrial", price: 239999, image: "/placeholder.svg", description: "Heavy fabrication robot for manufacturing lines.", features: ["High-torque actuators","Integrated cooling","Precision welding options","Factory-grade reliability"] },
    { id: 15, name: "DeliveryBot D1", category: "industrial", price: 39999, image: "/placeholder.svg", description: "Autonomous delivery robot for campuses and warehouses.", features: ["Secure cargo bay","Route optimization","Collision avoidance","Remote monitoring"] },
    { id: 16, name: "LoadMaster G8", category: "industrial", price: 399999, image: "/placeholder.svg", description: "Heavy-lift robot for logistics and construction.", features: ["High-capacity lift","Stability control","Teleoperation mode","Ruggedized frame"] },

    { id: 17, name: "AeroEye Nano", category: "drone", price: 24999, image: "/placeholder.svg", description: "Pocket-sized surveillance drone for quick checks.", features: ["Foldable frame","30-min flight time","GPS waypointing","Auto-hover"] },
    { id: 18, name: "SkyScout Micro", category: "drone", price: 27999, image: "/placeholder.svg", description: "Micro-drone for aerial photography and inspection.", features: ["3-axis gimbal","4K video","Fast charging","Wind-stable design"] },
    { id: 19, name: "AirCarrier D5", category: "drone", price: 78999, image: "/placeholder.svg", description: "Medium-duty delivery drone for urban logistics.", features: ["Payload rail system","Redundant motors","Precision landing","Secure package bay"] },
    { id: 20, name: "HawkVision R8", category: "drone", price: 199999, image: "/placeholder.svg", description: "High-end surveillance drone with long endurance.", features: ["Thermal + EO cameras","Long-range comms","Automated patrol missions","AI target tracking"] },
  ];

  const categories = [
    { id: "all", name: "All Products" },
    { id: "security", name: "Security Bots" },
    { id: "assistant", name: "Assistant Bots" },
    { id: "industrial", name: "Industrial Robots" },
    { id: "drone", name: "Drones" },
  ];

  // apply search and price filters
  const matchesFilters = (product) => {
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      const inText = product.name.toLowerCase().includes(q) || product.description.toLowerCase().includes(q) || product.features.join(" ").toLowerCase().includes(q);
      if (!inText) return false;
    }
    if (minPrice > 0 && product.price < minPrice) return false;
    if (maxPrice > 0 && product.price > maxPrice) return false;
    return true;
  };

  const sortProducts = (list) => {
    if (sortOption === "price-asc") return [...list].sort((a,b) => a.price - b.price);
    if (sortOption === "price-desc") return [...list].sort((a,b) => b.price - a.price);
    return list;
  };

  const filteredProducts = sortProducts(products.filter(p => (selectedCategory === "all" || p.category === selectedCategory) && matchesFilters(p)));

  const cart = useCart();

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Robot Store</h1>
          <p className="text-muted-foreground text-lg">
            Discover our complete collection of cutting-edge robotics
          </p>
        </div>

        {/* Controls: Category, Search, Price, Sort */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="mb-2"
              >
                <Filter className="mr-2 h-4 w-4" />
                {category.name}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 border rounded-md bg-white/5 text-sm w-56"
            />

            <input type="number" placeholder="Min ₹" value={minPrice || ""} onChange={e => setMinPrice(Number(e.target.value || 0))} className="px-2 py-2 w-20 rounded-md bg-white/5 text-sm" />
            <input type="number" placeholder="Max ₹" value={maxPrice || ""} onChange={e => setMaxPrice(Number(e.target.value || 0))} className="px-2 py-2 w-20 rounded-md bg-white/5 text-sm" />

            <select value={sortOption} onChange={e => setSortOption(e.target.value)} className="px-3 py-2 rounded-md bg-white/5 text-sm">
              <option value="default">Sort</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
          </div>
        </div>

        {/* Products Grid (grouped when showing all) */}
        {selectedCategory === "all" ? (
          <div className="space-y-10">
            {categories.filter(c => c.id !== 'all').map(cat => {
              const items = filteredProducts.filter(p => p.category === cat.id);
              if (items.length === 0) return null;
              return (
                <section key={cat.id}>
                  <h2 className="text-2xl font-semibold mb-4">{cat.name}</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.map(product => (
                      <Card key={product.id} className="group hover:glow-primary transition-all duration-300 hover:scale-105">
                        <CardContent className="p-6">
                          <div className="relative mb-4">
                            <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg bg-muted" />
                          </div>

                          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{product.name}</h3>

                          <p className="text-muted-foreground text-sm mb-2">{product.description}</p>

                          <ul className="list-disc list-inside text-sm text-muted-foreground mb-3">
                            {product.features && product.features.map((f, i) => <li key={i}>{f}</li>)}
                          </ul>

                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-primary">₹{product.price.toLocaleString('en-IN')}</span>
                            <div className="flex gap-2">
                              <Link to={`/product/${product.id}`} className="flex-1">
                                <Button variant="outline" className="w-full">View Details</Button>
                              </Link>
                              <Button variant="cta" size="sm" onClick={() => { cart.addItem({ productId: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 }); toast.success(`Added ${product.name} to cart`); }}>
                                <ShoppingCart className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map(product => (
              <Card key={product.id} className="group hover:glow-primary transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className="relative mb-4">
                    <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg bg-muted" />
                  </div>

                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{product.name}</h3>

                  <p className="text-muted-foreground text-sm mb-2">{product.description}</p>

                  <ul className="list-disc list-inside text-sm text-muted-foreground mb-3">
                    {product.features && product.features.map((f, i) => <li key={i}>{f}</li>)}
                  </ul>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">₹{product.price.toLocaleString('en-IN')}</span>
                    <div className="flex gap-2">
                      <Link to={`/product/${product.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">View Details</Button>
                      </Link>
                      <Button variant="cta" size="sm" onClick={() => { cart.addItem({ productId: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 }); toast.success(`Added ${product.name} to cart`); }}>
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No products found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;