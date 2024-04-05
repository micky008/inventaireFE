import { Component, effect } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InplaceModule } from 'primeng/inplace';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { Piece } from '../entites/Piece';
import { LieuService } from '../services/lieu.service';
import { PieceService } from '../services/piece.service';

@Component({
  selector: 'app-piece',
  standalone: true,
  imports: [ButtonModule, InplaceModule, OverlayPanelModule, TableModule, ToastModule, TooltipModule, ],
  providers: [MessageService],
  templateUrl: './piece.component.html',
  styleUrl: './piece.component.css'
})
export class PieceComponent {

  pieces:Piece[] = [];

  constructor(private lieuService:LieuService, private pieceService: PieceService, private messageService: MessageService){
    effect(() => {      
      this.pieceService.getAllByLieu(this.lieuService.lieuInstance()).then(pieces => this.pieces = pieces);
    });
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
