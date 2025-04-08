import { HttpErrorResponse, HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  var router = inject(Router);
  var myToken = localStorage.getItem('myToken');
  console.log('Token: ', myToken);
  if (myToken) {
    const request = req.clone({
      headers: new HttpHeaders().set('Authorization', `Bearer ${myToken}`),
    });
    return next(request).pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          var errorMessage = '';
          if (err.status == 401) {
            console.error('Unauthorized request:', err);
            errorMessage = 'Session Expired. Please login again!';
            localStorage.removeItem('myToken');
            router.navigate(['login', { error: errorMessage }]);
          } else {
            console.error('HTTP error:', err);
          }
        } else {
          console.error('An error occurred:', err);
        }

        return throwError(() => err);
      })
    );
  } else {
    console.log('No Token');
  return next(req);
}}
