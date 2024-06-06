interface StatusCodeModel {
    code: number;
    description: string;
}

export const StatusCodes: Record<string, StatusCodeModel> = {
    OK: { code: 200, description: "OK" },
    Created: { code: 201, description: "Created" },
    BadRequest: { code: 400, description: "Bad Request" },
    Unauthorized: { code: 401, description: "Unauthorized" },
    Forbidden: { code: 403, description: "Forbidden" },
    NotFound: { code: 404, description: "Not Found" },
    InternalServerError: { code: 500, description: "Internal Server Error" }
};