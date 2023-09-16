import Response from "twilio/lib/http/response";


export enum ResponseStatus{
    success, error
}

export class Page{
    public size: number;
    public curr: number;
    public next: number;
    public last: boolean;
}

export class ApiResponse{
    public status: string;
    public data: object;
    public message: string;
    public page: Page;
}

export const createApiResponse = (status: ResponseStatus, data: object= null, message: string= null, page: Page = null): ApiResponse =>{
    let apiresponse = new ApiResponse();

    apiresponse.status = ResponseStatus[status];
    if(data) apiresponse.data = data;

    if(message) apiresponse.message = message;

    if(page) apiresponse.page = page;

    return apiresponse;
}