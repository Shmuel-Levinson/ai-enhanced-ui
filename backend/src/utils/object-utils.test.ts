import { extractJsonFromString, nullifyFields } from './object-utils';

describe('extractJsonFromString', () => {
  // Sanity test - basic functionality
  test('should extract a valid JSON object from a string', () => {
    // Arrange
    const input = 'Some text before {"key": "value"} some text after';
    const expected = { key: 'value' };
    
    // Act
    const result = extractJsonFromString(input);
    
    // Assert
    expect(result).toEqual(expected);
  });

  // Simple edge case
  test('should return empty object when no valid JSON is found', () => {
    // Arrange
    const input = 'This string contains no valid JSON';
    
    // Act
    const result = extractJsonFromString(input);
    
    // Assert
    expect(result).toEqual({});
  });
});

describe('nullifyFields', () => {
  test('should set specified fields to null if they exist', () => {
    // Arrange
    const testObject = {
      name: 'John',
      age: 30,
      email: 'john@example.com',
      address: '123 Main St'
    };
    const fieldsToNullify = ['age', 'email', 'nonExistentField'];
    
    // Act
    nullifyFields(testObject, fieldsToNullify);
    
    // Assert
    expect(testObject).toEqual({
      name: 'John',
      age: null,
      email: null,
      address: '123 Main St'
    });
  });

  test('should not modify object if fields array is empty', () => {
    // Arrange
    const testObject = {
      name: 'John',
      age: 30
    };
    const originalObject = { ...testObject };
    const fieldsToNullify: string[] = [];
    
    // Act
    nullifyFields(testObject, fieldsToNullify);
    
    // Assert
    expect(testObject).toEqual(originalObject);
  });

  test('should handle non-object inputs gracefully', () => {
    // Arrange
    const testObject = null;
    const fieldsToNullify = ['property'];
    
    // Act & Assert
    expect(() => {
      nullifyFields(testObject, fieldsToNullify);
    }).not.toThrow();
  });
}); 