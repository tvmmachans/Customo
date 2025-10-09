"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting database seeding...');
    const adminPassword = await bcryptjs_1.default.hash('admin123', 12);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@customorobo.com' },
        update: {},
        create: {
            email: 'admin@customorobo.com',
            password: adminPassword,
            firstName: 'Admin',
            lastName: 'User',
            role: 'ADMIN',
            company: 'Customo RoBo'
        }
    });
    const customerPassword = await bcryptjs_1.default.hash('customer123', 12);
    const customer = await prisma.user.upsert({
        where: { email: 'customer@example.com' },
        update: {},
        create: {
            email: 'customer@example.com',
            password: customerPassword,
            firstName: 'John',
            lastName: 'Doe',
            role: 'CUSTOMER',
            company: 'Tech Corp'
        }
    });
    const techPassword = await bcryptjs_1.default.hash('tech123', 12);
    const technician = await prisma.user.upsert({
        where: { email: 'tech@customorobo.com' },
        update: {},
        create: {
            email: 'tech@customorobo.com',
            password: techPassword,
            firstName: 'Jane',
            lastName: 'Smith',
            role: 'TECHNICIAN',
            company: 'Customo RoBo'
        }
    });
    console.log('👥 Users created');
    const products = [
        {
            name: 'Guardian Security Bot X1',
            description: 'Advanced AI-powered security robot with night vision and patrol capabilities.',
            price: 2999.00,
            originalPrice: 3499.00,
            category: 'SECURITY',
            images: ['/placeholder.svg', '/placeholder.svg'],
            features: [
                '360° HD Camera with Night Vision',
                'AI-Powered Motion Detection',
                'Autonomous Patrol Routes',
                'Real-time Alert System',
                'Weather Resistant Design',
                '12-Hour Battery Life'
            ],
            specifications: {
                'Height': '1.2m',
                'Weight': '45kg',
                'Battery': 'Li-ion 24V',
                'Speed': '2.5 m/s',
                'Range': '500m',
                'Connectivity': 'WiFi, 5G'
            },
            stockCount: 10,
            badge: 'Best Seller'
        },
        {
            name: 'HomePal Assistant Pro',
            description: 'Smart home assistant robot with voice control and task automation.',
            price: 1499.00,
            category: 'ASSISTANT',
            images: ['/placeholder.svg', '/placeholder.svg'],
            features: [
                'Voice Recognition',
                'Smart Home Integration',
                'Task Automation',
                'Mobile App Control',
                'Facial Recognition',
                '8-Hour Battery Life'
            ],
            specifications: {
                'Height': '0.8m',
                'Weight': '25kg',
                'Battery': 'Li-ion 12V',
                'Speed': '1.5 m/s',
                'Range': '200m',
                'Connectivity': 'WiFi, Bluetooth'
            },
            stockCount: 15,
            badge: 'New'
        },
        {
            name: 'IndustriMax Welder 3000',
            description: 'Heavy-duty industrial welding robot with precision control.',
            price: 4999.00,
            category: 'INDUSTRIAL',
            images: ['/placeholder.svg', '/placeholder.svg'],
            features: [
                'Precision Welding',
                'Heavy Duty Construction',
                'Industrial Grade',
                'Remote Control',
                'Safety Systems',
                '24-Hour Operation'
            ],
            specifications: {
                'Height': '2.5m',
                'Weight': '150kg',
                'Battery': 'Industrial 48V',
                'Speed': '0.5 m/s',
                'Range': '1000m',
                'Connectivity': 'WiFi, Ethernet'
            },
            stockCount: 5,
            badge: 'Pro'
        },
        {
            name: 'SkyEye Surveillance Drone',
            description: 'Autonomous surveillance drone with 4K camera and AI detection.',
            price: 899.00,
            category: 'DRONE',
            images: ['/placeholder.svg', '/placeholder.svg'],
            features: [
                '4K Camera',
                'AI Detection',
                'Autonomous Flight',
                'Weather Resistant',
                'GPS Navigation',
                '2-Hour Flight Time'
            ],
            specifications: {
                'Wingspan': '1.2m',
                'Weight': '2kg',
                'Battery': 'Li-ion 14.8V',
                'Speed': '15 m/s',
                'Range': '5km',
                'Connectivity': 'WiFi, 4G'
            },
            stockCount: 20,
            badge: 'Popular'
        },
        {
            name: 'RoboCore AI Processor X1',
            description: 'Neural processing unit for advanced AI applications.',
            price: 899.00,
            category: 'COMPONENT',
            images: ['/placeholder.svg'],
            features: [
                'Neural Processing',
                '2.5 GHz Speed',
                'AI Optimization',
                'Low Power Consumption',
                'Modular Design'
            ],
            specifications: {
                'Processor': 'ARM Cortex-A78',
                'RAM': '8GB LPDDR5',
                'Storage': '256GB NVMe',
                'Power': '15W TDP',
                'Interface': 'PCIe 4.0'
            },
            stockCount: 50,
            badge: ''
        },
        {
            name: 'PowerMax Li-ion 5000mAh',
            description: 'High-capacity battery pack for extended robot operation.',
            price: 299.00,
            category: 'COMPONENT',
            images: ['/placeholder.svg'],
            features: [
                '5000mAh Capacity',
                '12V Output',
                '8-Hour Runtime',
                'Fast Charging',
                'Safety Protection'
            ],
            specifications: {
                'Capacity': '5000mAh',
                'Voltage': '12V',
                'Chemistry': 'Li-ion',
                'Weight': '1.2kg',
                'Charging': '2A Fast Charge'
            },
            stockCount: 100,
            badge: ''
        }
    ];
    for (const productData of products) {
        await prisma.product.upsert({
            where: { name: productData.name },
            update: {},
            create: productData
        });
    }
    console.log('🛍️ Products created');
    const devices = [
        {
            name: 'Guardian Security Bot X1',
            type: 'Security',
            status: 'ACTIVE',
            battery: 85,
            location: 'Warehouse A - Zone 1',
            isOnline: true,
            tasks: 'Perimeter patrol active',
            userId: customer.id
        },
        {
            name: 'HomePal Assistant Pro',
            type: 'Assistant',
            status: 'IDLE',
            battery: 92,
            location: 'Living Room',
            isOnline: true,
            tasks: 'Standby mode',
            userId: customer.id
        },
        {
            name: 'IndustriMax Welder 3000',
            type: 'Industrial',
            status: 'MAINTENANCE',
            battery: 45,
            location: 'Factory Floor B',
            isOnline: false,
            tasks: 'Scheduled maintenance',
            userId: customer.id
        }
    ];
    for (const deviceData of devices) {
        await prisma.device.create({
            data: deviceData
        });
    }
    console.log('🤖 Devices created');
    const tickets = [
        {
            ticketNumber: 'TK-001',
            userId: customer.id,
            title: 'Camera alignment issues',
            description: 'The security bot camera is not properly aligned and showing blurry images.',
            issueType: 'Hardware Problem',
            priority: 'HIGH',
            status: 'IN_PROGRESS',
            assignedTo: technician.email
        },
        {
            ticketNumber: 'TK-002',
            userId: customer.id,
            title: 'Voice recognition not working',
            description: 'The assistant bot is not responding to voice commands properly.',
            issueType: 'Software Issue',
            priority: 'MEDIUM',
            status: 'COMPLETED'
        }
    ];
    for (const ticketData of tickets) {
        await prisma.serviceTicket.create({
            data: ticketData
        });
    }
    console.log('🎫 Service tickets created');
    const order = await prisma.order.create({
        data: {
            orderNumber: 'ORD-000001',
            userId: customer.id,
            totalAmount: 2999.00,
            status: 'DELIVERED',
            paymentStatus: 'PAID',
            shippingAddress: {
                street: '123 Tech Street',
                city: 'San Francisco',
                state: 'CA',
                zipCode: '94105',
                country: 'USA'
            },
            billingAddress: {
                street: '123 Tech Street',
                city: 'San Francisco',
                state: 'CA',
                zipCode: '94105',
                country: 'USA'
            }
        }
    });
    const guardianProduct = await prisma.product.findFirst({
        where: { name: 'Guardian Security Bot X1' }
    });
    if (guardianProduct) {
        await prisma.orderItem.create({
            data: {
                orderId: order.id,
                productId: guardianProduct.id,
                quantity: 1,
                price: guardianProduct.price
            }
        });
    }
    console.log('📦 Orders created');
    const reviews = [
        {
            userId: customer.id,
            productId: guardianProduct?.id,
            rating: 5,
            title: 'Excellent security robot!',
            comment: 'The AI detection is incredibly accurate and the night vision works perfectly. Highly recommended!',
            isVerified: true
        }
    ];
    for (const reviewData of reviews) {
        if (reviewData.productId) {
            await prisma.review.create({
                data: reviewData
            });
        }
    }
    console.log('⭐ Reviews created');
    console.log('✅ Database seeding completed!');
    console.log('\n📋 Test Accounts:');
    console.log('Admin: admin@customorobo.com / admin123');
    console.log('Customer: customer@example.com / customer123');
    console.log('Technician: tech@customorobo.com / tech123');
}
main()
    .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map