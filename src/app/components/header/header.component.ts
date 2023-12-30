import { Component, OnInit } from '@angular/core';
import {FilterService} from "../../services/filter.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public searchText: string = '';
  constructor(private filterService: FilterService) { }

  ngOnInit(): void {
  }

  search() {
    this.filterService.clearFilters();
    this.filterService.filters.productNameSearch = this.searchText;
    this.filterService.searchEventSubject.next();
  }

}
