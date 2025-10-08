import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, ShoppingCart, Heart, Share2, ArrowLeft, Shield, Zap, Settings } from "lucide-react";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock product data - in real app this would come from API/database
  const product = {
    id: 1,
    name: "Guardian Security Bot X1",
    price: 2999,
    originalPrice: 3499,
    rating: 4.8,
    reviews: 124,
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    badge: "Best Seller",
    inStock: true,
    description: "The Guardian Security Bot X1 represents the pinnacle of autonomous security technology. Equipped with advanced AI surveillance, night vision capabilities, and intelligent patrol algorithms, this robot provides 24/7 protection for your property.",
    features: [
      "360° HD Camera with Night Vision",
      "AI-Powered Motion Detection", 
      "Autonomous Patrol Routes",
      "Real-time Alert System",
      "Weather Resistant Design",
      "12-Hour Battery Life",
    ],
    specifications: {
      "Height": "1.2m",
      "Weight": "45kg", 
      "Battery": "Li-ion 24V",
      "Speed": "2.5 m/s",
      "Range": "500m",
      "Connectivity": "WiFi, 5G",
    },
    customerReviews: [
      {
        id: 1,
        user: "John Smith",
        rating: 5,
        date: "2024-01-15",
        comment: "Excellent security robot! The AI detection is incredibly accurate and the night vision works perfectly. Highly recommended!",
      },
      {
        id: 2, 
        user: "Sarah Johnson",
        rating: 4,
        date: "2024-01-10",
        comment: "Great product overall. Easy to set up and works as advertised. The mobile app could use some improvements though.",
      },
      {
        id: 3,
        user: "Mike Davis",
        rating: 5,
        date: "2024-01-05", 
        comment: "This robot has transformed our warehouse security. The patrol routes are smart and it catches things we would miss.",
      },
    ],
  };

  const handleAddToCart = () => {
    toast.success(`Added ${quantity}x ${product.name} to cart!`);
  };

  const handleBuyNow = () => {
    toast.success("Redirecting to checkout...");
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/shop" className="flex items-center text-muted-foreground hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="mb-4">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg bg-muted"
              />
            </div>
            <div className="flex gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-md overflow-hidden border-2 ${
                    selectedImage === index ? "border-primary" : "border-border"
                  }`}
                >
                  <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover bg-muted" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              {product.badge && (
                <Badge className="bg-cta text-cta-foreground">{product.badge}</Badge>
              )}
              <Badge variant="outline" className={product.inStock ? "text-green-500" : "text-red-500"}>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>

            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? "text-yellow-400 fill-current"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-muted-foreground">
                {product.rating} ({product.customerReviews.length} reviews)
              </span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl font-bold text-primary">
                ${product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  ${product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-muted-foreground mb-6">{product.description}</p>

            {/* Quantity and Actions */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-muted"
                >
                  -
                </button>
                <span className="px-4 py-2 border-x">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-muted"
                >
                  +
                </button>
              </div>
              
              <Button variant="cta" onClick={handleBuyNow} className="flex-1">
                Buy Now
              </Button>
              
              <Button variant="outline" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <Heart className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Features */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Zap className="mr-2 h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Key Features</h3>
                </div>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Settings className="mr-2 h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Specifications</h3>
                </div>
                <div className="space-y-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{key}:</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Warranty */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Shield className="mr-2 h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Warranty & Support</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <strong>2-Year Warranty</strong>
                    <p className="text-muted-foreground">Full coverage for parts and labor</p>
                  </div>
                  <div>
                    <strong>24/7 Support</strong>
                    <p className="text-muted-foreground">Remote diagnostics and assistance</p>
                  </div>
                  <div>
                    <strong>Free Updates</strong>
                    <p className="text-muted-foreground">Lifetime software updates</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold mb-6">Customer Reviews</h3>
          <div className="space-y-6">
            {product.customerReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center mb-2">
                        <span className="font-semibold">{review.user}</span>
                        <div className="flex items-center ml-4">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm">{review.date}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;