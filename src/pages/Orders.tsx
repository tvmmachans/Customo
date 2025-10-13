import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  Eye, 
  Package, 
  Truck, 
  CheckCircle,
  Clock,
  X
} from 'lucide-react';

const Orders = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const orders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'delivered',
      total: 4498,
      items: 2,
      trackingNumber: 'TRK-123456789',
      shippingAddress: '123 Main St, San Francisco, CA 94105'
    },
    {
      id: 'ORD-002',
      date: '2024-01-10',
      status: 'shipped',
      total: 2999,
      items: 1,
      trackingNumber: 'TRK-987654321',
      shippingAddress: '456 Oak Ave, Los Angeles, CA 90210'
    },
    {
      id: 'ORD-003',
      date: '2024-01-08',
      status: 'processing',
      total: 1499,
      items: 1,
      trackingNumber: null,
      shippingAddress: '789 Pine St, San Diego, CA 92101'
    },
    {
      id: 'ORD-004',
      date: '2024-01-05',
      status: 'cancelled',
      total: 899,
      items: 1,
      trackingNumber: null,
      shippingAddress: '321 Elm St, San Jose, CA 95110'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500';
      case 'shipped':
        return 'bg-blue-500';
      case 'processing':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'processing':
        return <Clock className="h-4 w-4" />;
      case 'cancelled':
        return <X className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Your Orders</h1>
          <p className="text-muted-foreground">
            Track and manage your robot orders
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders by ID or tracking number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('all')}
              size="sm"
            >
              All
            </Button>
            <Button
              variant={statusFilter === 'processing' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('processing')}
              size="sm"
            >
              Processing
            </Button>
            <Button
              variant={statusFilter === 'shipped' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('shipped')}
              size="sm"
            >
              Shipped
            </Button>
            <Button
              variant={statusFilter === 'delivered' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('delivered')}
              size="sm"
            >
              Delivered
            </Button>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Orders Found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'No orders match your current filters.' 
                    : "You haven't placed any orders yet."}
                </p>
                <Button variant="cta" onClick={() => navigate('/shop')}>
                  Start Shopping
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id} className="hover:glow-primary transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Order {order.id}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Placed on {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/orders/${order.id}`)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="text-lg font-semibold">${order.total.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Items</p>
                      <p className="text-lg font-semibold">{order.items} item{order.items > 1 ? 's' : ''}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Shipping Address</p>
                      <p className="text-sm">{order.shippingAddress}</p>
                    </div>
                  </div>
                  
                  {order.trackingNumber && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Tracking Number</p>
                          <p className="font-medium">{order.trackingNumber}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Track Package
                        </Button>
                      </div>
                    </div>
                  )}

                  {order.status === 'delivered' && (
                    <div className="mt-4 pt-4 border-t">
                      <Button variant="outline" size="sm" className="mr-2">
                        Reorder
                      </Button>
                      <Button variant="outline" size="sm">
                        Leave Review
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Order Statistics */}
        <div className="mt-8 grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{orders.length}</p>
                </div>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Delivered</p>
                  <p className="text-2xl font-bold text-green-500">
                    {orders.filter(o => o.status === 'delivered').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Transit</p>
                  <p className="text-2xl font-bold text-blue-500">
                    {orders.filter(o => o.status === 'shipped').length}
                  </p>
                </div>
                <Truck className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold text-primary">
                    ${orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}
                  </p>
                </div>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  </div>
);
};

export default Orders;
