import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleApiError(error: unknown): Response {
  console.error('API Error:', error);

  // Handle custom ApiError
  if (error instanceof ApiError) {
    return Response.json(
      { error: error.message, details: error.details },
      { status: error.statusCode }
    );
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return Response.json(
      {
        error: 'Validation failed',
        details: error.issues.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      },
      { status: 400 }
    );
  }

  // Handle Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation
    if (error.code === 'P2002') {
      return Response.json(
        {
          error: 'Resource already exists',
          details: { fields: error.meta?.target },
        },
        { status: 409 }
      );
    }

    // Record not found
    if (error.code === 'P2025') {
      return Response.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }

    // Foreign key constraint violation
    if (error.code === 'P2003') {
      return Response.json(
        {
          error: 'Invalid reference',
          details: { field: error.meta?.field_name },
        },
        { status: 400 }
      );
    }
  }

  // Handle Prisma validation errors
  if (error instanceof Prisma.PrismaClientValidationError) {
    return Response.json(
      { error: 'Invalid data provided' },
      { status: 400 }
    );
  }

  // Generic error fallback
  return Response.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
