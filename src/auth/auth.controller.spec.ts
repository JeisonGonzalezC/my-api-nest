import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn().mockImplementation(() => true),
            login: jest.fn().mockImplementation(() => ({ accessToken: 'fake-token' })),
          },
        },
      ],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should validate user and return access token', () => {
      const dto = { username: 'testuser', password: 'testpass' };

      const result = authController.login(dto);

      expect(authService.validateUser).toHaveBeenCalledWith(dto.username, dto.password);
      expect(authService.login).toHaveBeenCalledWith(dto.username);
      expect(result).toEqual({ accessToken: 'fake-token' });
    });

    it('should throw if validation fails', () => {
      const dto = { username: 'baduser', password: 'badpass' };

      (authService.validateUser as jest.Mock).mockImplementationOnce(() => {
        throw new UnauthorizedException('Invalid credentials');
      });

      expect(() => authController.login(dto)).toThrow(UnauthorizedException);
    });
  });
});
