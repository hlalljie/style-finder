/**
 * Raw response data from the API
 */
export interface StyleFinderResponse {
    /** Job Id */
    id: number;
    done: boolean;
    status: string;
    results?: {
        error?: string;
        received?: string;
        brandData?: {
            colors?: ColorData;
            fonts?: FontData
        };
        parsedData?: string;
    };
    completed_batches: number;
    total_batches: number;
    process_id?: number;
    created_at: string;
    updated_at: string;
}

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

export class BrandData {
    colors?: ColorData;
    fonts?: FontData;

    constructor(brandData: Record<string, any>) {
        brandData.colors && (this.colors = brandData.colors as ColorData);
        brandData.fonts && (this.fonts = brandData.fonts as FontData);
    }
}

export interface ColorData {
    [color: string]: string[];
}

export interface FontData {
    [font: string]: string[];
}