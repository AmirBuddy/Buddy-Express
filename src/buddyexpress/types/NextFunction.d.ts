/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Type for a NextFunction in middleware.
 * @param {any} [err] - Optional error object.
 * @returns {void}
 */
export type NextFunction = (err?: any) => void;
