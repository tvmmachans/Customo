package com.customo.backend.controller;

import com.customo.backend.service.PaymentService;
import com.stripe.model.PaymentIntent;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:8080"})
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create-payment-intent")
    public ResponseEntity<Map<String, Object>> createPaymentIntent(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            Long amount = Long.valueOf(request.get("amount").toString());
            String currency = (String) request.get("currency");
            String orderId = (String) request.get("orderId");

            PaymentIntent paymentIntent = paymentService.createPaymentIntent(amount, currency, orderId);

            response.put("success", true);
            response.put("clientSecret", paymentIntent.getClientSecret());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error creating payment intent: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/confirm-payment")
    public ResponseEntity<Map<String, Object>> confirmPayment(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            String paymentIntentId = request.get("paymentIntentId");
            String orderId = request.get("orderId");

            paymentService.confirmPayment(paymentIntentId, orderId);

            response.put("success", true);
            response.put("message", "Payment confirmed successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error confirming payment: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
