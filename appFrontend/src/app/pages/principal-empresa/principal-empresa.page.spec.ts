import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrincipalEmpresaPage } from './principal-empresa.page';

describe('PrincipalEmpresaPage', () => {
  let component: PrincipalEmpresaPage;
  let fixture: ComponentFixture<PrincipalEmpresaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PrincipalEmpresaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
