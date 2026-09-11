/**
 * Định nghĩa các mẫu thông báo thành công (MSG001 - MSG003)
 */
export const SUCCESS_MESSAGES: Record<string, string> = {
  MSG001: 'ユーザの登録が完了しました。', // Thêm thành công
  MSG002: 'ユーザの更新が完了しました。', // Sửa thành công
  MSG003: 'ユーザの削除が完了しました。', // Xóa thành công
};

/**
 * Định nghĩa các thông báo hệ thống / trạng thái hiển thị
 */
export const SYSTEM_MESSAGES = {
  MSG005: '該当するデータがありません。', // Không tìm thấy dữ liệu
  LOADING: 'データを読み込み中...', // Đang tải dữ liệu
} as const;

/**
 * Định nghĩa các mẫu câu thông báo lỗi chuẩn (ER001 - ER023)
 * {0}, {1}, {2}... sẽ được thay thế động bởi danh sách params tương ứng.
 */
export const ERROR_MESSAGES: Record<string, string> = {
  ER001: '「{0}」を入力してください',
  ER002: '「{0}」を入力してください',
  ER003: '「{0}」は既に存在しています。',
  ER004: '「{0}」は存在していません。',
  ER005: '「{0}」を{1}形式で入力してください',
  ER006: '{1}桁以内の「{0}」を入力してください',
  ER007: '「{0}」を{1}<=桁数、<={2}桁で入力してください',
  ER008: '「{0}」に半角英数を入力してください',
  ER009: '「{0}」をカタカナで入力してください',
  ER010: '「{0}」をひらがなで入力してください',
  ER011: '「{0}」は無効になっています。',
  ER012: '「{0}」は「{1}」より未来の日で入力してください。',
  ER013: '該当するユーザは存在しません。',
  ER014: '該当するユーザは存在しません。',
  ER015: 'システムエラーが発生しました。',
  ER016: '「アカウント名」または「パスワード」は不正です。',
  ER017: '「パスワード（確認）」が不正です。',
  ER018: '「{0}」は半角で入力してください。',
  ER019: '[アカウント名]は(a-z, A-Z, 0-9 と _)の桁のみです。最初の桁は数字ではない。',
  ER020: '管理者ユーザを削除することはできません。',
  ER021: 'ソートは（ASC, DESC）でなければなりません。',
  ER022: 'ページが見つかりません。',
  ER023: 'システムエラーが発生しました。',
};

/**
 * Nhãn trường tiếng Nhật chuẩn (Field labels)
 */
export const FIELD_LABELS: Record<string, string> = {
  employeeLoginId: 'アカウント名',
  employeeName: '氏名',
  employeeNameKana: 'カタカナ氏名',
  employeeBirthDate: '生年月日',
  departmentId: 'グループ',
  employeeEmail: 'メールアドレス',
  employeeTelephone: '電話番号',
  employeeLoginPassword: 'パスワード',
  employeeLoginPasswordConfirm: 'パスワード（確認）',
  certificationId: '資格',
  startDate: '資格交付日',
  endDate: '失効日',
  score: '点数',
  offset: 'オフセット',
  limit: 'リミット',
};

/**
 * Format chuỗi thông báo lỗi theo mã lỗi và danh sách tham số.
 *
 * @param code mã lỗi (ví dụ ER001, ER006)
 * @param params danh sách tham số thay thế vào template {0}, {1}...
 * @return chuỗi thông báo lỗi tiếng Nhật hoàn chỉnh
 */
export function formatErrorMessage(code: string, params: (string | number)[] = []): string {
  let template = ERROR_MESSAGES[code] || code;
  params.forEach((param, index) => {
    template = template.replace(new RegExp(`\\{${index}\\}`, 'g'), String(param));
  });
  // Xóa hoặc thay thế các placeholder còn sót lại nếu thiếu param
  template = template.replace(/\{1\}/g, 'xxx');
  template = template.replace(/\{(\d+)\}/g, '');
  return template;
}
