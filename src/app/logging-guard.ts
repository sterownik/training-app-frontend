import { CanActivateFn } from '@angular/router';

export const loggingGuard: CanActivateFn = (route, state) => {
  return true;
};
