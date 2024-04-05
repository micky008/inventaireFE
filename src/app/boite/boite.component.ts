import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InplaceModule } from 'primeng/inplace';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-boite',
  standalone: true,
  imports: [ButtonModule, InplaceModule, OverlayPanelModule, TableModule, ToastModule, TooltipModule],
  providers: [MessageService],
  templateUrl: './boite.component.html',
  styleUrl: './boite.component.css'
})
export class BoiteComponent implements OnInit {

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {

  }

}
