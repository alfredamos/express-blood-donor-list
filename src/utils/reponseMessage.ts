import * as http from "node:http";

export class ResponseMessage {
    constructor(public message: string, public status: string, public statusCode: number) { }
}