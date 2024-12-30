/**
 * Virtual machine interface
 */
export interface VirtualMachine {
    /**
   * @Ignore
   */
    readonly _id: string;
    /**
     * @Ignore
     */
    serverName: string;
    /**
     * @Ignore
     */
    shortName: string;
    /**
     * @Ignore
     */
    isActive: boolean;
}