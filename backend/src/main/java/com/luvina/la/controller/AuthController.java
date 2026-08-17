package com.luvina.la.controller;


import com.luvina.la.config.jwt.AuthUserDetails;
import com.luvina.la.config.jwt.JwtTokenProvider;
import com.luvina.la.config.jwt.UserDetailsServiceImpl;
import com.luvina.la.payload.LoginRequest;
import com.luvina.la.payload.LoginResponse;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    final JwtTokenProvider tokenProvider;
    final AuthenticationManager authenticationManager;
    final UserDetailsServiceImpl userDetailsService;

    AuthController(AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider, UserDetailsServiceImpl userDetailsService) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = jwtTokenProvider;
        this.userDetailsService = userDetailsService;
    }

    /**
     * Login api
     *
     * @param loginRequest
     * @param request
     * @return
     */
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        Map<String, String> errors = new HashMap<>();
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String accessToken = tokenProvider.generateToken((AuthUserDetails) authentication.getPrincipal());
            return new LoginResponse(accessToken);
        } catch (UsernameNotFoundException | BadCredentialsException ex) {
            log.warn(ex.getMessage());
            errors.put("code", "100");
        } catch (Exception ex) {
            log.warn(ex.getMessage());
            // unknow error
            errors.put("code", "000");
        }
        return new LoginResponse(errors);
    }

    /**
     * test token API
     *
     * @return
     */
    @RequestMapping("/test-auth")
    public Map<String, String> testAuth() {
        Map<String, String> testData = new HashMap<>();
        testData.put("msg", "Token is valid");
        return testData;
    }
}
