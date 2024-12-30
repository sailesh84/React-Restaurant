/**
 * Notification interface
 */
export interface Notification {
  /**
   * @Ignore
   */
  readonly _id: string;
  /**
   * @Ignore
   */
  name: string;
  /**
   * @Ignore
   */
  message: string;
  /**
   * @Ignore
   */
  type: number; // 0 = email, 1 = push, 2 = sms
  /**
   * @Ignore
   */
  action: number; // 0 = ADD/CREATE, 1 = EDIT/UPDATE, 2 = DELETE
}
