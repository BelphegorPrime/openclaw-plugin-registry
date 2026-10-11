/**
 * Hello World Plugin
 * 
 * A simple example plugin that demonstrates the basic structure
 * of an OpenClaw plugin.
 * 
 * @example
 * const helloWorld = require('./helloWorld');
 * helloWorld.setup();
 * const result = helloWorld.greet("OpenClaw");
 * console.log(result); // "Hello, OpenClaw! Welcome to OpenClaw!"
 */

const PLUGIN_NAME = "hello-world";
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
    description: "A simple Hello World plugin example",
    license: "Apache-2.0"
  };
}

module.exports = {
  setup,
  greet,
  getMetadata
};
