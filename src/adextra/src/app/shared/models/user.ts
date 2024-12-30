import {Jwt} from '@app/shared/models/jwt';

/**
 * User interface
 */
export interface User {
  /**
   * @Ignore
   */
  readonly _id: string;
  /**
   * @Ignore
   */
  firstname: string;
  /**
   * @Ignore
   */
  lastname: string;
  /**
   * @Ignore
   */
  email: string;
  /**
   * @Ignore
   */
  password: string;
  /**
   * @Ignore
   */
  job: string;
  /**
   * @Ignore
   */
  image: string;
  /**
   * @Ignore
   */
  access: number;
  /**
   * @Ignore
   */
  enabled: boolean;
  /**
   * @Ignore
   */
  phones: string[];
  /**
   * @Ignore
   */
  notifications: {type: string; enabled: boolean}[];
  /**
   * @Ignore
   */
  favouriteProjects: string[];
  /**
   * @Ignore
   */
   favouriteRegion: string[];
  /**
   * @Ignore
   */
  language: string;
  /**
   * @Ignore
   */
  token?: Jwt;
  /**
   * @Ignore
   */
  accountName?: string;
}
