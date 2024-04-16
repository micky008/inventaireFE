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
import { OrganizationChartModule } from 'primeng/organizationchart';
import { UUIDService } from '../services/uuid.service';


@Component({
  selector: 'app-boite-parent',
  standalone: true,
  imports: [ButtonModule, InplaceModule, OverlayPanelModule, TableModule, ToastModule, TooltipModule, DropdownModule, InputTextareaModule, FormsModule, OrganizationChartModule],
  templateUrl: './boite-parent.component.html',
  styleUrl: './boite-parent.component.css'
})
export class BoiteParentComponent implements OnInit {

  boites: TreeNode<Boite>[] = [];
  lieux: Lieu[] = [];
  pieces: Piece[] = [];
  selectedPiece: WritableSignal<Piece>;
  parentBoite: Boite = new Boite();

  constructor(private lieuService: LieuService,
    private boiteService: BoiteService,
    private pieceService: PieceService,
    private uuidService: UUIDService
  ) {
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
        tn.children.push(this.convertBoiteToTreeNode(boite, tn));
      }
      this.boites.push(tn);
    });
  }

  private convertBoiteToTreeNode(boite: Boite, tnParent: TreeNode): TreeNode<Boite> {
    let tn: TreeNode = {
      label: boite.nom,
      data: boite,
      children: [],
      expanded: true,
      parent: tnParent
    }
    if (boite.boites != null) {
      for (let b of boite.boites) {
        if (tn.children == null) {
          tn.children = [];
        }
        tn.children.push(this.convertBoiteToTreeNode(b, tn));
      }
    }
    return tn;
  }

  addBoite(parentBoite: Boite) {
    if (this.boites[0] == undefined) {
      return;
    }
    this.parentBoite = parentBoite;
    let firstTreeNode = this.boites[0];
    //pas le plus optimiser mais fonctionne tres bien
    let treeNode = this.findUuidBoiteInTreenode(firstTreeNode, parentBoite.uuid as string) as TreeNode;
    if (treeNode == null) {
      treeNode = firstTreeNode
    }
    let newBoite = new Boite();
    newBoite.uuid = 'newTn' + this.uuidService.uuidv4();

    let tn: TreeNode = {
      label: "",
      children: [],
      data: newBoite,
      parent: treeNode,
      expanded: true
    }
    treeNode?.children?.push(tn);
  }


  private findUuidBoiteInTreenode(treenodeParent: TreeNode, uuidBoite: string): TreeNode | null {
    if (treenodeParent.children == null || treenodeParent.children.length == 0) {
      return null;
    }
    let res: TreeNode | null = null;
    for (let treenode of treenodeParent.children) {
      if (treenode.data.uuid == uuidBoite) {
        return treenode;
      }
      res = this.findUuidBoiteInTreenode(treenode, uuidBoite);
      if (res != null) {
        return res;
      }
    }
    return null;
  }


  saveNode(newTreeNode: TreeNode) {
    let newBoite = new Boite();
    newBoite.nom = newTreeNode.label as string;
    newBoite.piece = this.parentBoite.piece;
    if (newTreeNode.parent?.data.uuid == '00000000-0000-0000-0000-000000000001') {
      this.boiteService.insertRootBoite(newBoite, this.selectedPiece()).then(boiteINsert => newTreeNode.data = boiteINsert);
      return;
    }
    this.boiteService.insertChildBoite(newBoite, this.parentBoite).then(boiteINsert => newTreeNode.data = boiteINsert);
  }


  deleteBoiteByTreeNode(treenode: TreeNode) {
    let pos = treenode.parent?.children?.findIndex((tn) => tn.data.uuid == treenode.data.uuid) as number;
    
    this.boiteService.delete(treenode.data).then(boite => {
      console.log(`boite ${boite.nom} removed`)
      treenode.parent?.children?.splice(pos,1);
    });
  }

  deleteNewTreeNode(treenode: TreeNode) {
    let id: number = treenode.parent?.children?.findIndex(tn => tn.data.uuid == treenode.data.uuid) as number;
    treenode.parent?.children?.splice(id, 1);
  }

}