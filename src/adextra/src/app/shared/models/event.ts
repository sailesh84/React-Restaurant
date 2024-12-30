/**
 * Event interface
 */
export interface Event {
  /**
   * @Ignore
   */
  readonly _id: string;
  /**
   * @Ignore
   */
  title: string;
  /**
   * @Ignore
   */
  start: Date;
  /**
   * @Ignore
   */
  end: Date;
  /**
   * @Ignore
   */
  backgroundColor: string;
  /**
   * @Ignore
   */
  textColor: string;
  /**
   * @Ignore
   */
  extendedProps: {
    imageUrl: string;
    description: string;
  };
}
