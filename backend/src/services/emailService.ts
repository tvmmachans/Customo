import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Email templates
const emailTemplates = {
  welcome: (userName: string) => ({
    subject: 'Welcome to Customo RoBo!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Welcome to Customo RoBo!</h1>
        <p>Hello ${userName},</p>
        <p>Welcome to the future of robotics! We're excited to have you join our community of innovators and robot enthusiasts.</p>
        <p>With your account, you can:</p>
        <ul>
          <li>Browse our extensive catalog of robots and components</li>
          <li>Build custom robots with our advanced builder</li>
          <li>Monitor and control your devices remotely</li>
          <li>Access 24/7 technical support</li>
        </ul>
        <p>Ready to get started? <a href="${process.env.FRONTEND_URL}/shop" style="color: #2563eb;">Explore our products</a></p>
        <p>Best regards,<br>The Customo RoBo Team</p>
      </div>
    `
  }),

  orderConfirmation: (order: any) => ({
    subject: `Order Confirmation - ${order.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Order Confirmed!</h1>
        <p>Thank you for your order. We've received your payment and are processing your request.</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Order Details</h3>
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>Total Amount:</strong> $${order.totalAmount}</p>
          <p><strong>Status:</strong> ${order.status}</p>
        </div>
        <p>We'll send you tracking information once your order ships.</p>
        <p>Questions? <a href="${process.env.FRONTEND_URL}/contact" style="color: #2563eb;">Contact our support team</a></p>
        <p>Best regards,<br>The Customo RoBo Team</p>
      </div>
    `
  }),

  orderShipped: (order: any) => ({
    subject: `Your Order Has Shipped - ${order.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Your Order is on the Way!</h1>
        <p>Great news! Your order has been shipped and is on its way to you.</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Shipping Details</h3>
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>
          <p><strong>Estimated Delivery:</strong> 3-5 business days</p>
        </div>
        <p><a href="${process.env.FRONTEND_URL}/orders/${order.id}/tracking" style="color: #2563eb;">Track your package</a></p>
        <p>Best regards,<br>The Customo RoBo Team</p>
      </div>
    `
  }),

  serviceTicketCreated: (ticket: any) => ({
    subject: `Service Ticket Created - ${ticket.ticketNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Service Ticket Created</h1>
        <p>We've received your service request and will get back to you soon.</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Ticket Details</h3>
          <p><strong>Ticket Number:</strong> ${ticket.ticketNumber}</p>
          <p><strong>Issue:</strong> ${ticket.title}</p>
          <p><strong>Priority:</strong> ${ticket.priority}</p>
          <p><strong>Status:</strong> ${ticket.status}</p>
        </div>
        <p>Our technical team will review your request and contact you within 24 hours.</p>
        <p><a href="${process.env.FRONTEND_URL}/service/tickets/${ticket.id}" style="color: #2563eb;">View ticket status</a></p>
        <p>Best regards,<br>The Customo RoBo Team</p>
      </div>
    `
  }),

  serviceTicketUpdated: (ticket: any) => ({
    subject: `Service Ticket Update - ${ticket.ticketNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Service Ticket Update</h1>
        <p>Your service ticket has been updated.</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Ticket Details</h3>
          <p><strong>Ticket Number:</strong> ${ticket.ticketNumber}</p>
          <p><strong>Status:</strong> ${ticket.status}</p>
          <p><strong>Priority:</strong> ${ticket.priority}</p>
          ${ticket.assignedTo ? `<p><strong>Assigned To:</strong> ${ticket.assignedTo}</p>` : ''}
        </div>
        <p><a href="${process.env.FRONTEND_URL}/service/tickets/${ticket.id}" style="color: #2563eb;">View ticket details</a></p>
        <p>Best regards,<br>The Customo RoBo Team</p>
      </div>
    `
  }),

  customBuildQuote: (build: any) => ({
    subject: `Custom Build Quote Request - ${build.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Custom Build Quote Request</h1>
        <p>Thank you for your custom build request. Our engineering team will review your specifications and provide a detailed quote.</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Build Details</h3>
          <p><strong>Build Name:</strong> ${build.name}</p>
          <p><strong>Total Cost:</strong> $${build.totalCost}</p>
          <p><strong>Status:</strong> ${build.status}</p>
        </div>
        <p>We'll review your design and get back to you with a detailed quote within 2-3 business days.</p>
        <p><a href="${process.env.FRONTEND_URL}/custom-build/${build.id}" style="color: #2563eb;">View build details</a></p>
        <p>Best regards,<br>The Customo RoBo Team</p>
      </div>
    `
  }),

  passwordReset: (userName: string, resetToken: string) => ({
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Password Reset Request</h1>
        <p>Hello ${userName},</p>
        <p>We received a request to reset your password. Click the link below to reset your password:</p>
        <p><a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}" style="color: #2563eb; background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
        <p>This link will expire in 1 hour for security reasons.</p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <p>Best regards,<br>The Customo RoBo Team</p>
      </div>
    `
  }),

  lowBatteryAlert: (device: any) => ({
    subject: `Low Battery Alert - ${device.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #dc2626;">Low Battery Alert</h1>
        <p>Your device battery is running low and needs attention.</p>
        <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
          <h3>Device Details</h3>
          <p><strong>Device:</strong> ${device.name}</p>
          <p><strong>Battery Level:</strong> ${device.battery}%</p>
          <p><strong>Location:</strong> ${device.location}</p>
        </div>
        <p>Please charge your device or schedule maintenance to avoid service interruption.</p>
        <p><a href="${process.env.FRONTEND_URL}/devices/${device.id}" style="color: #2563eb;">Manage device</a></p>
        <p>Best regards,<br>The Customo RoBo Team</p>
      </div>
    `
  })
};

// Email service functions
export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@customorobo.com',
      to,
      subject,
      html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

export const sendWelcomeEmail = async (userEmail: string, userName: string) => {
  const template = emailTemplates.welcome(userName);
  return sendEmail(userEmail, template.subject, template.html);
};

export const sendOrderConfirmationEmail = async (userEmail: string, order: any) => {
  const template = emailTemplates.orderConfirmation(order);
  return sendEmail(userEmail, template.subject, template.html);
};

export const sendOrderShippedEmail = async (userEmail: string, order: any) => {
  const template = emailTemplates.orderShipped(order);
  return sendEmail(userEmail, template.subject, template.html);
};

export const sendServiceTicketCreatedEmail = async (userEmail: string, ticket: any) => {
  const template = emailTemplates.serviceTicketCreated(ticket);
  return sendEmail(userEmail, template.subject, template.html);
};

export const sendServiceTicketUpdatedEmail = async (userEmail: string, ticket: any) => {
  const template = emailTemplates.serviceTicketUpdated(ticket);
  return sendEmail(userEmail, template.subject, template.html);
};

export const sendCustomBuildQuoteEmail = async (userEmail: string, build: any) => {
  const template = emailTemplates.customBuildQuote(build);
  return sendEmail(userEmail, template.subject, template.html);
};

export const sendPasswordResetEmail = async (userEmail: string, userName: string, resetToken: string) => {
  const template = emailTemplates.passwordReset(userName, resetToken);
  return sendEmail(userEmail, template.subject, template.html);
};

export const sendLowBatteryAlertEmail = async (userEmail: string, device: any) => {
  const template = emailTemplates.lowBatteryAlert(device);
  return sendEmail(userEmail, template.subject, template.html);
};

// Initialize email service
export const initializeEmailService = () => {
  console.log('📧 Email service initialized');
  
  // Test email configuration
  const transporter = createTransporter();
  transporter.verify((error: Error | null, success?: boolean) => {
    if (error) {
      console.error('❌ Email service configuration error:', error);
    } else {
      console.log('✅ Email service ready to send emails');
    }
  });
};

// Bulk email functions
export const sendBulkEmail = async (recipients: string[], subject: string, html: string) => {
  const promises = recipients.map(email => sendEmail(email, subject, html));
  return Promise.allSettled(promises);
};

// Newsletter template
export const sendNewsletter = async (recipients: string[], newsletterData: any) => {
  const template = {
    subject: `Customo RoBo Newsletter - ${newsletterData.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">${newsletterData.title}</h1>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          ${newsletterData.content}
        </div>
        <p>Stay updated with the latest in robotics technology!</p>
        <p><a href="${process.env.FRONTEND_URL}/unsubscribe" style="color: #6b7280;">Unsubscribe</a></p>
        <p>Best regards,<br>The Customo RoBo Team</p>
      </div>
    `
  };

  return sendBulkEmail(recipients, template.subject, template.html);
};
