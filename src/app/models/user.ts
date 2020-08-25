interface UserParams {
    id?: string;
    nick?: string;
    pwd?: string;
    tags?: string;
    lastchangeAt?: Date;
    subscripted?:string[]; // 訂閱這個user的userIDs
    plans?:string[];
}

export class User{
    constructor(params?: UserParams) {
        Object.assign(this, params);
    }

    id: string;
    nick: string;
    pwd: string;
    tags: string;
    lastchangeAt: Date;

    subscripted?:string[]=[];

    plans:string[]=[];

    static from(json): User {
        return Object.assign(new User(), json, { lastchangeAt: new Date(json.lastchangeAt) });
    }

    static fromArray(json): User[] {
        return Object.values(json).map<User>((p) => this.from(p));
    }
}