package com.luvina.la.config.jwt;

/**
 * Copyright(C) 2026 Luvina Software Company
 * <p>
 * UserDetailsServiceImpl.java, 4/10/2026 nathu303
 */

import com.luvina.la.entity.Employee;
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
 * @author nathu303
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
     * <p>
     * Phương thức này:
     * 1. Tìm kiếm employee theo employee_login_id (username)
     * 2. Nếu tìm thấy, tạo AuthUserDetails với quyền ROLE_USER
     * 3. Nếu không tìm thấy, throw UsernameNotFoundException
     *
     * @param username Employee Login ID
     * @return UserDetails object
     * @throws UsernameNotFoundException nếu employee không tồn tại
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<Employee> entity = this.userRepository.findByEmployeeLoginId(username);
        Collection<GrantedAuthority> roles;

        if (entity.isPresent()) {
            // Tất cả users có role ROLE_USER
            roles = Collections.singleton(new SimpleGrantedAuthority("ROLE_USER"));
            return new AuthUserDetails(entity.get(), roles);
        } else {
            throw new UsernameNotFoundException("Employee not found with username: " + username);
        }
    }
}
