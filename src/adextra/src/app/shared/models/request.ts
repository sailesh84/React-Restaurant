/**
 * Request interface
 */
export interface Request {
  /**
   * @Ignore
   */
  readonly _id: string;
  /**
   * @Ignore
   */
  email: string;
  /**
   * @Ignore
   */
  buyerName: string;
  /**
   * @Ignore
   */
  reason: string;
  /**
   * @Ignore
   */
  type: number;
  /**
   * @Ignore
   */
  createdAt: number;
  /**
   * @Ignore
   */
  closedAt: number;
  /**
   * @Ignore
   */
  status: number;
  /**
   * @Ignore
   */
  managedBy: any[];
}
