import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
    strategy = new JwtStrategy();
  });

  describe('validate', () => {
    it('should return the username from payload', () => {
      const payload = { username: 'testuser' };

      const result = strategy.validate(payload);

      expect(result).toEqual({ username: 'testuser' });
    });
  });
});
