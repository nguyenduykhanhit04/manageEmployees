/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * messages.ts, 22/8/2026 nguyenduykhanh2
 */

/**
 * Định nghĩa các mẫu thông báo thành công (MSG001 - MSG003)
 */
export const SUCCESS_MESSAGES: Record<string, string> = {
  MSG001: 'ユーザの登録が完了しました。', // Thêm thành công
  MSG002: 'ユーザの更新が完了しました。', // Sửa thành công
  MSG003: 'ユーザの削除が完了しました。', // Xóa thành công
};

/**
 * Định nghĩa các mẫu câu thông báo lỗi chuẩn (ER001 - ER023)
 * {0}, {1}, {2}... sẽ được thay thế động bởi danh sách params tương ứng.
 */
export const ERROR_MESSAGES: Record<string, string> = {
  ER001: '{0}を入力してください。',
  ER002: '{0}を選択してください。',
  ER003: '{0}は既に存在しています。',
  ER004: '{0}は存在していません。',
  ER005: '{0}を正しい書式で入力してください。',
  ER006: '{0}を{1}文字以下で入力してください。',
  ER007: '{0}を{1}桁で入力してください。',
  ER008: '{0}は半角英数を入力してください。',
  ER009: '{0}はカタカナで入力してください。',
  ER011: '{0}を正しい書式で入力してください。',
  ER012: '{0}は{1}より後の日付を入力してください。',
  ER013: '該当するユーザは存在しません。',
  ER014: '該当するユーザは存在しません。',
  ER015: 'システムエラーが発生しました。',
  ER017: 'パスワード（確認）が一致しません。',
  ER018: '{0}は半角英数を入力してください。',
  ER019: '{0}を正しい書式で入力してください。',
  ER021: '{0}のソート順が不正です。',
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
  certificationId: '資格',
  startDate: '資格交付日',
  endDate: '失効日',
  score: '点数',
  offset: 'オフセット',
  limit: 'リミット',
};
