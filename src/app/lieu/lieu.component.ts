import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InplaceModule } from 'primeng/inplace';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { Lieu } from '../entites/Lieu';
import { LieuService } from '../services/lieu.service';

@Component({
  selector: 'app-lieu',
  standalone: true,
  imports: [TableModule, ButtonModule, OverlayPanelModule, ToastModule, InplaceModule, TooltipModule],
  providers: [MessageService],
  templateUrl: './lieu.component.html',
  styleUrl: './lieu.component.css'
})
export class LieuComponent implements OnInit {
  lieux: Lieu[] = [];
  
  constructor(private lieuService: LieuService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.lieuService.getAll().then(lieux => this.lieux = lieux);
  }

  delete(lieu: Lieu) {
    this.lieuService.delete(lieu).then(oldLieu => {
      let index: number = this.lieux.findIndex(l => l.uuid == oldLieu.uuid);
      this.lieux.splice(index, 1);
    });
  }

  add(newLieu: string) {
    let lieu: Lieu = new Lieu();
    lieu.lieu = newLieu;
    this.lieuService.insert(lieu).then(nl => {
      this.lieux.push(nl);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Nouveau lieu crée' });
    })
  }

  update(newLieu: Lieu) {
    this.lieuService.update(newLieu).then(nl => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Modification prise en compte' });
    })
  }

}
