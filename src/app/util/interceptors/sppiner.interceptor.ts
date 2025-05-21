import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';

export const sppinerInterceptor: HttpInterceptorFn = (req, next) => {
  //we can use if condition
  let _NgxSpinnerService=inject(NgxSpinnerService);
  _NgxSpinnerService.show('spinner1')
  return next(req).pipe(finalize(()=>{
    _NgxSpinnerService.hide("spinner1")
  }));
};
