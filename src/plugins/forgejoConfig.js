/**
 * Forgejo Configuration Plugin
 * 
 * Plugin to configure and manage Forgejo instances via OpenClaw.
 * Supports:
 * - Configuring connections to Forgejo instances
 * - Repository operations (Create, Clone, Push, PR)
 * - Issue management
 * - Actions workflows
 * 
 * @author Jarvis
 * @version 1.1.0
 */

const PLUGIN_NAME = "forgejoConfig";
const PLUGIN_VERSION = "1.1.0";

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Helper for HTTP requests to Forgejo API
async function request(instance, endpoint, options = {}) {
  const url = `${instance.url.replace(/\/$/, '')}/api/v1${endpoint}`;
  const headers = {
    'Authorization': `token ${instance.token}`,
    'Content-Type': 'application/json',
    ...options.headers
  };

  const response = await fetch(url, {
    method: options.method || 'GET',
    headers: headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Forgejo API Error (${response.status}): ${errorData}`);
  }

  return response.json();
}

// Save configuration
function saveConfig(config) {
  const configDir = path.join(process.env.HOME || '/root', '.openclaw', 'config');
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
  const configPath = path.join(configDir, 'forgejo.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  return { success: true, message: `Configuration saved at: ${configPath}` };
}

// Load configuration
function loadConfig() {
  const configDir = path.join(process.env.HOME || '/root', '.openclaw', 'config');
  const configPath = path.join(configDir, 'forgejo.json');
  if (!fs.existsSync(configPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (e) {
    return null;
  }
}

// Configure Forgejo instance
function configureInstance(options) {
  const config = loadConfig() || {};
  config.instances = config.instances || {};
  
  const instanceName = options.name || 'default';
  config.instances[instanceName] = {
    url: options.url,
    token: options.token,
    authenticated: !!options.token
  };
  
  return saveConfig(config);
}

// Create a repository
async function createRepository(options) {
  const config = loadConfig();
  const instance = config?.instances?.default || Object.values(config?.instances || {})[0];
  if (!instance) throw new Error('No Forgejo instance configured.');

  const result = await request(instance, '/user/repos', {
    method: 'POST',
    body: {
      name: options.name,
      private: options.private || false,
      description: options.description || ''
    }
  });

  return { success: true, message: `Repository '${options.name}' created successfully.`, data: result };
}

// Clone a repository
function cloneRepository(options) {
  const config = loadConfig();
  const instance = config?.instances?.default || Object.values(config?.instances || {})[0];
  if (!instance) throw new Error('No Forgejo instance configured.');

  const repoUrl = `${instance.url}/${options.owner}/${options.repo}`;
  const dest = options.destination || options.repo;
  
  try {
    // Use token in URL for authentication during clone
    const authUrl = instance.token 
      ? `https://${instance.token}@${new URL(instance.url).hostname}${new URL(instance.url).pathname}/${options.owner}/${options.repo}`
      : repoUrl;

    execSync(`git clone ${authUrl} ${dest}`);
    return { success: true, message: `Repository cloned to ${dest}` };
  } catch (e) {
    throw new Error(`Git clone failed: ${e.message}`);
  }
}

// Push to a specific branch
function pushToBranch(options) {
  const config = loadConfig();
  const instance = config?.instances?.default || Object.values(config?.instances || {})[0];
  if (!instance) throw new Error('No Forgejo instance configured.');

  try {
    const authUrl = instance.token 
      ? `https://${instance.token}@${new URL(instance.url).hostname}${new URL(instance.url).pathname}/${options.owner}/${options.repo}`
      : `https://${new URL(instance.url).hostname}${new URL(instance.url).pathname}/${options.owner}/${options.repo}`;

    execSync(`git push ${authUrl} ${options.branch}`);
    return { success: true, message: `Pushed successfully to branch ${options.branch}` };
  } catch (e) {
    throw new Error(`Git push failed: ${e.message}`);
  }
}

// Create a Pull Request
async function createPullRequest(options) {
  const config = loadConfig();
  const instance = config?.instances?.default || Object.values(config?.instances || {})[0];
  if (!instance) throw new Error('No Forgejo instance configured.');

  const result = await request(instance, `/repos/${options.owner}/${options.repo}/pulls`, {
    method: 'POST',
    body: {
      title: options.title,
      head: options.head,
      base: options.base,
      body: options.body || ''
    }
  });

  return { success: true, message: `Pull request '${options.title}' created.`, data: result };
}

// List open issues
async function listIssues(options) {
  const config = loadConfig();
  const instance = config?.instances?.default || Object.values(config?.instances || {})[0];
  if (!instance) throw new Error('No Forgejo instance configured.');

  const result = await request(instance, `/repos/${options.owner}/${options.repo}/issues`);
  return { success: true, issues: result };
}

// Trigger a workflow dispatch
async function triggerWorkflow(options) {
  const config = loadConfig();
  const instance = config?.instances?.default || Object.values(config?.instances || {})[0];
  if (!instance) throw new Error('No Forgejo instance configured.');

  const result = await request(instance, `/repos/${options.owner}/${options.repo}/actions/workflows/${options.workflowId}/dispatches`, {
    method: 'POST',
    body: {
      ref: options.ref || 'main',
      inputs: options.inputs || {}
    }
  });

  return { success: true, message: `Workflow ${options.workflowId} triggered successfully.` };
}

function setup() {
  console.log(`🔧 Forgejo Configuration Plugin v${PLUGIN_VERSION} initialized`);
  return { setup: true, version: PLUGIN_VERSION };
}

function getMetadata() {
  return {
    name: PLUGIN_NAME,
    version: PLUGIN_VERSION,
    author: "Jarvis",
    description: "Forgejo instance management with real API integration for repositories, issues, and actions.",
    license: "Apache-2.0"
  };
}

module.exports = {
  setup,
  getMetadata,
  configureInstance,
  createRepository,
  cloneRepository,
  pushToBranch,
  createPullRequest,
  listIssues,
  triggerWorkflow,
  loadConfig
};
