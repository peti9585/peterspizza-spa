import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoModalComponent } from './info-modal.component';
import {CookieService} from 'ngx-cookie-service';

describe('InfoModalComponent', () => {
  let component: InfoModalComponent;
  let fixture: ComponentFixture<InfoModalComponent>;

  const cookieServiceMock = {
    set: vi.fn().mockName('set')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoModalComponent],
      providers: [
        { provide: CookieService, useValue: cookieServiceMock },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoModalComponent);
    component = fixture.componentInstance;
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set cookie when button is clicked', () => {
    // Act + Assert
    fixture.detectChanges();
    component.onClick();

    expect(cookieServiceMock.set).toHaveBeenCalledWith('infoModalClosed', 'true', 0.0208);
  });
});
