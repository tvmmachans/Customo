package com.customo.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class AuthIntegrationTest {
    @LocalServerPort
    int port;

    @Autowired
    TestRestTemplate rest;

    @Test
    public void registerAndLogin_shouldReturnToken() throws Exception {
        String base = "http://localhost:" + port + "/api/auth";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        String body = "{\"email\":\"itest@example.com\",\"password\":\"Pass1234!\",\"firstName\":\"IT\",\"lastName\":\"Test\"}";
        ResponseEntity<Map> register = rest.postForEntity(base + "/register", new HttpEntity<>(body, headers), Map.class);
        assertThat(register.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        Map data = (Map) register.getBody().get("data");
        assertThat(data).isNotNull();
        assertThat(((Map)data).get("token")).isNotNull();

        // Login
        String loginBody = "{\"email\":\"itest@example.com\",\"password\":\"Pass1234!\"}";
        ResponseEntity<Map> login = rest.postForEntity(base + "/login", new HttpEntity<>(loginBody, headers), Map.class);
        assertThat(login.getStatusCode()).isEqualTo(HttpStatus.OK);
        Map ldata = (Map) login.getBody().get("data");
        assertThat(((Map)ldata).get("token")).isNotNull();
    }
}
