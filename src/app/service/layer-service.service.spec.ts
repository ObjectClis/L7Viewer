import { TestBed } from '@angular/core/testing';

import { LayerServiceService } from './layer-service.service';

describe('LayerServiceService', () => {
  let service: LayerServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LayerServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
