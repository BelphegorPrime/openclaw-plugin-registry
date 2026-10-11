/**
 * Tests für das Forgejo Configuration Plugin
 */

const forgejoConfig = require('../src/plugins/forgejoConfig');

describe('Forgejo Configuration Plugin', () => {
  describe('getMetadata', () => {
    it('should return correct metadata', () => {
      const metadata = forgejoConfig.getMetadata();
      
      expect(metadata.name).toBe('forgejoConfig');
      expect(metadata.version).toBe('1.0.0');
      expect(metadata.author).toBe('Jarvis');
      expect(metadata.license).toBe('Apache-2.0');
      expect(metadata.description).toContain('Forgejo');
    });
  });

  describe('setup', () => {
    it('should initialize the plugin', () => {
      const result = forgejoConfig.setup();
      
      expect(result).toHaveProperty('setup', true);
      expect(result).toHaveProperty('version');
    });
  });

  describe('loadConfig', () => {
    it('should return null when no config exists', () => {
      const config = forgejoConfig.loadConfig();
      // Can be null if no config file exists yet
      expect(config).toBeNull();
    });
  });

  describe('configureInstance', () => {
    it('should save instance configuration', () => {
      const result = forgejoConfig.configureInstance({
        url: 'https://git.szb.marcel.codes',
        name: 'szb',
        token: 'test-token'
      });
      
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('message');
    });
  });

  describe('createRepository', () => {
    it('should create repository (mock)', () => {
      const result = forgejoConfig.createRepository({
        name: 'test-repo',
        private: false
      });
      
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('message');
    });
  });

  describe('cloneRepository', () => {
    it('should clone repository (mock)', () => {
      const result = forgejoConfig.cloneRepository({
        owner: 'test-user',
        repo: 'test-repo',
        destination: './test-repo'
      });
      
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('message');
    });
  });

  describe('pushToBranch', () => {
    it('should push to branch (mock)', () => {
      const result = forgejoConfig.pushToBranch({
        owner: 'test-user',
        repo: 'test-repo',
        branch: 'feature-branch'
      });
      
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('message');
    });
  });

  describe('createPullRequest', () => {
    it('should create pull request (mock)', () => {
      const result = forgejoConfig.createPullRequest({
        owner: 'test-user',
        repo: 'test-repo',
        title: 'Test PR',
        head: 'feature-branch',
        base: 'main',
        body: 'Test description'
      });
      
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('message');
    });
  });

  describe('listIssues', () => {
    it('should list issues (mock)', () => {
      const result = forgejoConfig.listIssues({
        owner: 'test-user',
        repo: 'test-repo'
      });
      
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('issues');
      expect(result.issues).toBeInstanceOf(Array);
    });
  });

  describe('triggerWorkflow', () => {
    it('should trigger workflow (mock)', () => {
      const result = forgejoConfig.triggerWorkflow({
        owner: 'test-user',
        repo: 'test-repo',
        workflowId: 'test-workflow.yml',
        ref: 'main',
        inputs: { key: 'value' }
      });
      
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('message');
    });
  });
});
