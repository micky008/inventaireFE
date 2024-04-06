import { Injectable, WritableSignal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Lieu } from '../entites/Lieu';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LieuService {

  public lieuInstance: WritableSignal<Lieu> = signal<Lieu>(new Lieu());

  constructor(private http: HttpClient) {

  }

  public getAll(): Promise<Lieu[]> {
    return lastValueFrom(this.http.get<Lieu[]>("api/lieu"));
  }

  public insert(lieu: Lieu): Promise<Lieu> {
    return lastValueFrom(this.http.put<Lieu>("api/lieu", lieu));
  }

  public update(lieu: Lieu): Promise<Lieu> {
    return lastValueFrom(this.http.post<Lieu>("api/lieu", lieu));
  }

  public delete(lieu: Lieu): Promise<Lieu> {
    return lastValueFrom(this.http.delete<Lieu>("api/lieu/" + lieu.uuid));
  }

}
