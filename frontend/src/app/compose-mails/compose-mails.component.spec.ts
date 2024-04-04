import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComposeMailsComponent } from './compose-mails.component';

describe('ComposeMailsComponent', () => {
  let component: ComposeMailsComponent;
  let fixture: ComponentFixture<ComposeMailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComposeMailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComposeMailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
