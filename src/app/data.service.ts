import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, InjectionToken, Service } from '@angular/core';
import { Observable } from 'rxjs';

import { Employee, FullEmployee, GroupedEmployee, TreeEmployee } from './data.model';

export const DATA_ASSETS_URL = new InjectionToken<string>('data assets URL', {
  factory: () => new URL('assets/data/', inject(DOCUMENT).baseURI).href
});

@Service()
export class DataService {
  private client = inject(HttpClient);
  private dataAssetsUrl = inject(DATA_ASSETS_URL);

  load(data: 'forRowGrouping.json'): Observable<GroupedEmployee[]>;
  load(data: 'company_tree.json'): Observable<TreeEmployee[]>;
  load(data: 'company.json'): Observable<Employee[]>;
  load(data: '100k.json'): Observable<FullEmployee[]>;
  load(data: string): Observable<unknown[]> {
    return this.client.get<unknown[]>(new URL(data, this.dataAssetsUrl).href);
  }
}
