import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { LoaderService } from './loader.service';

@Component({
  selector: 'loader',
  template: '<ngx-loading [show]="(loading | async) || false"></ngx-loading>'
})
export class LoaderComponent {

  public loading: Subject<boolean> = this.loaderSrv.isLoading;

  constructor(public loaderSrv: LoaderService) { }

}
