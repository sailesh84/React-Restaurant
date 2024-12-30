/**
 * HttpResponse interface
 */
export interface HttpResponse {
  /**
   * @Ignore
   */
  readonly status: string;
  /**
   * @Ignore
   */
  readonly statuscode: number;
  /**
   * @Ignore
   */
  readonly type: string;
  /**
   * @Ignore
   */
  readonly totalRecords: number;
  /**
   * @Ignore
   */
  readonly success: boolean;
  /**
   * @Ignore
   */
  readonly message: string;
  /**
   * @Ignore
   */
  readonly data: any;
}
