import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserService } from '../service/user.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const token = inject(UserService).getToken();

  if (!token) {
    return next(request);
  }

  return next(
    request.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    }),
  );
};
