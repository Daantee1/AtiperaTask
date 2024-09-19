import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataFilterService {



  private filterSubject = new BehaviorSubject<string>('');
  filter$ = this.filterSubject.asObservable();

  setFilter(value: string): void {
    this.filterSubject.next(value.trim().toLowerCase());
  }

  applyFilter(data: any[], filter: string): any[] {
    if (!filter || filter.length === 0) {
      return data;
    }
    return data.filter(item =>
      Object.values(item).some((val: any) =>
        val.toString().toLowerCase().includes(filter)
      )
    );
  }
}
