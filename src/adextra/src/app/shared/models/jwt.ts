/**
 * Log interface
 */
export interface Jwt {
  /**
   * @Ignore
   */
  readonly accessToken: string;
  /**
   * @Ignore
   */
  readonly tokenType: string;
  /**
   * @Ignore
   */
  readonly expiresIn: number;
  /**
   * @Ignore
   */
  readonly scope: string;
  /**
   * @Ignore
   */
  readonly domain: string;
  /**
   * @Ignore
   */
  readonly organisationName: string;
  /**
   * @Ignore
   */
  readonly accountType: string;
  /**
   * @Ignore
   */
  readonly jti: string;
}
