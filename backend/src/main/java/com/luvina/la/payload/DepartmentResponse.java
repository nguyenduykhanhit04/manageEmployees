package com.luvina.la.payload;

import com.luvina.la.dto.DepartmentDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class DepartmentResponse {
    private int code;
    private List<DepartmentDTO> departments;
}
