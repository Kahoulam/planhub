interface NotifyParams {
    title?:string;
    msg?: string;
    link?:string;
    lastchangeAt?:Date;
    isReaded?:boolean;
}

/**
 * 教案
 */
export class Notify{
    constructor(params?: NotifyParams) {
        Object.assign(this, params);
    }

    title: string;
    msg: string;
    link: string;
   
    lastchangeAt: Date;

    isReaded:boolean;

    forkFrom:string;
}