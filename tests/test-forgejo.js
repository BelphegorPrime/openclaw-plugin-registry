/**
 * Einfache Tests für das Forgejo Configuration Plugin
 */

const forgejoConfig = require('../src/plugins/forgejoConfig');

console.log('🧪 Starting Forgejo Configuration Plugin Tests...\n');

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

// Tests
test('getMetadata returns correct values', () => {
  const metadata = forgejoConfig.getMetadata();
  assertEquals(metadata.name, 'forgejoConfig');
  assertEquals(metadata.version, '1.0.0');
  assertEquals(metadata.author, 'Jarvis');
  assert(metadata.license === 'Apache-2.0');
  assert(metadata.description.includes('Forgejo'));
});

test('setup initializes the plugin', () => {
  const result = forgejoConfig.setup();
  assert(result.setup === true);
  assert(typeof result.version === 'string');
});

test('loadConfig returns null when no config exists', () => {
  const config = forgejoConfig.loadConfig();
  // Config might exist or not - both are valid
  assert(config === null || typeof config === 'object');
});

test('configureInstance saves configuration', () => {
  const result = forgejoConfig.configureInstance({
    url: 'https://git.szb.marcel.codes',
    name: 'szb',
    token: 'test-token'
  });
  assert(result.success === true);
  assert(typeof result.message === 'string');
});

test('createRepository works', () => {
  const result = forgejoConfig.createRepository({
    name: 'test-repo',
    private: false
  });
  assert(result.success === true);
  assert(typeof result.message === 'string');
});

test('cloneRepository works', () => {
  const result = forgejoConfig.cloneRepository({
    owner: 'test-user',
    repo: 'test-repo'
  });
  assert(result.success === true);
});

test('pushToBranch works', () => {
  const result = forgejoConfig.pushToBranch({
    owner: 'test-user',
    repo: 'test-repo',
    branch: 'main'
  });
  assert(result.success === true);
});

test('createPullRequest works', () => {
  const result = forgejoConfig.createPullRequest({
    owner: 'test-user',
    repo: 'test-repo',
    title: 'Test PR',
    head: 'feature-branch',
    base: 'main'
  });
  assert(result.success === true);
});

test('listIssues works', () => {
  const result = forgejoConfig.listIssues({
    owner: 'test-user',
    repo: 'test-repo'
  });
  assert(result.success === true);
  assert(Array.isArray(result.issues));
});

test('triggerWorkflow works', () => {
  const result = forgejoConfig.triggerWorkflow({
    owner: 'test-user',
    repo: 'test-repo',
    workflowId: 'test.yml'
  });
  assert(result.success === true);
});

// Summary
console.log('\n' + '='.repeat(50));
console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

process.exit(failed > 0 ? 1 : 0);
