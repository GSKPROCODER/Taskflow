import type { ContentfulStatusCode } from "hono/utils/http-status";

/** Base application error — carries an HTTP status and a stable error code. */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status: ContentfulStatusCode = 400,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, "UNAUTHORIZED", 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, "FORBIDDEN", 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super(message, "NOT_FOUND", 404);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed") {
    super(message, "VALIDATION_ERROR", 400);
  }
}

/** Placeholder thrown by not-yet-implemented services during scaffolding. */
export class NotImplementedError extends AppError {
  constructor(message = "Not implemented") {
    super(message, "NOT_IMPLEMENTED", 501);
  }
}
