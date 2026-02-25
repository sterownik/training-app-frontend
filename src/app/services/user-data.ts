import { Injectable, computed, inject, signal } from '@angular/core';
import { Me } from '../interfaces/data';
import { DataService } from './data/data-service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserData {
  userToken = signal<number | null>(null);
  dataService = inject(DataService);

  userData = computed<Observable<Me | null>>(() => {
    if (this.userToken()) {
      return this.dataService.getMe();
    } else {
      return of(null);
    }
  });
}
