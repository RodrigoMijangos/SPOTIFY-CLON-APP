import { TestBed } from '@angular/core/testing';

import { SpotifyLoginService } from './spotify-login-service';

describe('SpotifyLoginService', () => {
  let service: SpotifyLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpotifyLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
