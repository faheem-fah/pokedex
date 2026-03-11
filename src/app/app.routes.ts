import { Routes } from '@angular/router';
import { PokemonHomeComponent } from './pokemon-home/pokemon-home';
import { PokemonSearchComponent } from './pokemon-search/pokemon-search';
import { PokemonDetailComponent } from './pokemon-detail/pokemon-detail';

export const routes: Routes = [
  { path: '', redirectTo: 'Home', pathMatch: 'full' },
  { path: 'Home', component: PokemonHomeComponent },
  { path: 'Search', component: PokemonSearchComponent },
  { path: 'pokemon/:name', component: PokemonDetailComponent } // dynamic route
];