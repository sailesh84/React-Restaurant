/**
 * Project interface
 */
export interface Project {
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
  code: string;
  /**
   * @Ignore
   */
  client_name: string;
  /**
   * @Ignore
   */
  client: string;
  /**
   * @Ignore
   */
  description: string;
  /**
   * @Ignore
   */
  latitude: number;
  /**
   * @Ignore
   */
  longitude: number;
  /**
   * @Ignore
   */
  marker: string;
  /**
   * @Ignore
   */
  countries: string[];
  /**
   * @Ignore
   */
  // vessels: any[] | Map<string, {productType: string, productName: string, contact: string}>;
  vessels: any[];
  /**
   * @Ignore
   */
  disabled: boolean;
  /**
   * @Ignore
   */
  region: string;
  /**
   * @Ignore
   */
  timezone: string;
}
