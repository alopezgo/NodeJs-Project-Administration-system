import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecoveryPage } from './recovery.page';

describe('RecoveryPage', () => {
  let component: RecoveryPage;
  let fixture: ComponentFixture<RecoveryPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RecoveryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
