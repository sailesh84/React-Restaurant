/**
 * Analysis interface
 */
export interface Analysis {
  /**
   * @Ignore
   */
  _id: string;
  /**
   * @Ignore
   */
  project: string;
  /**
   * @Ignore
   */
  productTypeId: string;
  /**
   * @Ignore
   */
  productName: string;
  /**
   * @Ignore
   */
  vessel: string;
  /**
   * @Ignore
   */
  forecaster: string;
  /**
   * @Ignore
   */
  session: string;
  /**
   * @Ignore
   */
  date: number;
  /**
   * @Ignore
   */
  message: string;
  /**
   * @Ignore
   */
  data: {
    /**
     * @Ignore
     */
    data
    rows: number[];
    /**
     * @Ignore
     */
    cols: {
      title: string,
      weathervaning: boolean,
      offshoreDuration: number,
      predecessor: number,
      run: boolean,
      subcols: {
        title: string;
        data: any[];
        type?: string;
        limit?: number;
      }[]
    }[];
    /**
     * @Ignore
     */
    min?: {
      title1: string;
      title2: string;
      subtitle: string,
      data: number[];
    };
  };
  /**
  * @Ignore
  */
  currentForecasterData: {
    fromDate: number,
    toDate: number
  };
  /**
  * @Ignore
  */
  forecasterData: {
    fromDate: number,
    toDate: number
  };
}
