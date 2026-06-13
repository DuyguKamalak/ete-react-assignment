import { sequelize } from '../models';
import { authService } from './auth.service';

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('authService', () => {
  it('registers a new user and returns a signed token', async () => {
    const result = await authService.register('duygu', 'secret123');

    expect(result.user.username).toBe('duygu');
    expect(typeof result.token).toBe('string');
    expect(result.token.split('.')).toHaveLength(3); // header.payload.signature
  });

  it('rejects duplicate usernames', async () => {
    await expect(authService.register('duygu', 'another1')).rejects.toThrow(
      /already taken/i
    );
  });

  it('logs in with correct credentials', async () => {
    const result = await authService.login('duygu', 'secret123');
    expect(result.user.username).toBe('duygu');
  });

  it('rejects login with a wrong password', async () => {
    await expect(authService.login('duygu', 'wrongpass')).rejects.toThrow(
      /invalid username or password/i
    );
  });

  it('verifies a token it issued', async () => {
    const { token } = await authService.login('duygu', 'secret123');
    const payload = authService.verifyToken(token);
    expect(payload.username).toBe('duygu');
  });

  it('rejects a tampered token', () => {
    expect(() => authService.verifyToken('not.a.valid.token')).toThrow(
      /invalid or expired token/i
    );
  });
});
