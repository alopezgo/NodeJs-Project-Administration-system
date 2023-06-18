import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EntradaPage } from './entrada.page';

describe('EntradaPage', () => {
  let component: EntradaPage;
  let fixture: ComponentFixture<EntradaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EntradaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
