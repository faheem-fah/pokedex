import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { PokemonHomeComponent } from './pokemon-home';

describe('PokemonHomeComponent', () => {
  let component: PokemonHomeComponent;
  let fixture: ComponentFixture<PokemonHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // 1. Import the standalone component
      imports: [PokemonHomeComponent],
      // 2. Provide the HttpClient and its testing mock
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonHomeComponent);
    component = fixture.componentInstance;
    
    // 3. detectChanges triggers ngOnInit and the fetchData call
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});