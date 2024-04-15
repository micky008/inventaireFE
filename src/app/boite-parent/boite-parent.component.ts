import { Component, Input, OnInit, WritableSignal, effect } from '@angular/core';
import { MessageService, TreeNode } from 'primeng/api';
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
import { OrganizationChartModule } from 'primeng/organizationchart';


@Component({
  selector: 'app-boite-parent',
  standalone: true,
  imports: [BoiteComponent, ButtonModule, InplaceModule, OverlayPanelModule, TableModule, ToastModule, TooltipModule, DropdownModule, InputTextareaModule, FormsModule, OrganizationChartModule],
  templateUrl: './boite-parent.component.html',
  styleUrl: './boite-parent.component.css'
})
export class BoiteParentComponent implements OnInit {

  boites: TreeNode<Boite>[] = [];
  lieux: Lieu[] = [];
  pieces: Piece[] = [];
  selectedPiece: WritableSignal<Piece>;

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
    this.boiteService.getAllByPiece(newPiece).then((allBoites: Boite[]) => {
      let cloneNewpiece = { ...newPiece };
      cloneNewpiece.uuid = '00000000-0000-0000-0000-000000000001';
      let tn: TreeNode = {
        label: newPiece.nom,
        data: cloneNewpiece,
        expanded: true,
        children: []
      }
      for (let boite of allBoites) {
        if (tn.children == null) {
          tn.children = [];
        }
        tn.children.push(this.convertBoiteToTreeNode(boite));
      }
      this.boites.push(tn);
    });
  }

  private convertBoiteToTreeNode(boite: Boite): TreeNode<Boite> {
    let tn: TreeNode = {
      label: boite.nom,
      data: boite,
      children: [],
      expanded: true
    }
    if (boite.boites != null) {
      for (let b of boite.boites) {
        if (tn.children == null) {
          tn.children = [];
        }
        tn.children.push(this.convertBoiteToTreeNode(b));
      }
    }
    return tn;
  }


  addBoite(parentBoite: Boite) {
    if (this.boites[0] == undefined) {
      return;
    }
    let firstTreeNode = this.boites[0];
    let treeNode = this.findUuidBoiteInTreenode(firstTreeNode, parentBoite.uuid as string);
    console.log(treeNode);
  }


  private findUuidBoiteInTreenode(treenodeParent: TreeNode, uuidBoite: string): TreeNode|null { //treenodeParent = grenier //uuidBoite = petite boite
    if (treenodeParent.children == null || treenodeParent.children.length == 0) {
      return null;
    }
    let res: TreeNode | null = null;
    for (let treenode of treenodeParent.children) { //grande boite et boite a outils
      if (treenode.data.uuid == uuidBoite) {
        return treenode;        
      }
      res = this.findUuidBoiteInTreenode(treenode, uuidBoite); //grande boite
      if (res != null) {
        return res;
      }
    }
    return null;
  }

}
