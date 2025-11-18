export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function apiSuccess<T>(data: T, pagination?: PaginationMeta): Response {
  const responseBody = pagination
    ? { ...data, pagination }
    : data;

  return Response.json(responseBody, { status: 200 });
}

export function apiError(
  message: string,
  status: number = 500,
  details?: unknown
): Response {
  const responseBody = details
    ? { error: message, details }
    : { error: message };

  return Response.json(responseBody, { status });
}
