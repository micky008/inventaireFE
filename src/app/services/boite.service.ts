import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Piece } from '../entites/Piece';
import { Boite } from '../entites/Boites';

@Injectable({
  providedIn: 'root'
})
export class BoiteService {


  constructor(private http: HttpClient) {

  }

  public getAll(): Promise<Boite[]> {
    return lastValueFrom(this.http.get<Boite[]>("api/boite"));
  }

  public getAllByPiece(piece: Piece): Promise<Boite[]> {
    return lastValueFrom(this.http.get<Boite[]>("api/boite/" + piece.uuid));
  }

  public insertRootBoite(boite: Boite, piece: Piece): Promise<Boite> {
    return lastValueFrom(this.http.put<Boite>("api/boite/" + piece.uuid, boite));
  }

  public insertChildBoite(boite: Boite, boiteParent: Boite): Promise<Boite> {
    return lastValueFrom(this.http.put<Boite>(`api/boite/${boiteParent.uuid}/child`, boite));
  }

  public update(boite: Boite): Promise<Boite> {
    return lastValueFrom(this.http.post<Boite>("api/boite", boite));
  }

  public delete(boite: Boite): Promise<Boite> {
    return lastValueFrom(this.http.delete<Boite>("api/boite/" + boite.uuid));
  }

}
