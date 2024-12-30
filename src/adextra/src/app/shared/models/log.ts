/**
 * Log interface
 */
export interface Log {
  /**
   * @Ignore
   */
  readonly _id: string;
  /**
   * @Ignore
   */
  severity: number;
  /**
   * @Ignore
   */
  date: number;
  /**
   * @Ignore
   */
  user: string;
  /**
   * @Ignore
   */
  sourceIP: string;
  /**
   * @Ignore
   */
  userAgent: string;
  /**
   * @Ignore
   */
  message: string;
  /**
   * @Ignore
   */
  location?: number[];
}
