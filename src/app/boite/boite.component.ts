import { Component, OnInit, effect } from '@angular/core';
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
export class BoiteComponent implements OnInit {

  boites: Boite[] = [];
  pieces: Piece[] = [];
  lieux: Lieu[] = [];
  piecesTransfer: Piece[] = [];
  selectedPiece: Piece | null = null;

  constructor(private lieuService: LieuService,
    private messageService: MessageService,
    private boiteService: BoiteService,
    private pieceService: PieceService) {
  }

  ngOnInit(): void {
    this.lieuService.getAll().then(newlieux => this.lieux = newlieux);
  }

  changeLieu(newLieu: Lieu) {
    this.selectedPiece = null;
    this.boites = [];
    this.pieceService.getAllByLieu(newLieu).then(newpieces => this.pieces = newpieces);
  }

  changePiece(newPiece: Piece) {
    this.selectedPiece = newPiece;
    this.boiteService.getAllByPiece(newPiece).then(allBoites => this.boites = allBoites);
  }

  delete(boite: Boite) {
    this.boiteService.delete(boite).then(oldBoite => {
      let index: number = this.boites.findIndex(l => l.uuid == oldBoite.uuid);
      this.boites.splice(index, 1);
    });
  }

  add(newBoite: string) {
    let boite: Boite = new Boite();
    boite.nom = newBoite;
    if (this.selectedPiece != null) {
      boite.piece = this.selectedPiece;
    }
    this.boiteService.insert(boite).then(np => {
      this.boites.push(np);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Nouvelle Boite créée' });
    })
  }

  update(newBoite: Boite) {
    this.boiteService.update(newBoite).then(nl => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Modification prise en compte' });
    })
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
