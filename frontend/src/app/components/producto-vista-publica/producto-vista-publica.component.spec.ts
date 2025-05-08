import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoVistaPublicaComponent } from './producto-vista-publica.component';

describe('ProductoVistaPublicaComponent', () => {
  let component: ProductoVistaPublicaComponent;
  let fixture: ComponentFixture<ProductoVistaPublicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductoVistaPublicaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductoVistaPublicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
