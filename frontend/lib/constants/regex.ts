/** Regex kiểm tra Katakana bán giác (half-width Katakana và khoảng trắng) */
export const KATAKANA_REGEX = /^[\uFF65-\uFF9F ]+$/;

/** Regex kiểm tra half-size alphanumeric và dấu gạch dưới, không bắt đầu bằng số */
export const HALF_SIZE_REGEX = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

/** Regex kiểm tra số điện thoại (chỉ ký tự 1 byte số, dấu gạch ngang, cộng, ngoặc) */
export const TELEPHONE_REGEX = /^[0-9-+()]+$/;

/** Regex kiểm tra ký tự half-size (1 byte ASCII) cho email */
export const HALF_SIZE_ASCII_REGEX = /^[\x20-\x7E]+$/;
