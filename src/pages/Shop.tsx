import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from '@/contexts/CartContext';
import { Badge } from "@/components/ui/badge";
import products from "@/data/products";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import { ShoppingCart, Filter, Search, SlidersHorizontal, Sparkles, Play } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 400000]);

  const handleDemoClick = () => {
    window.location.href = 'https://www.youtube.com/watch?v=07UZ_ZX4oxo&list=RD07UZ_ZX4oxo&start_radio=1';
  };

  const categories = [
    { id: "all", name: "All Products", icon: Sparkles },
    { id: "security", name: "Security Bots", icon: Filter },
    { id: "assistant", name: "Assistant Bots", icon: Filter },
    { id: "industrial", name: "Industrial Robots", icon: Filter },
    { id: "drone", name: "Drones", icon: Filter },
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
      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero border-b border-border/50">
        <div className="absolute inset-0 bg-grid-white bg-grid [mask-image:linear-gradient(0deg,white,transparent)]" />
        <div className="container mx-auto px-4 py-16 text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Premium Robotics Collection</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Robot Store
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover our complete collection of cutting-edge robotics technology
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="secondary" className="px-4 py-1.5">✓ Free Shipping</Badge>
            <Badge variant="secondary" className="px-4 py-1.5">✓ 2-Year Warranty</Badge>
            <Badge variant="secondary" className="px-4 py-1.5">✓ 24/7 Support</Badge>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">

        {/* Enhanced Controls */}
        <div className="mb-8">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="mb-2 group"
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {category.name}
                </Button>
              );
            })}
          </div>

          {/* Search, Sort, and Price Controls */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <div className="text-sm font-medium flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Price: ₹{priceRange[0].toLocaleString('en-IN')} - ₹{priceRange[1].toLocaleString('en-IN')}
              </div>
              <Slider 
                value={priceRange} 
                onValueChange={(v) => setPriceRange([v[0], v[1]])} 
                min={0} 
                max={400000} 
                step={1000} 
                className="w-full" 
              />
            </div>

            {/* Sort */}
            <div>
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="price-asc">Price: Low → High</SelectItem>
                  <SelectItem value="price-desc">Price: High → Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results count */}
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span> products
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
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card className="group transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden border-border/50 hover:border-primary/30">
                          <CardContent className="p-0">
                            <div className="relative overflow-hidden">
                              <ImagePlaceholder src={product.image} alt={product.name} name={product.name} className="w-full h-56 object-cover bg-muted group-hover:scale-110 transition-transform duration-300" />
                              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <Button 
                                  variant="cta" 
                                  size="sm" 
                                  className="rounded-full shadow-lg bg-blue-500 hover:bg-blue-600 text-white"
                                  onClick={() => { 
                                    cart.addItem({ productId: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 }); 
                                    toast.success(`Added ${product.name} to cart`); 
                                  }}
                                >
                                  <ShoppingCart className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="secondary" 
                                  size="sm" 
                                  className="rounded-full shadow-lg"
                                  onClick={handleDemoClick}
                                  title="Watch Demo"
                                >
                                  <Play className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <div className="p-5">
                              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-200 line-clamp-1">{product.name}</h3>
                              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>

                              {product.features && product.features.length > 0 && (
                                <div className="mb-4">
                                  <div className="flex flex-wrap gap-1">
                                    {product.features.slice(0, 3).map((f, i) => (
                                      <Badge key={i} variant="secondary" className="text-xs">{f}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                                <span className="text-2xl font-bold text-primary">₹{product.price.toLocaleString('en-IN')}</span>
                                <Link to={`/product/${product.id}`}>
                                  <Button variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                                    View
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="group transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden border-border/50 hover:border-primary/30">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      <ImagePlaceholder src={product.image} alt={product.name} name={product.name} className="w-full h-56 object-cover bg-muted group-hover:scale-110 transition-transform duration-300" />
                      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button 
                          variant="cta" 
                          size="sm" 
                          className="rounded-full shadow-lg bg-blue-500 hover:bg-blue-600 text-white"
                          onClick={() => { 
                            cart.addItem({ productId: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 }); 
                            toast.success(`Added ${product.name} to cart`); 
                          }}
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="rounded-full shadow-lg"
                          onClick={handleDemoClick}
                          title="Watch Demo"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-200 line-clamp-1">{product.name}</h3>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>

                      {product.features && product.features.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {product.features.slice(0, 3).map((f, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">{f}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t border-border/50">
                        <span className="text-2xl font-bold text-primary">₹{product.price.toLocaleString('en-IN')}</span>
                        <Link to={`/product/${product.id}`}>
                          <Button variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gradient-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 text-primary/50" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground text-lg">
              Try adjusting your filters or search query.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;