/**
 * GitLab Configuration Plugin
 * 
 * Plugin to configure and manage GitLab instances via OpenClaw.
 * Supports:
 * - Configuring connections to GitLab instances
 * - Repository operations (Create, Clone, Push, PR/Merge Requests)
 * - Issue management
 * - CI/CD pipeline triggers
 * 
 * @author Jarvis
 * @version 1.0.0
 */

const PLUGIN_NAME = "gitlabConfig";
const PLUGIN_VERSION = "1.0.0";

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Helper to get token from the secure local config file
async function getSecretToken() {
    try {
        const tokenPath = path.join(process.env.HOME || '/root', '.openclaw', 'config', '.gitlab_token');
        if (!fs.existsSync(tokenPath)) {
            throw new Error('GitLab token file not found at ' + tokenPath);
        }
        const token = fs.readFileSync(tokenPath, 'utf8').trim();
        if (!token) {
            throw new Error('GitLab token file is empty');
        }
        return token;
    } catch (e) {
        throw new Error(`Token resolution failed: ${e.message}`);
    }
}

// Helper for HTTP requests to GitLab API
async function request(instance, endpoint, options = {}) {
    if (!instance) {
        throw new Error('No GitLab instance configured.');
    }

    const token = await getSecretToken();
    const url = `${instance.url.replace(/\/$/, '')}/api/v4${endpoint}`;
    const headers = {
        'PRIVATE-TOKEN': token,
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
        throw new Error(`GitLab API Error (${response.status}): ${errorData}`);
    }

    return response.json();
}

// Save configuration (URL and Instance Name only)
function saveConfig(config) {
    const configDir = path.join(process.env.HOME || '/root', '.openclaw', 'config');
    if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
    }
    const configPath = path.join(configDir, 'gitlab.json');
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    return { success: true, message: `Configuration saved at: ${configPath}` };
}

// Load configuration
function loadConfig() {
    const configDir = path.join(process.env.HOME || '/root', '.openclaw', 'config');
    const configPath = path.join(configDir, 'gitlab.json');
    if (!fs.existsSync(configPath)) return null;
    try {
        return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (e) {
        return null;
    }
}

// Configure GitLab instance
function configureInstance(options) {
    const config = loadConfig() || {};
    config.instances = config.instances || {};
    
    const instanceName = options.name || 'default';
    config.instances[instanceName] = {
        url: options.url,
        authenticated: true
    };
    
    return saveConfig(config);
}

// Test the connection
async function testConnection() {
    const config = loadConfig();
    const instance = config?.instances?.default || Object.values(config?.instances || {})[0];
    if (!instance) throw new Error('No GitLab instance configured. Please run configureInstance first.');

    try {
        const user = await request(instance, '/user');
        return { 
            success: true, 
            message: `Successfully connected to ${instance.url}. Authenticated as: ${user.username}` 
        };
    } catch (e) {
        return { success: false, message: `Connection failed: ${e.message}` };
    }
}

// Create a project
async function createProject(options) {
    const config = loadConfig();
    const instance = config?.instances?.default || Object.values(config?.instances || {})[0];
    if (!instance) throw new Error('No GitLab instance configured.');

    const result = await request(instance, '/projects', {
        method: 'POST',
        body: {
            name: options.name,
            visibility: options.private ? 'private' : 'public',
            description: options.description || ''
        }
    });

    return { success: true, message: `Project '${options.name}' created successfully.`, data: result };
}

// Clone a project
async function cloneProject(options) {
    const config = loadConfig();
    const instance = config?.instances?.default || Object.values(config?.instances || {})[0];
    if (!instance) throw new Error('No GitLab instance configured.');
    
    const token = await getSecretToken();

    const projectUrl = `${instance.url}/${options.owner}/${options.repo}`;
    const dest = options.destination || options.repo;
    
    try {
        const authUrl = `https://oauth2:${token}@${new URL(instance.url).hostname}${new URL(instance.url).pathname}/${options.owner}/${options.repo}`;
        execSync(`git clone ${authUrl} ${dest}`);
        return { success: true, message: `Project cloned to ${dest}` };
    } catch (e) {
        throw new Error(`Git clone failed: ${e.message}`);
    }
}

// Push to a specific branch
async function pushToBranch(options) {
    const config = loadConfig();
    const instance = config?.instances?.default || Object.values(config?.instances || {})[0];
    if (!instance) throw new Error('No GitLab instance configured.');
    
    const token = await getSecretToken();

    try {
        const authUrl = `https://oauth2:${token}@${new URL(instance.url).hostname}${new URL(instance.url).pathname}/${options.owner}/${options.repo}`;
        execSync(`git push ${authUrl} ${options.branch}`);
        return { success: true, message: `Pushed successfully to branch ${options.branch}` };
    } catch (e) {
        throw new Error(`Git push failed: ${e.message}`);
    }
}

// Create a Merge Request
async function createMergeRequest(options) {
    const config = loadConfig();
    const instance = config?.instances?.default || Object.values(config?.instances || {})[0];
    if (!instance) throw new Error('No GitLab instance configured.');

    const result = await request(instance, `/projects/${options.owner}%2F${options.repo}/merge_requests`, {
        method: 'POST',
        body: {
            title: options.title,
            source_branch: options.head,
            target_branch: options.base,
            description: options.body || ''
        }
    });

    return { success: true, message: `Merge request '${options.title}' created.`, data: result };
}

// List open issues
async function listIssues(options) {
    const config = loadConfig();
    const instance = config?.instances?.default || Object.values(config?.instances || {})[0];
    if (!instance) throw new Error('No GitLab instance configured.');

    const result = await request(instance, `/projects/${options.owner}%2F${options.repo}/issues`);
    return { success: true, issues: result };
}

// Trigger a pipeline
async function triggerPipeline(options) {
    const config = loadConfig();
    const instance = config?.instances?.default || Object.values(config?.instances || {})[0];
    if (!instance) throw new Error('No GitLab instance configured.');

    const result = await request(instance, `/projects/${options.owner}%2F${options.repo}/trigger/pipeline`, {
        method: 'POST',
        body: {
            ref: options.ref || 'main',
            token: await getSecretToken(),
            variables: options.variables || {}
        }
    });

    return { success: true, message: `Pipeline triggered successfully for ref ${options.ref}.`, data: result };
}

function setup() {
    console.log(`🔧 GitLab Configuration Plugin v${PLUGIN_VERSION} initialized`);
    return { setup: true, version: PLUGIN_VERSION };
}

function getMetadata() {
    return {
        name: PLUGIN_NAME,
        version: PLUGIN_VERSION,
        author: "Jarvis",
        description: "GitLab instance management with repository, issue, and CI/CD pipeline support.",
        license: "Apache-2.0"
    };
}

module.exports = {
    setup,
    getMetadata,
    configureInstance,
    testConnection,
    createProject,
    cloneProject,
    pushToBranch,
    createMergeRequest,
    listIssues,
    triggerPipeline,
    loadConfig
};
