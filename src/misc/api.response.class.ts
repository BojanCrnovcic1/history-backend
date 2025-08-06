export class ApiResponse {
    status: string;
    statusCode: number;
    message: string | null;
    data?: any;

    constructor(status: string, statusCode: number, message: string | null = null, data?: any) {
        this.status = status,
        this.statusCode = statusCode,
        this.message = message
        this.data = data;
    }
}