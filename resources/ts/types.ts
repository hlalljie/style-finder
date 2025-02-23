/**
 * Raw response data from the API
 */
export interface StyleFinderResponse {
    /** Job Id */
    id: number;
    done: boolean;
    status: Status;
    /** Result data from parsing */
    results?: {
        error?: string;
        received?: string;
        brandData?: {
            colors?: ColorData;
            fonts?: FontData
        };
        parsedData?: string;
    };
    /** Completed parsing batches */
    completed_batches: number;
    /** Total parsing batches */
    total_batches: number;
    /** Php worker process id */
    process_id?: number;
    /** Data created at */
    created_at: string;
    /** Data updated at */
    updated_at: string;
}

/** The status options for the style finder job */
export type Status = 
    | "pending"
    | "validating"
    | "scraping"
    | "parsing"
    | "done"
    | "cancelled"
    | "error"
    | "timeout"
    | "unknown";

/**
 * Result data returned from the API
 */
export class ResultData {
    /** Error returned from the API */
    error?: Error;
    /** URL recieved by the API (sent back to confirm) */
    received?: string;
    /** Process ID of the php service worker generating results */
    brandData?: BrandData;
    /** The full data scraped and parsed by the llm for data */
    parsedData?: string;


    constructor(resData: any) {
        resData.error && (this.error = resData.error);
        resData.received && (this.received = resData.received);
        resData.brandData &&
            (this.brandData = new BrandData(resData.brandData));
        resData.parsedData && (this.parsedData = resData.parsedData);
    }
}

/** Brand data including colors and fonts */
export class BrandData {
    /** Color Data */
    colors?: ColorData;
    /** Font Data */
    fonts?: FontData;

    constructor(brandData: Record<string, any>) {
        brandData.colors && (this.colors = brandData.colors as ColorData);
        brandData.fonts && (this.fonts = brandData.fonts as FontData);
    }
}

/** 
 * List of colors with the locations on the site they appear 
 * @example 
 * {
 *    "#ffffff": ["heading", "background"]
 * }
 * */
export interface ColorData {
    [color: string]: string[];
}

/** 
 * List of fonts with the locations on the site they appear
 * @example 
 * {
 *    "Arial": ["paragraph", "button"]
 * }
 * */
export interface FontData {
    [font: string]: string[];
}