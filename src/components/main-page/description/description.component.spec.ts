import { ComponentFixture, TestBed } from '@angular/core/testing';
import {ComponentType, DescriptionComponent} from './description.component';

describe('DescriptionComponent', () => {
  let component: DescriptionComponent;
  let fixture: ComponentFixture<DescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescriptionComponent],
    })
    .compileComponents();

    fixture = TestBed.createComponent(DescriptionComponent);
    component = fixture.componentInstance;
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set proper text and image for italian taste component type', () => {
    // Arrange
    const expectedImageSource = 'images/spices.png';
    const expectedHeadingText = 'OLASZ ÍZEK';
    const expectedParagraphText = 'A pizzák minden esetben magas minőségű olasz alapanyagokból készülnek. Hiszem, hogy a minőség a legfontosabb egy ételnél, amire magas hangsúlyt fektetek minden egyes pizza elkészítésénél.';

    component.componentType = ComponentType.ItalianTaste;

    // Act
    fixture.detectChanges();

    // Assert
    expect(component.imageSource).toEqual(expectedImageSource);
    expect(component.headingText).toEqual(expectedHeadingText);
    expect(component.paragraphText).toEqual(expectedParagraphText);
  });

  it('should set proper text and image for mindfulness component type', () => {
    // Arrange
    const expectedImageSource = 'images/mindfulness.png';
    const expectedHeadingText = 'TUDATOSSÁG';
    const expectedParagraphText = 'Az étlap összeállításánál törekedtem arra, hogy csak a legfontosabbak kerüljenek fel oda. Nincs 50 fajta pizza, viszont az a kevés, ami van, garantáltan ízletes és egyedi lesz.';

    component.componentType = ComponentType.Mindfulness;

    // Act
    fixture.detectChanges();

    // Assert
    expect(component.imageSource).toEqual(expectedImageSource);
    expect(component.headingText).toEqual(expectedHeadingText);
    expect(component.paragraphText).toEqual(expectedParagraphText);
  });

  it('should set proper text and image for takeaway component type', () => {
    // Arrange
    const expectedImageSource = 'images/takeaway.png';
    const expectedHeadingText = 'ELVITEL';
    const expectedParagraphText = 'Elegendő a rendelést online, vagy telefonon leadni. Telefonos rendelés esetén az alábbi telefonszámon érdeklődhet: +421917275784. Online rendelését pedig az alábbi gombra kattintva adhatja le.';

    component.componentType = ComponentType.Takeaway;

    // Act
    fixture.detectChanges();

    // Assert
    expect(component.imageSource).toEqual(expectedImageSource);
    expect(component.headingText).toEqual(expectedHeadingText);
    expect(component.paragraphText).toEqual(expectedParagraphText);
  });
});
