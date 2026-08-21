package com.luvina.la.payload;

import com.luvina.la.dto.DepartmentDTO;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentListResponse {
    private int code;
    private List<DepartmentDTO> departments;
}
