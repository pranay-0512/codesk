export class CreateWorkbenchReq {
    name!: string;
    description!: string;
    data: any
}

export class CreateWorkBenchResp {
    _id!: string;
    name!: string;
    description!: string;
    date!: {
        type: Date;
        default: Date;
    }
    expiration_date!: {
        type: Date;
        expires: number;
    }
    data: any;
    __v!: number;
}

export class UpdateWorkBenchReq {
    name?: string;
    description?: string;
    data?: any;
}