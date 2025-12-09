import { errorHandler } from '../../utils/error.js';

describe('errorHandler utility', () => {
  it('should create an error with the specified status code and message', () => {
    const statusCode = 404;
    const message = 'Resource not found';
    
    const error = errorHandler(statusCode, message);
    
    expect(error).toBeInstanceOf(Error);
    expect(error.statusCode).toBe(statusCode);
    expect(error.message).toBe(message);
  });

  it('should create an error with status code 500', () => {
    const statusCode = 500;
    const message = 'Internal server error';
    
    const error = errorHandler(statusCode, message);
    
    expect(error.statusCode).toBe(500);
    expect(error.message).toBe(message);
  });

  it('should create an error with status code 401', () => {
    const statusCode = 401;
    const message = 'Unauthorized access';
    
    const error = errorHandler(statusCode, message);
    
    expect(error.statusCode).toBe(401);
    expect(error.message).toBe(message);
  });

  it('should handle empty message strings', () => {
    const statusCode = 400;
    const message = '';
    
    const error = errorHandler(statusCode, message);
    
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe('');
  });

  it('should handle various status codes', () => {
    const testCases = [
      { code: 200, msg: 'Success' },
      { code: 201, msg: 'Created' },
      { code: 400, msg: 'Bad Request' },
      { code: 403, msg: 'Forbidden' },
      { code: 404, msg: 'Not Found' },
    ];

    testCases.forEach(({ code, msg }) => {
      const error = errorHandler(code, msg);
      expect(error.statusCode).toBe(code);
      expect(error.message).toBe(msg);
    });
  });
});
