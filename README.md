# OpenClaw Plugin Template 🦊

A template repository for developing and organizing multiple OpenClaw plugins.

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![OpenClaw](https://img.shields.io/badge/OpenClaw-Plugin%20Template-orange)](https://openclaw.ai)

## 📦 Repository Structure

This repository is designed to hold multiple plugins in a single place:

```
openclaw-plugin-template/
├── src/
│   ├── index.js               # Main entry point - exports all plugins
│   └── plugins/               # Plugin directory
│       ├── helloWorld.js      # Example plugin 1
│       ├── pluginName.js      # Your plugin here
│       └── anotherPlugin.js   # Another plugin
├── tests/                     # Plugin tests
│   └── index.test.js
├── LICENSE                    # Apache 2.0 License
├── README.md                  # This file
├── CHANGELOG.md               # Version history
└── .gitignore                 # Git exclusions
```

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/BelphegorPrime/openclaw-plugin-template.git
cd openclaw-plugin-template
```

### 2. Add Your Plugin

Create a new plugin file in `src/plugins/`:

```javascript
// src/plugins/myPlugin.js

const PLUGIN_NAME = "my-plugin";
const PLUGIN_VERSION = "1.0.0";

function setup() {
  console.log(`🚀 ${PLUGIN_NAME} v${PLUGIN_VERSION} initialized`);
}

function myFunction() {
  // Your plugin logic here
}

function getMetadata() {
  return {
    name: PLUGIN_NAME,
    version: PLUGIN_VERSION,
    author: "Your Name",
    description: "My awesome OpenClaw plugin",
    license: "Apache-2.0"
  };
}

module.exports = {
  setup,
  myFunction,
  getMetadata
};
```

### 3. Export Your Plugin

Add your plugin to `src/index.js`:

```javascript
const plugins = {
  helloWorld: require('./plugins/helloWorld'),
  myPlugin: require('./plugins/myPlugin')  // Add your plugin here
};
```

## 🔧 Installing Plugins in OpenClaw

### Method 1: Install from Local Directory

```bash
# Navigate to the repository
cd openclaw-plugin-template

# Install all plugins
openclaw plugins install .

# Or install specific plugins only
openclaw plugins install src/plugins/helloWorld.js
```

### Method 2: Install via ClawHub

1. **Prepare your plugin:**
   - Add plugin to `src/plugins/`
   - Export in `src/index.js`
   - Write tests
   - Update documentation

2. **Publish to ClawHub:**
   ```bash
   openclaw plugins publish
   ```

3. **Install from ClawHub:**
   ```bash
   openclaw plugins install my-plugin
   ```

### Method 3: Install from GitHub Repository

```bash
# Install entire plugin collection
openclaw plugins install git+https://github.com/BelphegorPrime/openclaw-plugin-template.git

# Or install a specific plugin by path
openclaw plugins install git+https://github.com/BelphegorPrime/openclaw-plugin-template.git#src/plugins/helloWorld.js
```

### Method 4: Direct File Installation

```bash
# Copy plugin file to OpenClaw plugins directory
cp src/plugins/helloWorld.js ~/.openclaw/plugins/

# Enable the plugin
openclaw plugins enable helloWorld.js

# Or require it directly in your code
const helloWorld = require('~/.openclaw/plugins/helloWorld');
helloWorld.setup();
```

## 📋 Creating a New Plugin - Checklist

- [ ] Create plugin file in `src/plugins/`
- [ ] Implement `setup()` function
- [ ] Export plugin functions via `module.exports`
- [ ] Include `getMetadata()` function
- [ ] Add plugin to `src/index.js` exports
- [ ] Write tests in `tests/` directory
- [ ] Update README with usage examples
- [ ] Add .gitignore entries if needed
- [ ] Update version number
- [ ] Create CHANGELOG entry

## 📖 Plugin API Reference

Every plugin should follow this structure:

```javascript
const PLUGIN_NAME = "unique-plugin-name";
const PLUGIN_VERSION = "1.0.0";

/**
 * Initialize the plugin
 * Called when plugin is loaded
 */
function setup() {
  // Setup logic here
}

/**
 * Main plugin functionality
 * @returns {any} Result of the operation
 */
function mainFunction() {
  // Your logic
}

/**
 * Get plugin metadata
 * @returns {Object} Plugin metadata object
 */
function getMetadata() {
  return {
    name: PLUGIN_NAME,
    version: PLUGIN_VERSION,
    author: "Your Name",
    description: "Plugin description",
    license: "Apache-2.0"
  };
}

module.exports = {
  setup,
  mainFunction,
  getMetadata
};
```

## 🧪 Testing

Create tests for your plugins:

```javascript
// tests/index.test.js

const plugins = require('../src/index');

describe('Plugins', () => {
  describe('helloWorld', () => {
    it('should initialize', () => {
      plugins.helloWorld.setup();
      expect(plugins.helloWorld.getMetadata().name).toBe('hello-world');
    });

    it('should greet correctly', () => {
      const result = plugins.helloWorld.greet('Test');
      expect(result).toBe('Hello, Test! Welcome to OpenClaw!');
    });
  });
});
```

Run tests with:
```bash
npm test
# or
node --test tests/*.js
```

## 🐛 Troubleshooting

### "Plugin not found"
- Ensure the plugin path is correct
- Check that the plugin file exists
- Verify file permissions

### "Plugin cannot be loaded"
- Check syntax in the plugin file
- Ensure `module.exports` is correct
- Check OpenClaw logs for errors
- Verify the plugin is exported in `src/index.js`

### "Multiple plugins conflict"
- Use unique plugin names in `getMetadata()`
- Avoid global variable pollution
- Isolate plugin state

## 📚 Additional Resources

- [OpenClaw Documentation](https://docs.openclaw.ai)
- [ClawHub](https://clawhub.ai) - Plugin Marketplace
- [OpenClaw GitHub](https://github.com/openclaw/openclaw)

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Update documentation
6. Commit and push
7. Open a Pull Request

## 📄 License

Apache 2.0 - See [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for the OpenClaw Community**
