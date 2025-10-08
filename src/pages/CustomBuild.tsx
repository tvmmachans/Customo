import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Upload, Search, Plus, Trash2, Cpu, Battery, Camera, Zap } from "lucide-react";
import { toast } from "sonner";

const CustomBuild = () => {
  const [selectedParts, setSelectedParts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalCost, setTotalCost] = useState(0);

  const partCategories = [
    {
      id: "processors",
      name: "Processors & Control Units",
      icon: Cpu,
      parts: [
        { id: 1, name: "RoboCore AI Processor X1", price: 899, specs: "Neural processing, 2.5 GHz", inStock: true },
        { id: 2, name: "IntelliBot CPU Pro", price: 1299, specs: "Quantum computing, 3.2 GHz", inStock: true },
        { id: 3, name: "SmartCore Mini", price: 449, specs: "Compact design, 1.8 GHz", inStock: false },
      ]
    },
    {
      id: "power",
      name: "Power & Battery Systems", 
      icon: Battery,
      parts: [
        { id: 4, name: "PowerMax Li-ion 5000mAh", price: 299, specs: "12V, 8-hour runtime", inStock: true },
        { id: 5, name: "UltraCell Energy Pack", price: 499, specs: "24V, 16-hour runtime", inStock: true },
        { id: 6, name: "Solar Power Module", price: 799, specs: "Self-charging, weather resistant", inStock: true },
      ]
    },
    {
      id: "sensors",
      name: "Sensors & Cameras",
      icon: Camera,
      parts: [
        { id: 7, name: "360° Vision System", price: 599, specs: "4K cameras, night vision", inStock: true },
        { id: 8, name: "LiDAR Mapping Unit", price: 1499, specs: "3D environment mapping", inStock: true },
        { id: 9, name: "Thermal Imaging Camera", price: 999, specs: "Heat detection, 30fps", inStock: false },
      ]
    },
    {
      id: "actuators",
      name: "Motors & Actuators",
      icon: Zap,
      parts: [
        { id: 10, name: "Precision Servo Motor Set", price: 399, specs: "6 motors, 180° rotation", inStock: true },
        { id: 11, name: "Heavy Duty Drive System", price: 899, specs: "Industrial grade, 500kg capacity", inStock: true },
        { id: 12, name: "Articulated Arm Kit", price: 1199, specs: "7 degrees of freedom", inStock: true },
      ]
    },
  ];

  const handlePartSelect = (part: any) => {
    if (!part.inStock) {
      toast.error("This part is currently out of stock");
      return;
    }

    const isAlreadySelected = selectedParts.find(p => p.id === part.id);
    if (isAlreadySelected) {
      toast.info("Part already selected");
      return;
    }

    setSelectedParts([...selectedParts, { ...part, quantity: 1 }]);
    setTotalCost(totalCost + part.price);
    toast.success(`Added ${part.name} to your build`);
  };

  const handlePartRemove = (partId: number) => {
    const part = selectedParts.find(p => p.id === partId);
    if (part) {
      setSelectedParts(selectedParts.filter(p => p.id !== partId));
      setTotalCost(totalCost - (part.price * part.quantity));
      toast.success("Part removed from build");
    }
  };

  const handleQuantityChange = (partId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setSelectedParts(selectedParts.map(part => {
      if (part.id === partId) {
        const priceDiff = (newQuantity - part.quantity) * part.price;
        setTotalCost(totalCost + priceDiff);
        return { ...part, quantity: newQuantity };
      }
      return part;
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast.success(`Design file "${file.name}" uploaded successfully`);
    }
  };

  const filteredCategories = partCategories.map(category => ({
    ...category,
    parts: category.parts.filter(part =>
      part.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.parts.length > 0);

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Custom Robot Builder</h1>
          <p className="text-muted-foreground text-lg">
            Design and build your perfect robot with our component library
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Design Upload & Parts Selection */}
          <div className="lg:col-span-2 space-y-8">
            {/* Design Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Your Design
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="design-file">Design File (CAD, PDF, Image)</Label>
                    <Input
                      id="design-file"
                      type="file"
                      accept=".pdf,.dwg,.step,.stl,.jpg,.png,.svg"
                      onChange={handleFileUpload}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Project Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your robot's intended purpose, requirements, and any specific features..."
                      className="mt-2"
                      rows={4}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Parts Search */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="mr-2 h-5 w-5" />
                  Available Components
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Search for components..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mb-6"
                />

                <div className="space-y-6">
                  {filteredCategories.map((category) => (
                    <div key={category.id}>
                      <div className="flex items-center mb-4">
                        <category.icon className="mr-2 h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">{category.name}</h3>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        {category.parts.map((part) => (
                          <Card key={part.id} className={`hover:glow-primary transition-all duration-300 ${!part.inStock ? 'opacity-50' : ''}`}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-sm">{part.name}</h4>
                                <Badge variant={part.inStock ? "default" : "destructive"}>
                                  {part.inStock ? "In Stock" : "Out of Stock"}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mb-3">{part.specs}</p>
                              <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-primary">${part.price}</span>
                                <Button
                                  size="sm"
                                  onClick={() => handlePartSelect(part)}
                                  disabled={!part.inStock}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Build Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Build Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedParts.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No components selected yet. Choose parts from the left to build your robot.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {selectedParts.map((part) => (
                      <div key={part.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{part.name}</p>
                          <p className="text-xs text-muted-foreground">${part.price} each</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center border rounded">
                            <button
                              onClick={() => handleQuantityChange(part.id, part.quantity - 1)}
                              className="px-2 py-1 hover:bg-muted"
                            >
                              -
                            </button>
                            <span className="px-2 py-1 text-sm">{part.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(part.id, part.quantity + 1)}
                              className="px-2 py-1 hover:bg-muted"
                            >
                              +
                            </button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePartRemove(part.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total Cost:</span>
                      <span className="text-primary">${totalCost.toLocaleString()}</span>
                    </div>
                    
                    <Button variant="cta" className="w-full mt-4">
                      Request Quote
                    </Button>
                    
                    <Button variant="outline" className="w-full">
                      Save Configuration
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomBuild;