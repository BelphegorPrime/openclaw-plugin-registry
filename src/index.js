/**
 * OpenClaw Plugin Collection
 * 
 * This file exports all available plugins from this repository.
 * Import individual plugins or load them all at once.
 * 
 * @example
 * // Import all plugins
 * const plugins = require('./index');
 * plugins.helloWorld.setup();
 * 
 * // Or import individually
 * const { helloWorld } = require('./index');
 * helloWorld.setup();
 */

const plugins = {
  helloWorld: require('./plugins/helloWorld'),
  forgejoConfig: require('./plugins/git-servers/forgejoConfig'),
  gitlabConfig: require('./plugins/git-servers/gitlabConfig'),
  giteaConfig: require('./plugins/git-servers/giteaConfig')
};

// Automatically setup all plugins if this file is run directly
if (require.main === module) {
  Object.values(plugins).forEach(plugin => {
    if (typeof plugin.setup === 'function') {
      plugin.setup();
    }
  });
  console.log(`✅ Loaded ${Object.keys(plugins).length} plugin(s)`);
}

module.exports = plugins;
