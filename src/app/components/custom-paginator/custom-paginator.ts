import {Component, EventEmitter, Injectable, Input, Output} from '@angular/core';
import {MatPaginatorIntl, PageEvent} from '@angular/material/paginator';
import {Subject} from 'rxjs';

@Injectable()
export class MyCustomPaginator implements MatPaginatorIntl {
  changes = new Subject<void>();
  firstPageLabel = `First page`;
  itemsPerPageLabel = `Items per page:`;
  lastPageLabel = `Last page`;
  nextPageLabel = 'Next page';
  previousPageLabel = 'Previous page';


  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return `Page 1 of 1`;
    }
    const amountPages = Math.ceil(length / pageSize);
    return `Page ${page + 1} of ${amountPages}`;
  }
}

@Component({
  selector: 'custom-paginator',
  templateUrl: 'custom-paginator.html',
  providers: [{provide: MatPaginatorIntl, useClass: MyCustomPaginator}],
})
export class CustomPaginator {
  @Input() length?: number;
  @Input() pageSize?: number;
  @Input() pageIndex?: number;
  @Output() page: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();
}
