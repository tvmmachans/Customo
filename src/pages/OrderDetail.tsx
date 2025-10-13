import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock,
  MapPin,
  CreditCard,
  Phone,
  Mail,
  Download,
  MessageSquare
} from 'lucide-react';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock order data - in real app, this would come from API
  const orderData = {
    id: id || 'ORD-001',
    date: '2024-01-15',
    status: 'delivered',
    total: 4498,
    subtotal: 4298,
    shipping: 25,
    tax: 175,
    items: [
      {
        id: 1,
        name: 'Guardian Security Bot X1',
        price: 2999,
        quantity: 1,
        image: '/placeholder.svg'
      },
      {
        id: 2,
        name: 'HomePal Assistant Pro',
        price: 1499,
        quantity: 1,
        image: '/placeholder.svg'
      }
    ],
    shippingAddress: {
      name: 'John Doe',
      street: '123 Main Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'United States',
      phone: '+1 (555) 123-4567'
    },
    billingAddress: {
      name: 'John Doe',
      street: '123 Main Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'United States'
    },
    paymentMethod: {
      type: 'credit_card',
      last4: '4242',
      brand: 'Visa'
    },
    trackingNumber: 'TRK-123456789',
    estimatedDelivery: '2024-01-18',
    actualDelivery: '2024-01-17'
  };

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
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const statusSteps = [
    { id: 1, name: 'Order Placed', date: orderData.date, completed: true },
    { id: 2, name: 'Processing', date: '2024-01-16', completed: true },
    { id: 3, name: 'Shipped', date: '2024-01-17', completed: true },
    { id: 4, name: 'Delivered', date: orderData.actualDelivery, completed: true }
  ];

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/orders')} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Order {orderData.id}</h1>
              <p className="text-muted-foreground">
                Placed on {new Date(orderData.date).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={getStatusColor(orderData.status)}>
                {getStatusIcon(orderData.status)}
                <span className="ml-1 capitalize">{orderData.status}</span>
              </Badge>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Invoice
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderData.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg bg-muted"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${item.price.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Order Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statusSteps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                        step.completed ? 'bg-green-500 text-white' : 'bg-muted'
                      }`}>
                        {step.completed ? <CheckCircle className="h-5 w-5" /> : step.id}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${step.completed ? 'text-green-600' : 'text-muted-foreground'}`}>
                          {step.name}
                        </p>
                        <p className="text-sm text-muted-foreground">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tracking Information */}
            {orderData.trackingNumber && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="mr-2 h-5 w-5" />
                    Tracking Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Tracking Number</p>
                      <p className="font-mono text-lg">{orderData.trackingNumber}</p>
                    </div>
                    <Button variant="outline">
                      Track Package
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary & Details */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${orderData.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${orderData.shipping}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${orderData.tax}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${orderData.total.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="font-medium">{orderData.shippingAddress.name}</p>
                  <p>{orderData.shippingAddress.street}</p>
                  <p>{orderData.shippingAddress.city}, {orderData.shippingAddress.state} {orderData.shippingAddress.zipCode}</p>
                  <p>{orderData.shippingAddress.country}</p>
                  <div className="flex items-center mt-2">
                    <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{orderData.shippingAddress.phone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium capitalize">
                    {orderData.paymentMethod.brand} •••• {orderData.paymentMethod.last4}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Billed to: {orderData.billingAddress.name}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contact Support
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Package className="mr-2 h-4 w-4" />
                  Reorder Items
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Download Invoice
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
