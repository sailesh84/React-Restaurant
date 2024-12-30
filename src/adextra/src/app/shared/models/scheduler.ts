/**
 * Scheduler interface
 */
import { TaskScheduler } from '@app/shared/models/task-scheduler';

export interface Scheduler {
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
  // disabled: boolean;
  /**
   * @Ignore
   */
  fatigue: boolean;
  /**
   * @Ignore
   */
  project: string;
  /**
   * @Ignore
   */
  vessel: string;
  /**
   * @Ignore
   */
  contact: string;
  /**
   * @Ignore
   */
  product: string;
  /**
  * @Ignore
  */
  productName: string;
  /**
   * @Ignore
   */
  productType: string;
  /**
   * @Ignore
   */
  productTypeId: string;
  /**
  * @Ignore
  */
   hideScheduler: string;
  /**
   * @Ignore
   */
  analysis: boolean;
  /**
   * @Ignore
   */
  isMaster: boolean;
  /**
   * @Ignore
   */
  alphaFactor: boolean;
  /**
   * @Ignore
   */
  alphaFactorTableName: string;
  /**
   * @Ignore
   */
  alphaFactorTable: { headers: string[], cols: number[], rows: { operator: string, value: number, data: number[] }[], notes: '' };
  /**
   * @Ignore
   */
  cwd: string;
  /**
   * @Ignore
   */
  scripts: string[];
  /**
   * @Ignore
   */
  done: boolean;
  /**
   * @Ignore
   */
  rmType: string;
  /**
   * @Ignore
   */
  forecasters: any[] | Map<string, { name: string, subscription: string }>;
  /**
   * @Ignore
   */
  current: boolean;
  /**
   * @Ignore
   */
  waveSpectrum: boolean;
  /**
   * @Ignore
   */
  wave: any[];
  /**
   * @Ignore
   */
  current_data: string;
  /**
   * @Ignore
   */
  testing: boolean;
  /**
   * @Ignore
   */
  testingOptions: string;
  /**
   * @Ignore
   */
  tasks: TaskScheduler[];
  /**
   * @Ignore
   */
  vm: string;
  /**
   * @Ignore
   */
  access: any;
  /**
   * @Ignore
   */
  hours: any;
  /**
 * @Ignore
 */
  modularList: any;
  /**
 * @Ignore
 */
  isCurrentlyRunning: boolean;
}
