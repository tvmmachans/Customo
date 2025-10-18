import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Bot, Cpu, Zap, Shield } from "lucide-react";

const Home = () => {
  const products = [
    {
      id: 1,
      name: "Security Bots",
      description: "Advanced security robots with AI surveillance",
      icon: Shield,
      image: "/placeholder.svg",
      price: "From $2,999",
    },
    {
      id: 2,
      name: "Assistant Bots", 
      description: "Personal assistant robots for home and office",
      icon: Bot,
      image: "/placeholder.svg", 
      price: "From $1,499",
    },
    {
      id: 3,
      name: "Industrial Robots",
      description: "Heavy-duty robots for manufacturing",
      icon: Cpu,
      image: "/placeholder.svg",
      price: "From $4,999", 
    },
    {
      id: 4,
      name: "Smart Drones",
      description: "Autonomous drones for various applications",
      icon: Zap,
      image: "/placeholder.svg",
      price: "From $899",
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Welcome to the Future
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Discover cutting-edge robotics technology. Buy, control, and customize robots for every need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="cta" size="lg" className="text-lg px-8 py-6">
              Explore Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Main Products Showcase */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Featured Products</h2>
          <p className="text-muted-foreground text-center mb-12">
            Explore our main categories of cutting-edge robotics
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <Card key={product.id} className="group hover:glow-primary transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                      <product.icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{product.description}</p>
                    <p className="text-primary font-bold mb-4">{product.price}</p>
                    <Link to={`/product/${product.id}`} className="w-full">
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Your Devices Section */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-accent border-2 border-accent/20">
              <CardContent className="p-12 text-center">
                <h2 className="text-3xl font-bold mb-4 text-accent-foreground">
                  Manage Your Devices
                </h2>
                <p className="text-muted-foreground mb-8 text-lg">
                  Access your robot fleet, monitor performance, and control your devices remotely
                </p>
                <Link to="/your-devices">
                  <Button variant="cta" size="lg" className="text-lg px-8 py-6">
                    Access Your Devices
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <p className="text-sm text-muted-foreground mt-4">
                  * Login required to access device management
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Build Your Robot Army?</h2>
          <p className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto">
            Join thousands of customers who trust Customo RoBo for their robotics needs
          </p>
          <Link to="/shop">
            <Button variant="cta" size="lg" className="text-lg px-8 py-6 animate-glow">
              Start Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;