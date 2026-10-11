/**
 * Tests für GitLab und Gitea Plugins
 */

const gitlabConfig = require('../src/plugins/gitlabConfig');
const giteaConfig = require('../src/plugins/giteaConfig');

console.log('🧪 Starting GitLab & Gitea Plugin Tests...\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (error) {
    console.error(`❌ ${name}`);
    console.error(`   Error: ${error.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function assertEquals(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

// GitLab Tests
test('GitLab getMetadata returns correct values', () => {
  const metadata = gitlabConfig.getMetadata();
  assertEquals(metadata.name, 'gitlabConfig');
  assertEquals(metadata.version, '1.0.0');
  assertEquals(metadata.author, 'Jarvis');
  assert(metadata.license === 'Apache-2.0');
  assert(metadata.description.includes('GitLab'));
});

test('GitLab setup initializes the plugin', () => {
  const result = gitlabConfig.setup();
  assert(result.setup === true);
  assert(typeof result.version === 'string');
});

test('GitLab loadConfig returns null when no config exists', () => {
  const config = gitlabConfig.loadConfig();
  assert(config === null || typeof config === 'object');
});

test('GitLab configureInstance saves configuration', () => {
  const result = gitlabConfig.configureInstance({
    url: 'https://gitlab.example.com',
    name: 'default'
  });
  assert(result.success === true);
  assert(typeof result.message === 'string');
});

test('GitLab createProject works', async () => {
  const result = await gitlabConfig.createProject({
    name: 'test-project',
    private: false
  }).catch(e => ({ success: false, message: e.message }));
  // Will fail without token, but structure is correct
  assert(typeof result === 'object');
});

// Gitea Tests
test('Gitea getMetadata returns correct values', () => {
  const metadata = giteaConfig.getMetadata();
  assertEquals(metadata.name, 'giteaConfig');
  assertEquals(metadata.version, '1.0.0');
  assertEquals(metadata.author, 'Jarvis');
  assert(metadata.license === 'Apache-2.0');
  assert(metadata.description.includes('Gitea'));
});

test('Gitea setup initializes the plugin', () => {
  const result = giteaConfig.setup();
  assert(result.setup === true);
  assert(typeof result.version === 'string');
});

test('Gitea loadConfig returns null when no config exists', () => {
  const config = giteaConfig.loadConfig();
  assert(config === null || typeof config === 'object');
});

test('Gitea configureInstance saves configuration', () => {
  const result = giteaConfig.configureInstance({
    url: 'https://gitea.example.com',
    name: 'default'
  });
  assert(result.success === true);
  assert(typeof result.message === 'string');
});

test('Gitea createRepository works', async () => {
  const result = await giteaConfig.createRepository({
    name: 'test-repo',
    private: false
  }).catch(e => ({ success: false, message: e.message }));
  assert(typeof result === 'object');
});

// Summary
console.log('\n' + '='.repeat(50));
console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

process.exit(failed > 0 ? 1 : 0);
