import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitarArriendoPage } from './solicitar-arriendo.page';

describe('SolicitarArriendoPage', () => {
  let component: SolicitarArriendoPage;
  let fixture: ComponentFixture<SolicitarArriendoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitarArriendoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
