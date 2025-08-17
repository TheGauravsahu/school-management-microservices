import createHttpError from "http-errors";

/**
 * Validates a date string in YYYY-MM-DD format.
 * Throws HTTP 400 error if invalid.
 */
export function validateDate(date: string, allowFuture = false): void {
  if (!date) {
    throw createHttpError(400, "Date is required.");
  }

  // Format check
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    throw createHttpError(400, "Invalid date format. Use YYYY-MM-DD.");
  }

  // Parse check
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) {
    throw createHttpError(400, "Invalid date value.");
  }

  // Prevent future dates (optional toggle)
  const today = new Date().toISOString().split("T")[0];
  if (!allowFuture && date > today) {
    throw createHttpError(400, "Future dates are not allowed.");
  }
}
