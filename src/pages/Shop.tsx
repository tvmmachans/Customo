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

  const products = [
    {
      id: 1,
      name: "Guardian Security Bot X1",
      category: "security",
      price: 2999,
      rating: 4.8,
      reviews: 124,
      image: "/placeholder.svg",
      badge: "Best Seller",
      description: "Advanced AI-powered security robot with night vision and patrol capabilities.",
    },
    {
      id: 2,
      name: "HomePal Assistant Pro",
      category: "assistant",
      price: 1499,
      rating: 4.6,
      reviews: 89,
      image: "/placeholder.svg",
      badge: "New",
      description: "Smart home assistant robot with voice control and task automation.",
    },
    {
      id: 3,
      name: "IndustriMax Welder 3000",
      category: "industrial",
      price: 4999,
      rating: 4.9,
      reviews: 56,
      image: "/placeholder.svg",
      badge: "Pro",
      description: "Heavy-duty industrial welding robot with precision control.",
    },
    {
      id: 4,
      name: "SkyEye Surveillance Drone",
      category: "drone",
      price: 899,
      rating: 4.4,
      reviews: 203,
      image: "/placeholder.svg",
      badge: "Popular",
      description: "Autonomous surveillance drone with 4K camera and AI detection.",
    },
    {
      id: 5,
      name: "Butler Bot Elite",
      category: "assistant",
      price: 2299,
      rating: 4.7,
      reviews: 67,
      image: "/placeholder.svg",
      badge: "",
      description: "Premium household assistant robot with advanced mobility.",
    },
    {
      id: 6,
      name: "Fortress Guardian X2",
      category: "security", 
      price: 3499,
      rating: 4.9,
      reviews: 45,
      image: "/placeholder.svg",
      badge: "Premium",
      description: "Military-grade security robot with weapon detection system.",
    },
  ];

  const categories = [
    { id: "all", name: "All Products" },
    { id: "security", name: "Security Bots" },
    { id: "assistant", name: "Assistant Bots" },
    { id: "industrial", name: "Industrial Robots" },
    { id: "drone", name: "Drones" },
  ];

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

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

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
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

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group hover:glow-primary transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="relative mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg bg-muted"
                  />
                  {product.badge && (
                    <Badge className="absolute top-2 right-2 bg-cta text-cta-foreground">
                      {product.badge}
                    </Badge>
                  )}
                </div>
                
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                
                <p className="text-muted-foreground text-sm mb-4">
                  {product.description}
                </p>
                
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-muted-foreground">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">
                    ${product.price.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Link to={`/product/${product.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </Link>
                  <Button variant="cta" size="sm" onClick={() => {
                    cart.addItem({ productId: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 });
                    toast.success(`Added ${product.name} to cart`);
                  }}>
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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