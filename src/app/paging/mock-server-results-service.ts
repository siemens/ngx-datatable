import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

import companyData from '../../../src/assets/data/company.json';
import { Employee } from '../data.model';

export interface FetchResult<T> {
  data: T[];
  totalElements: number;
}

/**
 * A server used to mock a paged data result from a server
 */
@Injectable()
export class MockServerResultsService {
  /**
   * A method that mocks a paged server response
   * @param startIndex The start index of rows to fetch
   * @param endIndex The end index of rows to fetch
   * @returns An observable containing the employee data
   */
  public getResults(startIndex: number, endIndex: number): Observable<FetchResult<Employee>> {
    return (
      of(companyData)
        .pipe(map(() => this.getData(startIndex, endIndex)))
        // 1 ms in e2e requires the app to recalculate, but it is too fast for e2e to notice.
        .pipe(delay(window.navigator.webdriver ? 1 : 1500 * Math.random()))
    );
  }

  /**
   * Package companyData into a FetchResult object based on row indexes
   * @param startIndex The starting row index
   * @param endIndex The ending row index
   * @returns An array of the selected data and total element count
   */
  private getData(startIndex: number, endIndex: number): FetchResult<Employee> {
    const data: Employee[] = [];
    const totalElements = companyData.length;
    const start = Math.max(0, startIndex);
    const end = Math.min(endIndex, totalElements);
    for (let i = start; i < end; i++) {
      data.push(companyData[i]);
    }
    return { data, totalElements };
  }
}
