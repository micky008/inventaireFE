import { Component, Input, OnInit, effect } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InplaceModule } from 'primeng/inplace';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { Boite } from '../entites/Boites';
import { BoiteService } from '../services/boite.service';
import { LieuService } from '../services/lieu.service';
import { PieceService } from '../services/piece.service';
import { Piece } from '../entites/Piece';
import { Lieu } from '../entites/Lieu';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-boite',
  standalone: true,
  imports: [ButtonModule, InplaceModule, OverlayPanelModule, TableModule, ToastModule, TooltipModule, DropdownModule, InputTextareaModule, FormsModule],
  providers: [MessageService],
  templateUrl: './boite.component.html',
  styleUrl: './boite.component.css'
})
export class BoiteComponent {

  @Input({ required: true }) boites: Boite[] = [];
  @Input({ required: true }) lieux: Lieu[] = [];
  piecesTransfer: Piece[] = [];
  @Input() canAdd: boolean = false;
  @Input() inChild: boolean = false;
  @Input() parentBoite: Boite = new Boite();


  constructor(private lieuService: LieuService,
    private messageService: MessageService,
    private boiteService: BoiteService,
    private pieceService: PieceService) {
  }


  delete(boite: Boite) {
    this.boiteService.delete(boite).then(oldBoite => {
      let index: number = this.boites.findIndex(l => l.uuid == oldBoite.uuid);
      this.boites.splice(index, 1);
    });
  }

  addBoite() {
    if (this.inChild) {
      this.parentBoite.boites.push(new Boite());
    } else {
      this.boites.push(new Boite());
    }
  }

  add(newBoite: string) {
    if (this.pieceService.piece().uuid == null) {
      return;
    }
    let boite: Boite = new Boite();
    boite.nom = newBoite;
    boite.piece = this.pieceService.piece();
    this.canAdd = true;
    if (this.inChild) {
      boite.rootBoite = false;
    }
    if (this.inChild) {
      this.boiteService.insertChildBoite(boite, this.parentBoite).then(np => {
        this.boites.push(np);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Nouvelle Boite créée' });
      });
    } else {
      this.boiteService.insertRootBoite(boite, this.pieceService.piece()).then(np => {
        this.boites.push(np);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Nouvelle Boite créée' });
      });
    }

  }

  changeLieuTransfer(newLieu: Lieu) {
    this.pieceService.getAllByLieu(newLieu).then(newpieces => this.piecesTransfer = newpieces);
  }

  globalSave(boite: Boite) {
    this.boiteService.update(boite).then(nl => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Modification prise en compte' });
    });
  }

}
