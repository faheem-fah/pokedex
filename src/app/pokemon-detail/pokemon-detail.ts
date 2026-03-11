import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div style="text-align: center; padding: 40px; font-family: 'Segoe UI', sans-serif; background: #f4f7f6; min-height: 100vh;">
      <nav style="margin-bottom: 30px;">
        <a routerLink="/Home" style="color: #ff1f1f; font-weight: bold; text-decoration: none;">← Back to Catalog</a>
      </nav>

      @if (pokemon) {
        <div style="background: white; display: inline-block; padding: 30px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
          <h1 style="text-transform: capitalize; font-size: 2.5rem; margin-bottom: 10px;">{{ pokemon.name }}</h1>
          <img [src]="pokemon.sprites?.other?.['official-artwork']?.front_default" style="width: 300px;" [alt]="pokemon.name">
          
          <div style="margin-top: 30px;">
            <h3>Abilities</h3>
            <p style="font-size: 0.9rem; color: #666;">Click an ability to see its effect</p>
            <div style="display: flex; justify-content: center; gap: 15px; margin-top: 15px;">
              @for (item of pokemon.abilities; track item.ability.name) {
                <button 
                  (click)="getAbilityInfo(item.ability.url)"
                  style="padding: 10px 20px; border-radius: 20px; border: 2px solid #333; background: transparent; cursor: pointer; font-weight: bold;"
                >
                  {{ item.ability.name }}
                </button>
              }
            </div>
          </div>

          @if (selectedAbility) {
            <div style="margin-top: 30px; padding: 20px; background: #fff5f5; border-left: 5px solid #ff1f1f; border-radius: 10px; max-width: 500px; text-align: left; margin: 0 auto;">
              <h4 style="text-transform: capitalize; margin-top: 0;">{{ selectedAbility.name }}</h4>
              <p>{{ effectText }}</p>
            </div>
          }
        </div>
      } @else {
        <div style="margin-top: 50px;">
          <h2>Loading details...</h2>
        </div>
      }
    </div>
  `
})
export class PokemonDetailComponent implements OnInit {
  pokemon: any = null;
  selectedAbility: any = null;
  effectText = '';

  constructor(
    private route: ActivatedRoute, 
    private http: HttpClient, 
    private cdr: ChangeDetectorRef 
  ) {}

  async ngOnInit() {
    const name = this.route.snapshot.paramMap.get('name');
    if (name) {
      try {
        const data = await lastValueFrom(
          this.http.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
        );
        this.pokemon = data;
      } catch (err) {
        console.error("Could not load pokemon", err);
      } finally {
        this.cdr.detectChanges(); // Ensures UI updates after async fetch
      }
    }
  }

  async getAbilityInfo(url: string) {
    try {
      // Calling the specific ability API URL found in the pokemon response
      const data: any = await lastValueFrom(this.http.get(url));
      this.selectedAbility = data;
      
      // Filtering for the English description
      const entry = data.effect_entries.find((e: any) => e.language.name === 'en');
      this.effectText = entry ? entry.effect : 'No English description available.';
      
      this.cdr.detectChanges(); 
    } catch (err) {
      console.error("Could not load ability", err);
    }
  }
}