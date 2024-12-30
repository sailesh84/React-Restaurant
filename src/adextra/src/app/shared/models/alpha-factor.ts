/**
 * Alpha Factor interface
 */
export interface AlphaFactor {
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
    tableLayout: { headers: string[], cols: number[], rows: { operator: string, value: number, data: number[] }[], notes: '' };
}