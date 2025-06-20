import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ApiResponse } from '@hive/shared'

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        // If the data is already wrapped in ApiResponse format, return as is
        if (data && typeof data === 'object' && 'success' in data) {
          return data as ApiResponse<T>
        }

        // Otherwise, wrap the data in ApiResponse format
        return {
          success: true,
          data,
        } as ApiResponse<T>
      })
    )
  }
}
