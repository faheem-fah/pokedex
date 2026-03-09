import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pokemon-search',
  standalone: true,
  imports: [FormsModule, RouterModule], // CommonModule removed
  template: `
    <div style="text-align: center; padding: 20px; font-family: 'Segoe UI', sans-serif; background: #f4f7f6; min-height: 100vh;">
      <h1 style="color: #333;">Search Pokémon</h1>
      
      <nav style="margin-bottom: 25px;">
        <a routerLink="/Home" style="padding: 10px 25px; color: #ef5350; font-weight: bold; text-decoration: none; border: 2px solid #ef5350; border-radius: 25px;">
          ← Back to Catalog
        </a>
      </nav>
      
      <div style="margin-bottom: 30px;">
        <input 
          [(ngModel)]="query" 
          (keyup.enter)="search()" 
          placeholder="Enter name or ID (e.g. pikachu)"
          style="padding: 12px; border-radius: 8px; border: 1px solid #ccc; width: 250px; margin-right: 10px;"
        >
        <button 
          (click)="search()" 
          style="padding: 12px 25px; border-radius: 8px; background: #333; color: white; border: none; cursor: pointer;"
        >
          Search
        </button>
      </div>

      @if (pokeData) {
        <div style="background: white; border-radius: 15px; display: inline-block; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <h2 style="text-transform: capitalize; color: #2c3e50; margin-top: 0;">{{ pokeData.name }}</h2>
          
          <img 
            [src]="pokeData.sprites.other['official-artwork'].front_default" 
            style="width: 220px; height: 220px;" 
            [alt]="pokeData.name"
          >
          
          <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-radius: 10px;">
            <p style="margin: 5px 0;"><b>Height:</b> {{ pokeData.height }}</p>
            <p style="margin: 5px 0;"><b>Weight:</b> {{ pokeData.weight }}</p>
            
            <div style="margin-top: 10px; display: flex; justify-content: center; gap: 10px;">
              @for (t of pokeData.types; track t.type.name) {
                <span style="background: #ef5350; color: white; padding: 5px 12px; border-radius: 20px; font-size: 0.8rem; text-transform: capitalize;">
                  {{ t.type.name }}
                </span>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class PokemonSearchComponent {
  query = '';
  pokeData: any = null;

  constructor(private http: HttpClient) {}

  search() {
    const trimmedQuery = this.query.trim().toLowerCase();
    if (!trimmedQuery) return;

    this.http.get(`https://pokeapi.co/api/v2/pokemon/${trimmedQuery}`)
      .subscribe({
        next: (res) => {
          this.pokeData = res;
        },
        error: (err) => {
          console.error("Search failed:", err);
          alert('Pokémon not found! Please check the name or ID.');
          this.pokeData = null;
        }
      });
  }
}