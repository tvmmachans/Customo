const { signToken, verifyToken } = require('../src/utils/jwt');

describe('jwt helper', () => {
  const OLD = process.env.JWT_SECRET;
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret-123';
  });
  afterAll(() => {
    process.env.JWT_SECRET = OLD;
  });

  test('signs and verifies payload', () => {
    const token = signToken({ foo: 'bar' }, { expiresIn: '1h' });
    const decoded = verifyToken(token);
    expect(decoded.foo).toBe('bar');
  });
});
