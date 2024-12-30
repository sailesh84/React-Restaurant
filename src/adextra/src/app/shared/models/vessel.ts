/**
 * Vessel interface
 */
export interface Vessel {
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
  type: string;
  /**
   * @Ignore
   */
  image: string;
  /**
   * @Ignore
   */
  color: string;
  /**
   * @Ignore
   */
  disabled: boolean;
  /**
   * @Ignore
   */
  virtual: boolean;
  /**
   * @Ignore
   */
  virtualType?: number;
}
