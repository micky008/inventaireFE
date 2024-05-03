import { Component, OnInit, WritableSignal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { QRCodeModule } from 'angularx-qrcode';
import { MessageService, TreeNode } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SidebarModule } from 'primeng/sidebar';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { Boite } from '../entites/Boites';
import { Lieu } from '../entites/Lieu';
import { Piece } from '../entites/Piece';
import { BoiteService } from '../services/boite.service';
import { LieuService } from '../services/lieu.service';
import { PieceService } from '../services/piece.service';
import { UUIDService } from '../services/uuid.service';


@Component({
  selector: 'app-boite-parent',
  standalone: true,
  imports: [OverlayPanelModule, ToastModule, InputTextareaModule, SidebarModule, ButtonModule, TooltipModule, DropdownModule, OrganizationChartModule, QRCodeModule, RouterModule],
  providers: [MessageService],
  templateUrl: './boite-parent.component.html',
  styleUrl: './boite-parent.component.css'
})
export class BoiteParentComponent implements OnInit {

  boites: TreeNode<Boite>[] = [];
  lieux: Lieu[] = [];
  pieces: Piece[] = [];
  selectedPiece: WritableSignal<Piece>;
  parentBoite: Boite = new Boite();
  sidebarVisible: boolean = false;
  selectedBoite: Boite = new Boite();
  movePieces: Piece[] = [];
  moveBoites: Boite[] = [];

  constructor(private lieuService: LieuService,
    private boiteService: BoiteService,
    private pieceService: PieceService,
    private uuidService: UUIDService,
    private messageService: MessageService
  ) {
    this.selectedPiece = this.pieceService.piece;
  }

  ngOnInit(): void {
    this.lieuService.getAll().then(newLieux => this.lieux = newLieux);
  }

  changeLieu(newLieu: Lieu, principal: boolean = true) {
    if (principal) {
      this.boites = [];
    }
    this.pieceService.getAllByLieu(newLieu).then(newpieces => {
      if (principal) {
        this.pieces = newpieces;
      } else {
        this.movePieces = newpieces;
      }
    });
  }

  changePiece(newPiece: Piece, subPiece: boolean = false) {
    if (newPiece == null) {
      return;
    }
    if (subPiece) {
      this.moveBoites = [];
      this.boiteService.getAllByPiece(newPiece).then((allBoites: Boite[]) => {
        let parent: Boite | null = this.findUuidBoiteParentInTreenode(this.boites[0], this.selectedBoite.uuid as string)?.data;
        this.moveBoites = allBoites.filter(b => b.uuid != this.selectedBoite.uuid || (parent != null && parent.uuid == b.uuid ));
      });
      return;
    }
    this.boites = [];
    this.pieceService.piece.set(newPiece);
    this.boiteService.getAllRootByPiece(newPiece).then((allBoites: Boite[]) => {
      let cloneNewpiece = { ...newPiece };
      cloneNewpiece.uuid = '00000000-0000-0000-0000-000000000001';
      let tn: TreeNode = {
        label: newPiece.nom,
        data: cloneNewpiece,
        expanded: true,
        selectable: false,
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

  private findUuidBoiteParentInTreenode(treenodeParent: TreeNode, uuidBoite: string): TreeNode | null {
    if (treenodeParent.children == null || treenodeParent.children.length == 0) {
      return null;
    }
    let res: TreeNode | null = null;
    for (let treenode of treenodeParent.children) {
      if (treenode.data.uuid == uuidBoite) {
        return treenodeParent;
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
      treenode.parent?.children?.splice(pos, 1);
    });
  }

  deleteNewTreeNode(treenode: TreeNode) {
    let id: number = treenode.parent?.children?.findIndex(tn => tn.data.uuid == treenode.data.uuid) as number;
    treenode.parent?.children?.splice(id, 1);
  }

  showRightSlideBar(node: TreeNode) {
    this.sidebarVisible = true;
    this.selectedBoite = node.data;
  }

  generateQrCode(uuidBoite: string | null): string {
    if (!this.sidebarVisible) {
      return "nothing";
    }
    return `${window.location.protocol}//${window.location.host}/api/stuff/${uuidBoite}`;
  }

  save() {
    this.boiteService.updatePieceAndNote(this.selectedBoite).then(b => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Boite MaJ !' })
    });
  }

  moveBoite(newPiece: Piece, newParentBoite: Boite) {
    if (newPiece == null) {
      return;
    }
    if (newParentBoite == null) {
      let boite = { ...this.selectedBoite };
      boite.piece = newPiece;
      this.boiteService.updatePieceAndNote(boite).then(nb => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'La boite a bougé !' });
        this.boites = [];
        this.changePiece(this.selectedPiece());
      });
      return;
    }
    this.boiteService.changeParentBoite(this.selectedBoite, newParentBoite).then(b => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'La boite a bougé !' });
      this.boites = [];
      this.changePiece(this.selectedPiece());
    });
  }

}