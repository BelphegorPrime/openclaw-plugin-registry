/**
 * Tests for Hello World Plugin
 */

const helloWorld = require('../src/plugins/helloWorld');

describe('Hello World Plugin', () => {
  describe('getMetadata', () => {
    it('should return correct plugin metadata', () => {
      const metadata = helloWorld.getMetadata();
      
      expect(metadata.name).toBe('hello-world');
      expect(metadata.version).toBe('1.0.0');
      expect(metadata.description).toBe('A simple Hello World plugin example');
      expect(metadata.license).toBe('Apache-2.0');
    });
  });

  describe('setup', () => {
    it('should initialize without errors', () => {
      expect(() => helloWorld.setup()).not.toThrow();
    });

    it('should log initialization message', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      helloWorld.setup();
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('hello-world'));
      consoleSpy.mockRestore();
    });
  });

  describe('greet', () => {
    it('should return greeting for given name', () => {
      const result = helloWorld.greet('OpenClaw');
      expect(result).toBe('Hello, OpenClaw! Welcome to OpenClaw!');
    });

    it('should handle empty string', () => {
      const result = helloWorld.greet('');
      expect(result).toBe('Hello, ! Welcome to OpenClaw!');
    });

    it('should handle special characters', () => {
      const result = helloWorld.greet('🦊');
      expect(result).toBe('Hello, 🦊! Welcome to OpenClaw!');
    });
  });
});
