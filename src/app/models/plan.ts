interface PlanParams {
    id?: string;
    title?: string;
    content?: string;
    tags?: string[];
    origin?: string;
    formats?: string;
    lastchangeAt?: Date;

    starred?:string[];

    forkFrom?:string;
    license?:string;
    issue?:string[];
}

/**
 * 教案
 */
export class Plan{
    constructor(params?: PlanParams) {
        Object.assign(this, params);
    }

    /**
     * 識別碼
     */
    id: string;
    /**
     * 標題
     */
    title: string;
    /**
     * 內容
     */
    content: string;
    /**
    * 標籤
    */
    tags: string[]=[];
    /**
     * 外部來源網址
     */
    origin: string;
    /**
    * 外部來源檔案格式
    */
    formats: string="";
    /**
     * 最後修改時間
     */
    lastchangeAt: Date;

    starred:string[]=[]; // 給這個plan星標的userIDs

    forkFrom:string;
    license:string;
    issue:string[]=[];

    static from(json): Plan {
        return Object.assign(new Plan(), json, { lastchangeAt: new Date(json.lastchangeAt) });
    }

    static fromArray(json): Plan[] {
        return Object.values(json).map<Plan>((p) => this.from(p));
    }

    get isExternal(): boolean {
        return this.origin !== undefined;
    }
}