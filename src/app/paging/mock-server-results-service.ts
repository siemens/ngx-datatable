import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import companyData from 'src/assets/data/company.json';

import { Employee } from '../data.model';
import { Page } from './model/page';
import { PagedData } from './model/paged-data';

/**
 * A server used to mock a paged data result from a server
 */
@Injectable()
export class MockServerResultsService {
  /**
   * A method that mocks a paged server response
   * @param page The selected page
   * @returns An observable containing the employee data
   */
  public getResults(page: Page): Observable<PagedData<Employee>> {
    return (
      of(companyData)
        .pipe(map(d => this.getPagedData(page)))
        // 1 ms in e2e requires the app to recalculate, but it is too fast for e2e to notice.
        .pipe(delay(window.navigator.webdriver ? 1 : 1500 * Math.random()))
    );
  }

  /**
   * Package companyData into a PagedData object based on the selected Page
   * @param page The page data used to get the selected data from companyData
   * @returns An array of the selected data and page
   */
  private getPagedData(page: Page): PagedData<Employee> {
    const data: Employee[] = [];
    page.totalElements = companyData.length;
    page.totalPages = page.totalElements / page.size;
    const start = page.pageNumber * page.size;
    const end = Math.min(start + page.size, page.totalElements);
    for (let i = start; i < end; i++) {
      data.push(companyData[i]);
    }
    return { page, data };
  }
}
