import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Piece } from '../entites/Piece';
import { Lieu } from '../entites/Lieu';

@Injectable({
  providedIn: 'root'
})
export class PieceService {

  constructor(private http: HttpClient) {

  }

  public getAll(): Promise<Piece[]> {
    return lastValueFrom(this.http.get<Piece[]>("api/piece"));
  }

  public getAllByLieu(lieu: Lieu): Promise<Piece[]> {
    if (lieu.uuid == null) {
      return Promise.resolve([]);
    }
    return lastValueFrom(this.http.get<Piece[]>("api/piece/lieu/" + lieu.uuid));
  }

  public insert(piece: Piece): Promise<Piece> {
    return lastValueFrom(this.http.put<Piece>("api/piece", piece));
  }

  public update(piece: Piece): Promise<Piece> {
    return lastValueFrom(this.http.post<Piece>("api/piece", piece));
  }

  public delete(piece: Piece): Promise<Piece> {
    return lastValueFrom(this.http.delete<Piece>("api/piece/" + piece.uuid));
  }

}
