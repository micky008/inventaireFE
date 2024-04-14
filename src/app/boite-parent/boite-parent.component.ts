import { Component, Input, OnInit, WritableSignal, effect } from '@angular/core';
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
import { BoiteComponent } from '../boite/boite.component';


@Component({
  selector: 'app-boite-parent',
  standalone: true,
  imports: [BoiteComponent,ButtonModule, InplaceModule, OverlayPanelModule, TableModule, ToastModule, TooltipModule, DropdownModule, InputTextareaModule, FormsModule],
  templateUrl: './boite-parent.component.html',
  styleUrl: './boite-parent.component.css'
})
export class BoiteParentComponent implements OnInit {
  
  boites: Boite[] = [];
  lieux: Lieu[] = [];
  pieces: Piece[] = [];
  selectedPiece:WritableSignal<Piece>;

  constructor(private lieuService: LieuService,
    private boiteService: BoiteService,
    private pieceService: PieceService) {
      this.selectedPiece = this.pieceService.piece;
  }

  ngOnInit(): void { 
    this.lieuService.getAll().then(newLieux => this.lieux = newLieux);
  }

  changeLieu(newLieu: Lieu) {
    this.boites = [];
    this.pieceService.getAllByLieu(newLieu).then(newpieces => this.pieces = newpieces);
  }

  changePiece(newPiece: Piece) {
    this.pieceService.piece.set(newPiece);
    this.boiteService.getAllByPiece(newPiece).then(allBoites => this.boites = allBoites);
  }
}
