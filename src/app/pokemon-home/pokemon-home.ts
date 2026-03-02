import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-pokemon-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div style="text-align: center; padding: 20px; font-family: 'Segoe UI', sans-serif; background: #f4f7f6; min-height: 100vh;">
      <h1 style="color: #333;">PokéDex Catalog</h1>
      
      <nav style="margin-bottom: 25px;">
        <a routerLink="/Search" style="padding: 10px 25px; color: #ff1f1f; font-weight: bold; text-decoration: none; border: 2px solid #ff1f1f; border-radius: 25px;">Go to Search Page</a>
      </nav>

      <div *ngIf="loading" style="margin-top: 50px;">
        <h2 style="color: #777;">Loading Pokémon Data...</h2>
        <p style="font-size: 0.8rem; color: #999;">Updating catalog view...</p>
      </div>

      <div *ngIf="!loading" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; margin: 0 auto; max-width: 1200px;">
        <div *ngFor="let p of pokemonList" style="background: white; border-radius: 15px; padding: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          
          <img [src]="p.sprites?.other?.['official-artwork']?.front_default" 
               style="width: 130px; height: 130px;" [alt]="p.name">
          
          <h3 style="text-transform: capitalize; margin: 10px 0 5px; color: #2c3e50;">{{ p.name }}</h3>
          
          <div style="text-align: left; font-size: 0.85rem; background: #f9f9f9; padding: 10px; border-radius: 8px; margin-top: 10px;">
            <div *ngFor="let s of p.stats?.slice(0, 3)" style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="text-transform: capitalize; color: #666;">{{ s.stat.name }}:</span>
              <b style="color: #333;">{{ s.base_stat }}</b>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="!loading" style="margin-top: 40px; padding-bottom: 40px; display: flex; justify-content: center; align-items: center; gap: 20px;">
        <button (click)="changePage(-20)" [disabled]="offset === 0 || loading" style="padding: 10px 20px; border-radius: 8px; cursor: pointer; background: #333; color: white; border: none;">Previous</button>
        <span style="font-weight: bold;">Page {{ (offset / 20) + 1 }}</span>
        <button (click)="changePage(20)" [disabled]="loading" style="padding: 10px 20px; border-radius: 8px; cursor: pointer; background: #333; color: white; border: none;">Next</button>
      </div>
    </div>
  `
})
export class PokemonHomeComponent implements OnInit {
  pokemonList: any[] = [];
  offset = 0; // Starting offset as per project requirements
  loading = false;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetchData();
  }

  async fetchData() {
    console.log("Fetching Pokémon data...");
    this.loading = true;
    this.pokemonList = []; 
    this.cdr.detectChanges(); // Force immediate UI refresh for loading state
    
    const url = `https://pokeapi.co/api/v2/pokemon/?offset=${this.offset}&limit=20`;
    
    try {
      const res: any = await lastValueFrom(this.http.get(url));
      
      // Individual error handling for each Pokémon's detailed data
      const detailPromises = res.results.map((p: any) => 
        lastValueFrom(this.http.get(p.url)).catch(err => {
          console.error(`Error loading ${p.name}:`, err);
          return null; 
        })
      );
      
      const details = await Promise.all(detailPromises);
      this.pokemonList = details.filter(p => p !== null);
      
    } catch (err) {
      console.error("Critical fetch failed:", err);
    } finally {
      // Fix for NG0100: Ensure the loading flag turns off in the next tick
      setTimeout(() => {
        this.loading = false; 
        this.cdr.detectChanges(); // Force final UI refresh to show the catalog
        console.log("UI updated: Loading cleared.");
      }, 0);
    }
  }

  changePage(step: number) {
    this.offset += step;
    this.fetchData();
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Improve UX with smooth scrolling
  }
}