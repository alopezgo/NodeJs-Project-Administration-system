import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecuperarpassPage } from './recuperarpass.page';

describe('RecuperarpassPage', () => {
  let component: RecuperarpassPage;
  let fixture: ComponentFixture<RecuperarpassPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RecuperarpassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
