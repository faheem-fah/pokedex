import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-pokemon-home',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div style="text-align: center; padding: 20px; font-family: 'Segoe UI', sans-serif; background: #f4f7f6; min-height: 100vh;">
      <h1 style="color: #333;">PokéDex Catalog</h1>
      
      <nav style="margin-bottom: 25px;">
        <a routerLink="/Search" style="padding: 10px 25px; color: #ff1f1f; font-weight: bold; text-decoration: none; border: 2px solid #ff1f1f; border-radius: 25px;">Go to Search Page</a>
      </nav>

      @if (loading) {
        <div style="margin-top: 50px;">
          <h2 style="color: #777;">Loading Pokémon Data...</h2>
          <p style="font-size: 0.8rem; color: #999;">Updating catalog view...</p>
        </div>
      } @else {
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; max-width: 1200px; margin: 0 auto;">
          @for (p of pokemonList; track p.id) {
            <div [routerLink]="['/pokemon', p.name]" 
                 style="background: white; border-radius: 15px; padding: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); cursor: pointer; transition: transform 0.2s;">
              
              <img [src]="p.sprites?.other?.['official-artwork']?.front_default" 
                   style="width: 130px; height: 130px;" [alt]="p.name">
              
              <h3 style="text-transform: capitalize; margin: 10px 0 5px; color: #2c3e50;">{{ p.name }}</h3>
              
              <div style="text-align: left; font-size: 0.85rem; background: #f9f9f9; padding: 10px; border-radius: 8px; margin-top: 10px;">
                @for (s of p.stats?.slice(0, 3); track s.stat.name) {
                  <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <span style="text-transform: capitalize; color: #666;">{{ s.stat.name }}:</span>
                    <b style="color: #333;">{{ s.base_stat }}</b>
                  </div>
                }
              </div>
            </div>
          }
        </div>

        <div style="margin-top: 40px; padding-bottom: 40px; display: flex; justify-content: center; align-items: center; gap: 20px;">
          <button (click)="changePage(-20)" [disabled]="offset === 0 || loading" 
                  style="padding: 10px 20px; border-radius: 8px; cursor: pointer; background: #333; color: white; border: none;">
            Previous
          </button>
          <span style="font-weight: bold;">Page {{ (offset / 20) + 1 }}</span>
          <button (click)="changePage(20)" [disabled]="loading" 
                  style="padding: 10px 20px; border-radius: 8px; cursor: pointer; background: #333; color: white; border: none;">
            Next
          </button>
        </div>
      }
    </div>
  `
})
export class PokemonHomeComponent implements OnInit {
  pokemonList: any[] = [];
  offset = 0; 
  loading = false;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.fetchData(); }

  async fetchData() {
    this.loading = true;
    this.cdr.detectChanges();
    const url = `https://pokeapi.co/api/v2/pokemon/?offset=${this.offset}&limit=20`;
    try {
      const res: any = await lastValueFrom(this.http.get(url));
      const details = await Promise.all(res.results.map((p: any) => 
        lastValueFrom(this.http.get(p.url)).catch(() => null)
      ));
      this.pokemonList = details.filter(p => p !== null);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setTimeout(() => {
        this.loading = false;
        this.cdr.detectChanges();
      }, 0);
    }
  }

  changePage(step: number) {
    if (this.offset + step >= 0) {
      this.offset += step;
      this.fetchData();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}