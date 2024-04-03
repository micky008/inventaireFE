import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonModule, SidebarModule, MenuModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  showBurgerMenu: boolean = false;
  items: MenuItem[] | undefined;

  ngOnInit() {
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
            icon: 'pi pi-map',
            iconClass: 'text-xl',
            routerLink: '/lieu',
            command: (e) => {this.showBurgerMenu = false}
          },
          {
            label: '<span class="text-xl font-bold">Objets</span>',
            escape: false,
            icon: 'pi pi-tag',
            iconClass: 'text-xl',
            routerLink: '/stuff',
            command: (e) => {this.showBurgerMenu = false}
          },
          {
            label: '<span class="text-xl font-bold">Boites</span>',
            escape: false,
            icon: 'pi pi-box',
            iconClass: 'text-xl',
            routerLink: '/boite',
            command: (e) => {this.showBurgerMenu = false}
          }
        ]
      }
    ];
  }

}
