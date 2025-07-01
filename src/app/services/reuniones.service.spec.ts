import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReunionesService } from './reuniones.service';
import { environment } from '../../environments/environment';
import { Reunion } from '../models';
import { AuthService } from './authservice.service';

describe('ReunionesService', () => {
  let service: ReunionesService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockReunion: Reunion = {
    id: 1,
    titulo: 'Reunión de prueba',
    fecha: '2025-07-15T10:00:00Z',
    lugar: 'Sede social',
    motivo: 'ORDINARIA'
  };

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AuthService', ['getToken']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ReunionesService,
        { provide: AuthService, useValue: spy }
      ]
    });

    service = TestBed.inject(ReunionesService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    
    authServiceSpy.getToken.and.returnValue('mock-token');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get reuniones', () => {
    const mockReuniones: Reunion[] = [mockReunion];

    service.getReuniones().subscribe(reuniones => {
      expect(reuniones).toEqual(mockReuniones);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/reuniones/`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
    req.flush(mockReuniones);
  });

  it('should create reunion', () => {
    const newReunion = { ...mockReunion };
    delete newReunion.id;

    service.createReunion(newReunion).subscribe(reunion => {
      expect(reunion).toEqual(mockReunion);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/reuniones/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newReunion);
    req.flush(mockReunion);
  });

  it('should update reunion', () => {
    service.updateReunion(1, mockReunion).subscribe(reunion => {
      expect(reunion).toEqual(mockReunion);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/reuniones/1/`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockReunion);
    req.flush(mockReunion);
  });

  it('should delete reunion', () => {
    service.deleteReunion(1).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/reuniones/1/`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
