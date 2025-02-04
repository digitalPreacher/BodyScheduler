import { Observable, throwError } from "rxjs";

 export function multipleErrorHandler(error: ErrorEvent): Observable<string[]>{
   let errorMessage = [];

   if (typeof error.error === 'string') {
     errorMessage.push(error.error);
   } else if (error.error && error.error.message) {
     errorMessage.push(error.error.message);
   } else if (error.error && error.error.errorArray) {
     for (let err of error.error.errorArray) {
       errorMessage.push(err.description);
     }
   }
   else {
     errorMessage.push("Произошла неизвестная ошибка, попробуйте повторить чуть позже")
   }
   return throwError(() => errorMessage)
}
