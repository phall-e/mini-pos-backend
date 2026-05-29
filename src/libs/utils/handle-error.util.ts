import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  RequestTimeoutException,
  ServiceUnavailableException,
} from '@nestjs/common';

import {
  QueryFailedError,
  EntityNotFoundError,
} from 'typeorm';

export const handleError = (error: unknown): never => {
  /* ----------------------------------
   * 1. Native NestJS HTTP exceptions
   * ---------------------------------- */
  if (error instanceof NotFoundException) {
    throw error;
  }

  if (error instanceof BadRequestException) {
    throw error;
  }

  if (error instanceof RequestTimeoutException) {
    throw error;
  }

  if (error instanceof InternalServerErrorException) {
    throw error;
  }

  /* ----------------------------------
   * 2. TypeORM specific errors
   * ---------------------------------- */

  // Entity not found (findOneOrFail)
  if (error instanceof EntityNotFoundError) {
    throw new NotFoundException('Record not found');
  }

  // SQL / DB errors
  if (error instanceof QueryFailedError) {
    const dbError: any = error;

    switch (dbError.code) {
      case '23505': // unique_violation
        throw new ConflictException({
          message: 'Duplicate value violates unique constraint',
          detail: dbError.detail,
        });

      case '23503': // foreign_key_violation
        throw new BadRequestException({
          message: 'Foreign key constraint violation',
          detail: dbError.detail,
        });

      case '23502': // not_null_violation
        throw new BadRequestException({
          message: 'Required field is missing',
          detail: dbError.column,
        });

      case '22P02': // invalid_text_representation
        throw new BadRequestException({
          message: 'Invalid input syntax',
          detail: dbError.message,
        });

      case '57014': // query_canceled (timeout)
        throw new RequestTimeoutException('Database query timeout');

      default:
        throw new InternalServerErrorException({
          message: 'Database error',
          detail: dbError.message,
        });
    }
  }

  /* ----------------------------------
   * 3. Connection / infrastructure errors
   * ---------------------------------- */

  if ((error as any)?.name === 'TimeoutError') {
    throw new RequestTimeoutException('Operation timed out');
  }

  if ((error as any)?.code === 'ECONNREFUSED') {
    throw new ServiceUnavailableException('Database connection refused');
  }

  /* ----------------------------------
   * 4. Unknown error fallback
   * ---------------------------------- */

  console.error('[UNHANDLED ERROR]', error);

  throw new InternalServerErrorException('Unexpected server error');
};
