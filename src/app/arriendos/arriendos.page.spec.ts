import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArriendosPage } from './arriendos.page';

describe('ArriendosPage', () => {
  let component: ArriendosPage;
  let fixture: ComponentFixture<ArriendosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ArriendosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
