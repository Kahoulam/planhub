interface UserParams {
    id?: string;
    nick?: string;
    pwd?: string;
    tags?: string;
    lastchangeAt?: Date;
    starred?:String[];
}

/**
 * 教案
 */
export class User{
    constructor(params?: UserParams) {
        Object.assign(this, params);
    }

    /**
     * 識別碼
     */
    id: string;
    /**
     * 標題
     */
    nick: string;
    /**
     * 內容
     */
    pwd: string;
    /**
    * 標籤
    */
    tags: string;
    /**
     * 最後修改時間
     */
    lastchangeAt: Date;

    starred?:String[];

    static from(json): User {
        return Object.assign(new User(), json, { lastchangeAt: new Date(json.lastchangeAt) });
    }

    static fromArray(json): User[] {
        return Object.values(json).map<User>((p) => this.from(p));
    }
}