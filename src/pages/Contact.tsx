import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare, 
  Headphones,
  Globe,
  Send
} from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
    inquiryType: "",
  });

  const contactMethods = [
    {
      icon: Phone,
      title: "Phone Support",
      details: "+1 (555) 123-ROBO",
      description: "Mon-Fri 8AM-8PM EST",
      action: "Call Now"
    },
    {
      icon: Mail,
      title: "Email Support",
      details: "support@customorobo.com",
      description: "Response within 24 hours",
      action: "Send Email"
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      details: "Available 24/7",
      description: "Instant support online",
      action: "Start Chat"
    },
    {
      icon: Headphones,
      title: "Emergency Line",
      details: "1-800-ROBO-911",
      description: "24/7 critical support",
      action: "Emergency Call"
    },
  ];

  const offices = [
    {
      city: "San Francisco, CA",
      address: "1234 Tech Street, Suite 500",
      zipcode: "San Francisco, CA 94105",
      phone: "+1 (555) 123-0001",
      isHQ: true
    },
    {
      city: "Austin, TX",
      address: "5678 Innovation Blvd",
      zipcode: "Austin, TX 78701",
      phone: "+1 (555) 123-0002",
      isHQ: false
    },
    {
      city: "Boston, MA",
      address: "9012 Research Park Dr",
      zipcode: "Boston, MA 02101",
      phone: "+1 (555) 123-0003",
      isHQ: false
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent successfully! We'll respond within 24 hours.");
    setFormData({
      name: "",
      email: "",
      company: "",
      subject: "",
      message: "",
      inquiryType: "",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Have questions about our robots or need support? We're here to help. 
            Reach out through any of our convenient contact methods.
          </p>
        </div>

        {/* Quick Contact Methods */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactMethods.map((method, index) => (
            <Card key={index} className="text-center hover:glow-primary transition-all duration-300 cursor-pointer">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <method.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{method.title}</h3>
                <p className="text-primary font-medium mb-1">{method.details}</p>
                <p className="text-sm text-muted-foreground mb-4">{method.description}</p>
                <Button variant="outline" size="sm" className="w-full">
                  {method.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Send className="mr-2 h-5 w-5" />
                Send us a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="John Smith"
                      className="mt-2"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="john@company.com"
                      className="mt-2"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="company">Company/Organization</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    placeholder="Your Company Name"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="inquiry-type">Inquiry Type</Label>
                  <Select value={formData.inquiryType} onValueChange={(value) => handleInputChange("inquiryType", value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select inquiry type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sales">Sales & Product Info</SelectItem>
                      <SelectItem value="support">Technical Support</SelectItem>
                      <SelectItem value="custom">Custom Solutions</SelectItem>
                      <SelectItem value="partnership">Partnership Opportunities</SelectItem>
                      <SelectItem value="media">Media & Press</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => handleInputChange("subject", e.target.value)}
                    placeholder="Brief subject line"
                    className="mt-2"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="Please provide details about your inquiry, requirements, or questions..."
                    className="mt-2"
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" variant="cta" className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Office Locations & Info */}
          <div className="space-y-8">
            {/* Office Locations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Office Locations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {offices.map((office, index) => (
                    <div key={index} className="border-l-4 border-primary pl-4">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{office.city}</h3>
                        {office.isHQ && (
                          <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                            HQ
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{office.address}</p>
                      <p className="text-sm text-muted-foreground mb-1">{office.zipcode}</p>
                      <p className="text-sm text-primary font-medium">{office.phone}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-medium">8:00 AM - 8:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-medium">9:00 AM - 5:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-medium">Closed</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between">
                      <span>Emergency Support</span>
                      <span className="font-medium text-primary">24/7 Available</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="mr-2 h-5 w-5" />
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium mb-1">Response Time</h4>
                  <p className="text-muted-foreground">
                    We typically respond to inquiries within 4-6 hours during business hours, 
                    and within 24 hours on weekends.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Languages Supported</h4>
                  <p className="text-muted-foreground">
                    English, Spanish, Mandarin, Japanese, German, French
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Technical Documentation</h4>
                  <p className="text-muted-foreground">
                    Visit our knowledge base at docs.customorobo.com for technical guides 
                    and troubleshooting resources.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="mt-12">
          <Card>
            <CardContent className="p-0">
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Interactive map coming soon</p>
                  <p className="text-sm text-muted-foreground">Find our offices worldwide</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;