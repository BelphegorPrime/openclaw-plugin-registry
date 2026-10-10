/**
 * Example OpenClaw Plugin
 * 
 * This is a template plugin that can be installed and used in OpenClaw.
 * 
 * @example
 * // Import the plugin
 * const myPlugin = require('./plugin');
 * 
 * // Use the plugin
 * myPlugin.setup();
 * const result = myPlugin.greet("World");
 * console.log(result); // "Hello, World!"
 */

const PLUGIN_NAME = "example-plugin";
const PLUGIN_VERSION = "1.0.0";

/**
 * Initialize the plugin
 */
function setup() {
  console.log(`🚀 ${PLUGIN_NAME} v${PLUGIN_VERSION} initialized`);
}

/**
 * Greet someone
 * 
 * @param {string} name - The name to greet
 * @returns {string} A greeting message
 */
function greet(name) {
  return `Hello, ${name}! Welcome to OpenClaw!`;
}

/**
 * Get plugin metadata
 * 
 * @returns {Object} Plugin metadata
 */
function getMetadata() {
  return {
    name: PLUGIN_NAME,
    version: PLUGIN_VERSION,
    author: "Your Name",
    description: "Example OpenClaw Plugin Template",
    license: "Apache-2.0"
  };
}

module.exports = {
  setup,
  greet,
  getMetadata
};
