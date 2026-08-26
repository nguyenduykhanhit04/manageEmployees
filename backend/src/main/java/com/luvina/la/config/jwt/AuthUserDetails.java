/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * AuthUserDetails.java, 25/08/2026 nguyenduykhanh2
 */
package com.luvina.la.config.jwt;

import com.luvina.la.entity.EmployeeEntity;
import java.util.Collection;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

/**
 * Lớp cài đặt UserDetails lưu thông tin xác thực của nhân viên trong Spring Security.
 *
 * @author nguyenduykhanh2
 */
@Data
@AllArgsConstructor
public class AuthUserDetails implements UserDetails {

    private EmployeeEntity employee;
    private Collection<GrantedAuthority> authorities;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.authorities;
    }

    @Override
    public String getPassword() {
        return employee.getEmployeeLoginPassword();
    }

    @Override
    public String getUsername() {
        return employee.getEmployeeLoginId();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
