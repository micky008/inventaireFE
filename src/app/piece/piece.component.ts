import { Component, OnInit, effect } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InplaceModule } from 'primeng/inplace';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { Lieu } from '../entites/Lieu';
import { Piece } from '../entites/Piece';
import { LieuService } from '../services/lieu.service';
import { PieceService } from '../services/piece.service';

@Component({
  selector: 'app-piece',
  standalone: true,
  imports: [ButtonModule, InplaceModule, OverlayPanelModule, TableModule, ToastModule, TooltipModule, DropdownModule],
  providers: [MessageService],
  templateUrl: './piece.component.html',
  styleUrl: './piece.component.css'
})
export class PieceComponent implements OnInit {

  pieces: Piece[] = [];
  lieux: Lieu[] = [];

  constructor(public lieuService: LieuService, private pieceService: PieceService, private messageService: MessageService) {
    effect(() => {
      this.pieceService.getAllByLieu(this.lieuService.lieuInstance()).then(pieces => this.pieces = pieces);
    });
  }

  ngOnInit(): void {
    this.lieuService.getAll().then(lieux => this.lieux = lieux);
  }

  changeLieu(newLieu: Lieu) {
    this.lieuService.lieuInstance.set(newLieu);
  }


  delete(piece: Piece) {
    this.pieceService.delete(piece).then(oldPiece => {
      let index: number = this.pieces.findIndex(l => l.uuid == oldPiece.uuid);
      this.pieces.splice(index, 1);
    });
  }

  add(newPiece: string) {
    let piece: Piece = new Piece();
    piece.nom = newPiece;
    piece.lieu = this.lieuService.lieuInstance();
    this.pieceService.insert(piece).then(np => {
      this.pieces.push(np);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Nouvelle piece crée' });
    })
  }

  update(newPiece: Piece) {
    this.pieceService.update(newPiece).then(nl => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Modification prise en compte' });
    })
  }

}
