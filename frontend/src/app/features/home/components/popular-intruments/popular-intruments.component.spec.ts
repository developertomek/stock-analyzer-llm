import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularIntrumentsComponent } from './popular-intruments.component';

describe('PopularIntrumentsComponent', () => {
  let component: PopularIntrumentsComponent;
  let fixture: ComponentFixture<PopularIntrumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopularIntrumentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopularIntrumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
