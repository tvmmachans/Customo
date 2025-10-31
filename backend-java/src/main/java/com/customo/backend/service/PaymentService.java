package com.customo.backend.service;

import com.customo.backend.entity.Order;
import com.customo.backend.repository.OrderRepository;
import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

@Service
public class PaymentService {

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    private final OrderRepository orderRepository;

    public PaymentService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @PostConstruct
    public void initStripe() {
        Stripe.apiKey = stripeApiKey;
    }

    public PaymentIntent createPaymentIntent(Long amount, String currency, String orderId) throws Exception {
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amount)
                .setCurrency(currency)
                .putMetadata("orderId", orderId)
                .build();

        return PaymentIntent.create(params);
    }

    public void confirmPayment(String paymentIntentId, String orderId) throws Exception {
        PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
        if ("succeeded".equals(paymentIntent.getStatus())) {
            // Update order status
            Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
            order.setStatus(Order.OrderStatus.CONFIRMED);
            orderRepository.save(order);
        }
    }
}
