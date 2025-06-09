package com.redecuidar.controller;

import com.redecuidar.dto.AuthRequest;
import com.redecuidar.dto.AuthResponse;
import com.redecuidar.service.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
/*@CrossOrigin(origins = "*")*/
public class AuthController {

    @Autowired
    private AuthenticationService authenticationService;

    /*@PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        return authenticationService.autenticar(request);
    }*/

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        AuthResponse response = authenticationService.autenticar(request);
        return ResponseEntity.ok(response);
    }
}
