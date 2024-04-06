import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
    return lastValueFrom(this.http.get<Boite[]>("api/Boite"));
  }

  public getAllByPiece(piece: Piece): Promise<Boite[]> {
    return lastValueFrom(this.http.get<Boite[]>("api/boite/" + piece.uuid));
  }

  public insert(Boite: Boite): Promise<Boite> {
    return lastValueFrom(this.http.put<Boite>("api/boite", Boite));
  }

  public update(Boite: Boite): Promise<Boite> {
    return lastValueFrom(this.http.post<Boite>("api/boite", Boite));
  }

  public delete(boite: Boite): Promise<Boite> {
    return lastValueFrom(this.http.delete<Boite>("api/boite/" + boite.uuid));
  }

}
