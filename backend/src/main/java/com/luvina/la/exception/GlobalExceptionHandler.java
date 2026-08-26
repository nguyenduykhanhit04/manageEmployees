/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * GlobalExceptionHandler.java, 25/08/2026 nguyenduykhanh2
 */
package com.luvina.la.exception;

import com.luvina.la.config.Constants;
import com.luvina.la.payload.response.ApiErrorMessage;
import com.luvina.la.payload.response.ApiResponse;
import java.util.ArrayList;
import java.util.List;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

/**
 * Lớp bắt và xử lý ngoại lệ toàn cục cho toàn bộ hệ thống.
 *
 * @author nguyenduykhanh2
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * Xử lý ngoại lệ nghiệp vụ do Service ném ra.
     *
     * @param ex ngoại lệ BusinessException
     * @return phản hồi lỗi ApiResponse chuẩn
     */
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse> handleBusinessException(BusinessException ex) {
        log.warn("Business exception occurred: code={}, params={}", ex.getErrorCode(), ex.getParams());
        ApiErrorMessage errorMessage = new ApiErrorMessage(ex.getErrorCode(), ex.getParams());
        ApiResponse response = new ApiResponse(Constants.CODE_ERROR, errorMessage);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    /**
     * Xử lý ngoại lệ validation khi kiểm tra @RequestBody với @Valid.
     *
     * @param ex ngoại lệ MethodArgumentNotValidException
     * @return phản hồi lỗi ApiResponse chuẩn
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse> handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {
        FieldError fieldError = ex.getBindingResult().getFieldError();
        String errorCode = Constants.ER015;
        List<String> params = new ArrayList<>();

        if (fieldError != null) {
            errorCode = fieldError.getDefaultMessage() != null ? fieldError.getDefaultMessage() : Constants.ER015;
            params.add(fieldError.getField());
        }

        log.warn("Method argument not valid: code={}, field={}", errorCode, params);
        ApiErrorMessage errorMessage = new ApiErrorMessage(errorCode, params);
        ApiResponse response = new ApiResponse(Constants.CODE_ERROR, errorMessage);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    /**
     * Xử lý ngoại lệ validation khi kiểm tra BindException.
     *
     * @param ex ngoại lệ BindException
     * @return phản hồi lỗi ApiResponse chuẩn
     */
    @ExceptionHandler(BindException.class)
    public ResponseEntity<ApiResponse> handleBindException(BindException ex) {
        FieldError fieldError = ex.getBindingResult().getFieldError();
        String errorCode = Constants.ER015;
        List<String> params = new ArrayList<>();

        if (fieldError != null) {
            errorCode = fieldError.getDefaultMessage() != null ? fieldError.getDefaultMessage() : Constants.ER015;
            params.add(fieldError.getField());
        }

        log.warn("Bind exception: code={}, field={}", errorCode, params);
        ApiErrorMessage errorMessage = new ApiErrorMessage(errorCode, params);
        ApiResponse response = new ApiResponse(Constants.CODE_ERROR, errorMessage);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    /**
     * Xử lý ngoại lệ validation khi kiểm tra ConstraintViolationException.
     *
     * @param ex ngoại lệ ConstraintViolationException
     * @return phản hồi lỗi ApiResponse chuẩn
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse> handleConstraintViolation(ConstraintViolationException ex) {
        String errorCode = Constants.ER015;
        List<String> params = new ArrayList<>();

        for (ConstraintViolation<?> violation : ex.getConstraintViolations()) {
            errorCode = violation.getMessage();
            params.add(violation.getPropertyPath().toString());
            break;
        }

        log.warn("Constraint violation: code={}, params={}", errorCode, params);
        ApiErrorMessage errorMessage = new ApiErrorMessage(errorCode, params);
        ApiResponse response = new ApiResponse(Constants.CODE_ERROR, errorMessage);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    /**
     * Xử lý ngoại lệ khi thiếu tham số request bắt buộc.
     *
     * @param ex ngoại lệ MissingServletRequestParameterException
     * @return phản hồi lỗi ApiResponse chuẩn
     */
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ApiResponse> handleMissingParams(MissingServletRequestParameterException ex) {
        log.warn("Missing request parameter: {}", ex.getParameterName());
        ApiErrorMessage errorMessage = new ApiErrorMessage(Constants.ER001, List.of(ex.getParameterName()));
        ApiResponse response = new ApiResponse(Constants.CODE_ERROR, errorMessage);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    /**
     * Xử lý ngoại lệ khi tham số sai kiểu dữ liệu.
     *
     * @param ex ngoại lệ MethodArgumentTypeMismatchException
     * @return phản hồi lỗi ApiResponse chuẩn
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiResponse> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        log.warn("Parameter type mismatch: {}", ex.getName());
        ApiErrorMessage errorMessage = new ApiErrorMessage(Constants.ER018, List.of(ex.getName()));
        ApiResponse response = new ApiResponse(Constants.CODE_ERROR, errorMessage);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    /**
     * Xử lý tất cả các ngoại lệ không xác định khác.
     *
     * @param ex ngoại lệ tổng quát
     * @return phản hồi lỗi ApiResponse chuẩn với mã ER015
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse> handleGeneralException(Exception ex) {
        log.error("Unhandled exception occurred", ex);
        ApiErrorMessage errorMessage = new ApiErrorMessage(Constants.ER015, new ArrayList<>());
        ApiResponse response = new ApiResponse(Constants.CODE_ERROR, errorMessage);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
