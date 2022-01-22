import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'odontoyou-ponto-front';

  @HostListener("window:onbeforeunload",["$event"])
    clearLocalStorage(event: any){
        localStorage.clear();
    }
}
