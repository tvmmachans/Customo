import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Bot, 
  Battery, 
  Wifi, 
  Settings, 
  Play, 
  Pause, 
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Search,
  Filter
} from "lucide-react";

interface Device {
  id: string;
  name: string;
  type: string;
  status: string;
  battery: number;
  location?: string;
  tasks?: string;
  isOnline: boolean;
  lastSeen: string;
  createdAt: string;
  updatedAt: string;
}

const YourDevices = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [newDevice, setNewDevice] = useState({
    name: "",
    type: "",
    location: "",
    tasks: ""
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  // Load devices from backend
  useEffect(() => {
    if (isAuthenticated) {
      loadDevices();
    }
  }, [isAuthenticated]);

  const loadDevices = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;
      
      const response = await apiClient.getDevices(params);
      setDevices(response.devices);
    } catch (error) {
      console.error('Failed to load devices:', error);
      toast.error('Failed to load devices');
      // Fallback to empty array
      setDevices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadDevices();
  };

  const handleAddDevice = async () => {
    try {
      if (!newDevice.name || !newDevice.type) {
        toast.error('Name and type are required');
        return;
      }

      const device = await apiClient.createDevice(newDevice);
      setDevices(prev => [device, ...prev]);
      setNewDevice({ name: "", type: "", location: "", tasks: "" });
      setShowAddDevice(false);
      toast.success('Device added successfully');
    } catch (error) {
      console.error('Failed to add device:', error);
      toast.error('Failed to add device');
    }
  };

  const handleUpdateStatus = async (deviceId: string, status: string) => {
    try {
      const updatedDevice = await apiClient.updateDeviceStatus(deviceId, status);
      setDevices(prev => prev.map(d => d.id === deviceId ? updatedDevice : d));
      toast.success('Device status updated');
    } catch (error) {
      console.error('Failed to update device status:', error);
      toast.error('Failed to update device status');
    }
  };

  const handleUpdateBattery = async (deviceId: string, battery: number) => {
    try {
      const updatedDevice = await apiClient.updateDeviceBattery(deviceId, battery);
      setDevices(prev => prev.map(d => d.id === deviceId ? updatedDevice : d));
      toast.success('Device battery updated');
    } catch (error) {
      console.error('Failed to update device battery:', error);
      toast.error('Failed to update device battery');
    }
  };

  const handleDeleteDevice = async (deviceId: string) => {
    try {
      await apiClient.deleteDevice(deviceId);
      setDevices(prev => prev.filter(d => d.id !== deviceId));
      toast.success('Device deleted successfully');
    } catch (error) {
      console.error('Failed to delete device:', error);
      toast.error('Failed to delete device');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500";
      case "idle":
        return "bg-blue-500";
      case "maintenance":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-muted";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <Play className="h-4 w-4" />;
      case "idle":
        return <Pause className="h-4 w-4" />;
      case "maintenance":
        return <Settings className="h-4 w-4" />;
      case "offline":
        return <AlertTriangle className="h-4 w-4" />;
      case "error":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatLastSeen = (lastSeen: string) => {
    const date = new Date(lastSeen);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your devices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] pt-24 pb-12 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Your Devices</h1>
          <p className="text-muted-foreground">
            Manage and monitor your robotic devices
          </p>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search devices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="idle">Idle</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
          
          <Dialog open={showAddDevice} onOpenChange={setShowAddDevice}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Device
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Device</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Device Name *</Label>
                  <Input
                    id="name"
                    value={newDevice.name}
                    onChange={(e) => setNewDevice(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter device name"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Device Type *</Label>
                  <Select value={newDevice.type} onValueChange={(value) => setNewDevice(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select device type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Security">Security</SelectItem>
                      <SelectItem value="Assistant">Assistant</SelectItem>
                      <SelectItem value="Industrial">Industrial</SelectItem>
                      <SelectItem value="Service">Service</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newDevice.location}
                    onChange={(e) => setNewDevice(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Enter device location"
                  />
                </div>
                <div>
                  <Label htmlFor="tasks">Tasks</Label>
                  <Input
                    id="tasks"
                    value={newDevice.tasks}
                    onChange={(e) => setNewDevice(prev => ({ ...prev, tasks: e.target.value }))}
                    placeholder="Enter current tasks"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowAddDevice(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddDevice}>
                    Add Device
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Devices Grid */}
        {devices.length === 0 ? (
          <div className="text-center py-12">
            <Bot className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No devices found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter 
                ? "Try adjusting your search or filter criteria" 
                : "Add your first device to get started"}
            </p>
            {!searchTerm && !statusFilter && (
              <Button onClick={() => setShowAddDevice(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Device
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {devices.map((device) => (
              <Card key={device.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Bot className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{device.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{device.type}</p>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(device.status)} text-white`}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(device.status)}
                        <span className="capitalize">{device.status}</span>
                      </div>
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Battery */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center space-x-1">
                        <Battery className="h-4 w-4" />
                        <span>Battery</span>
                      </span>
                      <span>{device.battery}%</span>
                    </div>
                    <Progress value={device.battery} className="h-2" />
                  </div>

                  {/* Connection Status */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center space-x-1">
                      <Wifi className={`h-4 w-4 ${device.isOnline ? 'text-green-500' : 'text-red-500'}`} />
                      <span>Connection</span>
                    </span>
                    <span className={device.isOnline ? 'text-green-500' : 'text-red-500'}>
                      {device.isOnline ? 'Online' : 'Offline'}
                    </span>
                  </div>

                  {/* Location */}
                  {device.location && (
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Location:</span> {device.location}
                    </div>
                  )}

                  {/* Tasks */}
                  {device.tasks && (
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Tasks:</span> {device.tasks}
                    </div>
                  )}

                  {/* Last Seen */}
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Last seen:</span> {formatLastSeen(device.lastSeen)}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-2">
                    <Select 
                      value={device.status} 
                      onValueChange={(value) => handleUpdateStatus(device.id, value)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="idle">Idle</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="offline">Offline</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteDevice(device.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default YourDevices;