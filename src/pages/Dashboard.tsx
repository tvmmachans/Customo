import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  ShoppingCart, 
  Package, 
  Users, 
  TrendingUp, 
  Settings,
  Plus,
  Eye
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Total Devices",
      value: "12",
      change: "+2 this month",
      icon: Bot,
      color: "text-blue-600"
    },
    {
      title: "Active Orders",
      value: "3",
      change: "2 pending",
      icon: ShoppingCart,
      color: "text-green-600"
    },
    {
      title: "Products Available",
      value: "24",
      change: "4 new items",
      icon: Package,
      color: "text-purple-600"
    },
    {
      title: "Total Customers",
      value: "1,247",
      change: "+15 this week",
      icon: Users,
      color: "text-orange-600"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: "order",
      message: "New order #ORD-001 placed for Guardian Security Bot X1",
      time: "2 hours ago",
      status: "pending"
    },
    {
      id: 2,
      type: "device",
      message: "HomePal Assistant Pro went offline",
      time: "4 hours ago",
      status: "warning"
    },
    {
      id: 3,
      type: "service",
      message: "Service ticket #TK-003 completed",
      time: "1 day ago",
      status: "success"
    },
    {
      id: 4,
      type: "custom",
      message: "Custom build request #CB-002 submitted",
      time: "2 days ago",
      status: "pending"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "pending":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your robotics platform.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:glow-primary transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-muted`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className={`w-2 h-2 rounded-full mt-2 ${getStatusColor(activity.status)}`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/shop')}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Product
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/your-devices')}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View All Devices
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/orders')}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Manage Orders
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/custom-build')}
                >
                  <Bot className="mr-2 h-4 w-4" />
                  Custom Builds
                </Button>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">API Server</span>
                  <Badge className="bg-green-500">Online</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Database</span>
                  <Badge className="bg-green-500">Online</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Payment Gateway</span>
                  <Badge className="bg-green-500">Online</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Email Service</span>
                  <Badge className="bg-green-500">Online</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
