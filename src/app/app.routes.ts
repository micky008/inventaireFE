import { Routes } from '@angular/router';
import { RechercheComponent } from './recherche/recherche.component';

export const routes: Routes = [
    { path: 'lieu', loadComponent: () => import('./lieu/lieu.component').then((x) => x.LieuComponent) },
    { path: 'piece', loadComponent: () => import('./piece/piece.component').then((x) => x.PieceComponent) },
    { path: 'boite', loadComponent: () => import('./boite/boite.component').then((x) => x.BoiteComponent) },
    { path: 'stuff', loadComponent: () => import('./stuff/stuff.component').then((x) => x.StuffComponent) },
    { path: '', component: RechercheComponent },
    { path: 'recherche', component: RechercheComponent },
    { path: 'ajout', loadComponent: () => import('./ajout/ajout.component').then((x) => x.AjoutComponent) },
];
