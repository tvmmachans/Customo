import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Bot, Cpu, Zap, Shield, Smartphone, Monitor, Settings, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

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
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="group transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-primary/30">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <product.icon className="h-8 w-8 text-primary-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{product.description}</p>
                      <p className="text-primary font-bold mb-4">{product.price}</p>
                      <Link to={`/product/${product.id}`} className="w-full">
                        <Button variant="outline" size="sm" className="w-full hover:bg-primary hover:text-primary-foreground transition-colors">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Your Devices Section - Enhanced */}
      <section className="py-20 relative overflow-hidden">
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5" />
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Feature grid above the main card */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {[
                { icon: Monitor, title: "Real-time Monitoring", description: "Track device status live" },
                { icon: Settings, title: "Remote Control", description: "Configure settings remotely" },
                { icon: BarChart3, title: "Analytics Dashboard", description: "View performance metrics" }
              ].map((feature, index) => (
                <div key={index} className="p-6 rounded-lg bg-card/50 border border-border/50 backdrop-blur-sm hover:border-primary/50 transition-colors duration-200">
                  <div className="w-12 h-12 bg-gradient-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Main Device Management Card */}
            <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
              
              <CardContent className="p-8 md:p-12 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Left side - Icon and Info */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 bg-gradient-primary/20 rounded-2xl flex items-center justify-center border border-primary/30 shadow-lg">
                      <Smartphone className="h-12 w-12 text-primary" />
                    </div>
                  </div>

                  {/* Center - Content */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
                      <Bot className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-primary">Device Management</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-3">
                      Control Your <span className="bg-gradient-primary bg-clip-text text-transparent">Robot Fleet</span>
                    </h2>
                    <p className="text-muted-foreground text-lg mb-6">
                      Access your complete robot ecosystem, monitor performance in real-time, and control all your devices from a single dashboard.
                    </p>

                    {/* Feature list */}
                    <div className="grid sm:grid-cols-2 gap-3 mb-6">
                      {[
                        "Multi-device support",
                        "Real-time status updates",
                        "Remote configuration",
                        "Performance analytics"
                      ].map((feature, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          </div>
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right side - CTA */}
                  <div className="flex-shrink-0">
                    <Link to="/your-devices">
                      <Button variant="cta" size="lg" className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all group">
                        Access Dashboard
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    <p className="text-xs text-muted-foreground mt-4 text-center">
                      * Login required
                    </p>
                  </div>
                </div>
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