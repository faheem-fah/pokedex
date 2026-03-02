import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pokemon-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div style="text-align: center; padding: 20px; font-family: sans-serif;">
      <h1>Search Pokémon</h1>
      <a routerLink="/Home" style="color: #ef5350; font-weight: bold;">← Back to Catalog</a>
      <br><br>
      
      <input [(ngModel)]="query" (keyup.enter)="search()" placeholder="Enter name or ID">
      <button (click)="search()">Search</button>

      <div *ngIf="pokeData" style="margin-top: 30px; border: 1px solid #ddd; display: inline-block; padding: 20px; border-radius: 15px;">
        <h2 style="text-transform: capitalize;">{{ pokeData.name }}</h2>
        <img [src]="pokeData.sprites.other['official-artwork'].front_default" style="width: 200px;">
        <p><b>Height:</b> {{ pokeData.height }} | <b>Weight:</b> {{ pokeData.weight }}</p>
      </div>
    </div>
  `
})
export class PokemonSearchComponent { // This MUST match the import name exactly
  query = '';
  pokeData: any = null;

  constructor(private http: HttpClient) {}

  search() {
    if (!this.query) return;
    this.http.get(`https://pokeapi.co/api/v2/pokemon/` + this.query.toLowerCase())
      .subscribe({
        next: (res) => this.pokeData = res,
        error: () => alert('Pokémon not found!')
      });
  }
}