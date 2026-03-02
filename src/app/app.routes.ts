import { Routes } from '@angular/router';
import { PokemonHomeComponent } from './pokemon-home/pokemon-home';
import { PokemonSearchComponent } from './pokemon-search/pokemon-search';
export const routes: Routes = [
  { path: '', redirectTo: 'Home', pathMatch: 'full' },
  { path: 'Home', component: PokemonHomeComponent }, // localhost:4200/Home
  { path: 'Search', component: PokemonSearchComponent } // localhost:4200/Search
];
