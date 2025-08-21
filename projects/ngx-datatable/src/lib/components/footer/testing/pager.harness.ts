import { ComponentHarness, parallel } from '@angular/cdk/testing';

export class PagerHarness extends ComponentHarness {
  static readonly hostSelector = 'ngx-datatable-pager';

  private pages = this.locatorForAll('.pages a');
  private previous = this.locatorFor('li:has([aria-label="go to previous page"])');
  private previousButton = this.locatorFor('[aria-label="go to previous page"]');
  private next = this.locatorFor('li:has([aria-label="go to next page"])');
  private nextButton = this.locatorFor('[aria-label="go to next page"]');
  private currentPageElement = this.locatorFor('.pages.active');

  /** Returns the amount of currently rendered page buttons. */
  async pageCount() {
    return this.pages().then(pages => pages.length);
  }

  async currentPage() {
    return this.currentPageElement()
      .then(page => page.text())
      .then(text => parseInt(text));
  }

  async hasPrevious() {
    return this.previous()
      .then(previous => previous.hasClass('disabled'))
      .then(disabled => !disabled);
  }

  async hasNext() {
    return this.next()
      .then(next => next.hasClass('disabled'))
      .then(disabled => !disabled);
  }

  async clickPrevious() {
    return this.previousButton().then(previous => previous.click());
  }

  async clickNext() {
    return this.nextButton().then(next => next.click());
  }

  async pressPrevious(key: ' ' | 'Enter') {
    return this.previousButton().then(previous => previous.dispatchEvent('keydown', { key }));
  }

  async pressNext(key: ' ' | 'Enter') {
    return this.nextButton().then(next => next.dispatchEvent('keydown', { key }));
  }

  /** Clicks a page by the visible page number. */
  async clickPage(pageNumber: number) {
    const pages = await this.pages();
    return await parallel(() => pages.map(page => page.text()))
      .then(pageTexts => pageTexts.indexOf(`${pageNumber}`))
      .then(index => pages[index].click());
  }

  async pressPage(pageNumber: number, key: ' ' | 'Enter') {
    const pages = await this.pages();
    return await parallel(() => pages.map(page => page.text()))
      .then(pageTexts => pageTexts.indexOf(`${pageNumber}`))
      .then(index => pages[index].dispatchEvent('keydown', { key }));
  }

  /** Returns the range of rendered pages in the format: `first-last` */
  async pageRange() {
    return this.pages()
      .then(pages => parallel(() => [pages[0].text(), pages[pages.length - 1].text()]))
      .then(counts => counts.join('-'));
  }
}
