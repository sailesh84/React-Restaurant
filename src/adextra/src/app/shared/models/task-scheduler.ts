/**
 * TaskScheduler interface
 */
export interface TaskScheduler {
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
  color: string;
  /**
   * @Ignore
   */
  start: number;
  /**
   * @Ignore
   */
  end: number;
  /**
   * @Ignore
   */
  run: boolean;
  /**
   * @Ignore
   */
  forcedRun: boolean;
  /**
   * @Ignore
   */
  weathervaning: boolean;
  /**
   * @Ignore
   */
   tPopVal: number;
  /**
   * @Ignore
   */
  offshoreDuration: number;
  /**
   * @Ignore
   */
  predecessor: number;
  /**
   * @Ignore
   */
  status: number;
  /**
   * @Ignore
   */
  alphaFactorTableName: string;
  /**
  * @Ignore
  */
  alphaFactorTable: { headers: string[], cols: number[], rows: { operator: string, value: number, data: number[] }[], notes: '' };
}
