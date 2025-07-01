import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaValidarUsuariosPage } from './lista-validar-usuarios.page';

describe('ListaValidarUsuariosPage', () => {
  let component: ListaValidarUsuariosPage;
  let fixture: ComponentFixture<ListaValidarUsuariosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaValidarUsuariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
