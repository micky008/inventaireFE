import { Component, Inject, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Lieu } from '../entites/Lieu';
import { LieuService } from '../services/lieu.service';

@Component({
  selector: 'app-lieu',
  standalone: true,
  imports: [TableModule],
  templateUrl: './lieu.component.html',
  styleUrl: './lieu.component.css'
})
export class LieuComponent implements OnInit {
  lieux!: Lieu[];

  constructor(private lieuService: LieuService) { }


  ngOnInit(): void {
    this.lieuService.getAll().then(lieux => this.lieux = lieux);
  }

  delete(lieu: Lieu) {
    this.lieuService.delete(lieu);
  }

}
