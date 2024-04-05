import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { SidebarModule } from 'primeng/sidebar';
import { Lieu } from './entites/Lieu';
import { LieuService } from './services/lieu.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonModule, SidebarModule, MenuModule, DropdownModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  showBurgerMenu: boolean = false;
  items: MenuItem[] | undefined;
  lieux:Lieu[] = [];

  constructor(private lieuService:LieuService){}

  ngOnInit() {
    this.lieuService.getAll().then(lieux => this.lieux = lieux);
    this.items = [
      {
        label: "Racourcies",
        items: [
          {
            label: '<span class="text-xl font-bold">Recherche</span>',
            escape: false,
            icon: 'pi pi-search',
            iconClass: 'text-xl',
            routerLink: '/recherche',
            command: (e) => {this.showBurgerMenu = false}
          }, {
            label: '<span class="text-xl font-bold">Ajout</span>',
            escape: false,
            icon: 'pi pi-plus-circle',
            iconClass: 'text-xl',
            routerLink: '/ajout',
            command: (e) => {this.showBurgerMenu = false}
          }
        ]
      },
      {
        label: 'CRUD',
        items: [
          {
            label: '<span class="text-xl font-bold">Lieux</span>',
            escape: false,
            icon: 'pi pi-building',
            iconClass: 'text-xl',
            routerLink: '/lieu',
            command: (e) => {this.showBurgerMenu = false}
          },
          {
            label: '<span class="text-xl font-bold">Pieces</span>',
            escape: false,
            icon: 'pi pi-map',
            iconClass: 'text-xl',
            routerLink: '/piece',
            command: (e) => {this.showBurgerMenu = false}
          },
          {
            label: '<span class="text-xl font-bold">Boites</span>',
            escape: false,
            icon: 'pi pi-box',
            iconClass: 'text-xl',
            routerLink: '/boite',
            command: (e) => {this.showBurgerMenu = false}
          },
          {
            label: '<span class="text-xl font-bold">Objets</span>',
            escape: false,
            icon: 'pi pi-tag',
            iconClass: 'text-xl',
            routerLink: '/stuff',
            command: (e) => {this.showBurgerMenu = false}
          }
        ]
      }
    ];
  }

  changeLieu(newLieu:Lieu){
    this.lieuService.lieuInstance.set(newLieu);
  }

}
