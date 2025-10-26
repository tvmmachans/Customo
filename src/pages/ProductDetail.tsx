import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, ShoppingCart, Heart, Share2, ArrowLeft, Shield, Zap, Settings } from "lucide-react";
import { toast } from "sonner";
import { useCart } from '@/contexts/CartContext';
import products from "@/data/products";
import ImagePlaceholder from "@/components/ImagePlaceholder";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const cart = useCart();

  // find product from shared data store
  const productId = Number(id);
  const product = products.find(p => p.id === productId) || null;

  if (!product) {
    return (
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold">Product not found</h2>
          <p className="mt-4 text-muted-foreground">We couldn't find the product you were looking for.</p>
          <div className="mt-6">
            <Link to="/shop">
              <Button variant="outline">Back to shop</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const images = product.image ? [product.image] : [];
  const rating = (product as any).rating ?? 4.6;
  const originalPrice = (product as any).originalPrice ?? undefined;
  const inStock = (product as any).inStock ?? true;
  const specifications = (product as any).specifications ?? {};
  const customerReviews = (product as any).customerReviews ?? [];

  const handleAddToCart = () => {
    cart.addItem({ productId: product.id, name: product.name, price: product.price, image: product.image, quantity });
    toast.success(`Added ${quantity}x ${product.name} to cart!`);
  };

  const handleBuyNow = () => {
    cart.addItem({ productId: product.id, name: product.name, price: product.price, image: product.image, quantity });
    toast.success("Redirecting to checkout...");
    navigate('/checkout');
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
              <ImagePlaceholder src={images[selectedImage]} alt={product.name} name={product.name} className="w-full h-96 object-cover rounded-lg bg-muted" />
            </div>
            <div className="flex gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-md overflow-hidden border-2 ${
                    selectedImage === index ? "border-primary" : "border-border"
                  }`}
                >
                  <ImagePlaceholder src={image} alt={`View ${index + 1}`} name={product.name} className="w-full h-full object-cover bg-muted" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              {/* badge optional */}
              {(product as any).badge && (
                <Badge className="bg-cta text-cta-foreground">{(product as any).badge}</Badge>
              )}
              <Badge variant="outline" className={inStock ? "text-green-500" : "text-red-500"}>
                {inStock ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>

            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(rating)
                        ? "text-yellow-400 fill-current"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-muted-foreground">
                {rating} ({customerReviews.length} reviews)
              </span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl font-bold text-primary">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  ₹{originalPrice.toLocaleString('en-IN')}
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
                  {Object.entries(specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{key}:</span>
                      <span>{String(value)}</span>
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
            {customerReviews.map((review: any) => (
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