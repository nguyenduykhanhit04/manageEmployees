/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * UserDetailsServiceImpl.java, 25/08/2026 nguyenduykhanh2
 */
package com.luvina.la.config.jwt;

import com.luvina.la.entity.EmployeeEntity;
import com.luvina.la.repository.EmployeeRepository;
import java.util.Collection;
import java.util.Collections;
import java.util.Optional;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * User Details Service implementation tải thông tin người dùng từ database.
 * Lớp này được sử dụng bởi Spring Security để tải user details cho authentication.
 *
 * @author nguyenduykhanh2
 * @since 1.0
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    /** Employee Repository tải dữ liệu từ database */
    final EmployeeRepository userRepository;

    /**
     * Constructor khởi tạo UserDetailsServiceImpl.
     *
     * @param userRepository Employee Repository
     */
    UserDetailsServiceImpl(EmployeeRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Tải thông tin user theo username.
     *
     * @param username Employee Login ID
     * @return UserDetails object
     * @throws UsernameNotFoundException nếu employee không tồn tại
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<EmployeeEntity> entity = this.userRepository.findByEmployeeLoginId(username);
        Collection<GrantedAuthority> roles;

        if (entity.isPresent()) {
            roles = Collections.singleton(new SimpleGrantedAuthority("ROLE_USER"));
            return new AuthUserDetails(entity.get(), roles);
        } else {
            throw new UsernameNotFoundException("Employee not found with username: " + username);
        }
    }
}
