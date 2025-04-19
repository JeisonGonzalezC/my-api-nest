import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(() => {
    jwtService = new JwtService({
      secret: 'test-secret',
      signOptions: { expiresIn: '1h' },
    });

    authService = new AuthService(jwtService);

    process.env.AUTH_USER = 'testuser';
    process.env.AUTH_PASSWORD = 'testpass';
  });

  describe('validateUser', () => {
    it('should validate correct credentials', () => {
      expect(authService.validateUser('testuser', 'testpass')).toBe(true);
    });

    it('should throw UnauthorizedException for invalid credentials', () => {
      expect(() => authService.validateUser('wrong', 'credentials')).toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return an access token', () => {
      const payload = { username: 'testuser' };
      const spySign = jest.spyOn(jwtService, 'sign').mockReturnValue('fake-token');

      const result = authService.login('testuser');

      expect(spySign).toHaveBeenCalledWith(payload);
      expect(result).toEqual({ accesToken: 'fake-token' });
    });
  });
});
