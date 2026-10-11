/**
 * Gitea Configuration Plugin
 * 
 * Plugin to configure and manage Gitea instances via OpenClaw.
 * 
 * @author Jarvis
 * @version 1.0.0
 */

const PLUGIN_NAME = "giteaConfig";
const PLUGIN_VERSION = "1.0.0";

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function getSecretToken() {
  try {
    const tokenPath = path.join(process.env.HOME || '/root', '.openclaw', 'config', '.gitea_token');
    if (!fs.existsSync(tokenPath)) throw new Error('Gitea token file not found');
    return fs.readFileSync(tokenPath, 'utf8').trim();
  } catch (e) {
    throw new Error(`Token resolution failed: ${e.message}`);
  }
}

async function request(instance, endpoint, options = {}) {
  if (!instance) throw new Error('No Gitea instance configured.');
  const token = await getSecretToken();
  const url = `${instance.url.replace(/\/$/, '')}/api/v1${endpoint}`;
  const headers = {
    'Authorization': `token ${token}`,
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
    throw new Error(`Gitea API Error (${response.status}): ${errorData}`);
  }
  return response.json();
}

function saveConfig(config) {
  const configDir = path.join(process.env.HOME || '/root', '.openclaw', 'config');
  if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });
  const configPath = path.join(configDir, 'gitea.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  return { success: true, message: `Configuration saved at: ${configPath}` };
}

function loadConfig() {
  const configDir = path.join(process.env.HOME || '/root', '.openclaw', 'config');
  const configPath = path.join(configDir, 'gitea.json');
  if (!fs.existsSync(configPath)) return null;
  try { return JSON.parse(fs.readFileSync(configPath, 'utf8')); } catch (e) { return null; }
}

function configureInstance(options) {
  const config = loadConfig() || {};
  config.instances = config.instances || {};
  const instanceName = options.name || 'default';
  config.instances[instanceName] = { url: options.url, authenticated: true };
  return saveConfig(config);
}

async function testConnection() {
  const config = loadConfig();
  const instance = config?.instances?.default || Object.values(config?.instances || {})[0];
  if (!instance) throw new Error('No Gitea instance configured.');
  try {
    const user = await request(instance, '/user');
    return { success: true, message: `Successfully connected to ${instance.url}. Authenticated as: ${user.username}` };
  } catch (e) {
    return { success: false, message: `Connection failed: ${e.message}` };
  }
}

async function createRepository(options) {
  const config = loadConfig();
  const instance = config?.instances?.default || Object.values(config?.instances || {})[0];
  const result = await request(instance, '/user/repos', {
    method: 'POST',
    body: { name: options.name, private: options.private || false }
  });
  return { success: true, message: `Repository '${options.name}' created.`, data: result };
}

function setup() {
  console.log(`🔧 Gitea Configuration Plugin v${PLUGIN_VERSION} initialized`);
  return { setup: true, version: PLUGIN_VERSION };
}

function getMetadata() {
  return {
    name: PLUGIN_NAME,
    version: PLUGIN_VERSION,
    author: "Jarvis",
    description: "Gitea instance management for self-hosted Git servers.",
    license: "Apache-2.0"
  };
}

module.exports = { setup, getMetadata, configureInstance, testConnection, createRepository, loadConfig };
