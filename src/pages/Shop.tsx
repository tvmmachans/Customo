import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from '@/contexts/CartContext';
import { Badge } from "@/components/ui/badge";
import products from "@/data/products";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import { Star, ShoppingCart, Filter } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 400000]);

  

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
    const [minP, maxP] = priceRange;
    if (minP > 0 && product.price < minP) return false;
    if (maxP > 0 && product.price > maxP) return false;
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

            <div className="w-72">
              <div className="text-xs text-muted-foreground mb-1">Price range: ₹{priceRange[0].toLocaleString('en-IN')} - ₹{priceRange[1].toLocaleString('en-IN')}</div>
              <Slider value={priceRange} onValueChange={(v) => setPriceRange([v[0], v[1]])} min={0} max={400000} step={1000} className="w-full" />
            </div>

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
                            <ImagePlaceholder src={product.image} alt={product.name} name={product.name} className="w-full h-48 object-cover rounded-lg bg-muted" />
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
          <ImagePlaceholder src={product.image} alt={product.name} name={product.name} className="w-full h-48 object-cover rounded-lg bg-muted" />
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