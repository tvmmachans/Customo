import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Wrench, AlertCircle, CheckCircle, Clock, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const Service = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [formData, setFormData] = useState({
    deviceId: "",
    issueType: "",
    description: "",
    priority: "",
    contactMethod: "",
  });

  const serviceTypes = [
    { id: "repair", name: "Repair Service", description: "Fix hardware or software issues" },
    { id: "maintenance", name: "Preventive Maintenance", description: "Regular check-up and optimization" },
    { id: "upgrade", name: "Hardware Upgrade", description: "Install new components or features" },
    { id: "calibration", name: "Calibration Service", description: "Precision tuning and alignment" },
  ];

  const recentTickets = [
    {
      id: "TK-001",
      device: "Guardian Security Bot X1",
      issue: "Camera alignment issues",
      status: "in-progress",
      date: "2024-01-15",
      priority: "high"
    },
    {
      id: "TK-002", 
      device: "HomePal Assistant Pro",
      issue: "Voice recognition not working",
      status: "completed",
      date: "2024-01-12",
      priority: "medium"
    },
    {
      id: "TK-003",
      device: "IndustriMax Welder 3000",
      issue: "Scheduled maintenance", 
      status: "scheduled",
      date: "2024-01-20",
      priority: "low"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in-progress":
        return "bg-blue-500";
      case "scheduled":
        return "bg-yellow-500";
      case "pending":
        return "bg-orange-500";
      default:
        return "bg-muted";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "in-progress":
        return <Clock className="h-4 w-4" />;
      case "scheduled":
        return <CalendarIcon className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-500 text-red-500";
      case "medium":
        return "border-yellow-500 text-yellow-500";
      case "low":
        return "border-green-500 text-green-500";
      default:
        return "border-muted-foreground text-muted-foreground";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Service request submitted successfully! We'll contact you within 24 hours.");
    setFormData({ deviceId: "", issueType: "", description: "", priority: "", contactMethod: "" });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Service & Maintenance</h1>
          <p className="text-muted-foreground text-lg">
            Keep your robots running at peak performance with our expert service team
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Service Request Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wrench className="mr-2 h-5 w-5" />
                Submit Service Request
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="device-select">Select Device</Label>
                  <Select value={formData.deviceId} onValueChange={(value) => handleInputChange("deviceId", value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Choose your device" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="guard-x1">Guardian Security Bot X1</SelectItem>
                      <SelectItem value="homepal-pro">HomePal Assistant Pro</SelectItem>
                      <SelectItem value="industri-3000">IndustriMax Welder 3000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="issue-type">Issue Type</Label>
                  <Select value={formData.issueType} onValueChange={(value) => handleInputChange("issueType", value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select issue type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hardware">Hardware Problem</SelectItem>
                      <SelectItem value="software">Software Issue</SelectItem>
                      <SelectItem value="maintenance">Routine Maintenance</SelectItem>
                      <SelectItem value="upgrade">Upgrade Request</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Can wait a few days</SelectItem>
                      <SelectItem value="medium">Medium - Within 48 hours</SelectItem>
                      <SelectItem value="high">High - Urgent, within 24 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="preferred-date">Preferred Service Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full mt-2 justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="description">Problem Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Please describe the issue in detail, including any error messages, when it started, and what you were doing when it occurred..."
                    className="mt-2"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="contact-method">Preferred Contact Method</Label>
                  <Select value={formData.contactMethod} onValueChange={(value) => handleInputChange("contactMethod", value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="How should we contact you?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone Call</SelectItem>
                      <SelectItem value="sms">SMS Text</SelectItem>
                      <SelectItem value="app">In-App Notification</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" variant="cta" className="w-full">
                  Submit Service Request
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Service Types */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {serviceTypes.map((service) => (
                    <div key={service.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <h3 className="font-semibold mb-2">{service.name}</h3>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/20">
              <CardHeader>
                <CardTitle className="text-red-600 dark:text-red-400 flex items-center">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  Emergency Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  For critical system failures or safety emergencies, contact our 24/7 support line immediately.
                </p>
                <Button variant="destructive" className="w-full">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Emergency Contact: 1-800-ROBO-911
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Service Tickets */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Service Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            {recentTickets.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No recent service requests found.</p>
            ) : (
              <div className="space-y-4">
                {recentTickets.map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium">{ticket.id}</p>
                        <p className="text-sm text-muted-foreground">{ticket.device}</p>
                      </div>
                      <div>
                        <p className="text-sm">{ticket.issue}</p>
                        <p className="text-xs text-muted-foreground">{ticket.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                        {ticket.priority.toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(ticket.status)}>
                        {getStatusIcon(ticket.status)}
                        <span className="ml-1 capitalize">{ticket.status}</span>
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Service;