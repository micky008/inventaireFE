import { Routes } from '@angular/router';
import { LieuComponent } from './lieu/lieu.component';
import { StuffComponent } from './stuff/stuff.component';
import { BoiteComponent } from './boite/boite.component';
import { RechercheComponent } from './recherche/recherche.component';
import { AjoutComponent } from './ajout/ajout.component';

export const routes: Routes = [
    { path: 'lieu', component: LieuComponent },
    { path: 'stuff', component: StuffComponent },
    { path: 'boite', component: BoiteComponent },
    { path: '', component: RechercheComponent },
    { path: 'recherche', component: RechercheComponent },
    { path: 'ajout', component: AjoutComponent },
];
