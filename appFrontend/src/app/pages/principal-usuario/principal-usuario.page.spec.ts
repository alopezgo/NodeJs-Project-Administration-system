import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrincipalUsuarioPage } from './principal-usuario.page';

describe('PrincipalUsuarioPage', () => {
  let component: PrincipalUsuarioPage;
  let fixture: ComponentFixture<PrincipalUsuarioPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PrincipalUsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
