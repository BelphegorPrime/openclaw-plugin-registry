# OpenClaw Plugin Registry 🦊

A central repository for developing and organizing multiple OpenClaw plugins.

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![OpenClaw](https://img.shields.io/badge/OpenClaw-Plugin%20Registry-orange)](https://openclaw.ai)

## 📦 Repository Structure

This repository is designed to hold multiple plugins in a single place:

```
openclaw-plugin-registry/
├── src/
│   ├── index.js               # Main entry point - exports all plugins
│   └── plugins/               # Plugin directory
│       ├── helloWorld.js      # Example plugin 1
│       └── git-servers/       # Git Server Management Plugins
│           ├── forgejoConfig.js
│           ├── gitlabConfig.js
│           └── giteaConfig.js
├── tests/                     # Plugin tests
│   └── forgejoConfig.test.js
├── LICENSE                    # Apache 2.0 License
├── README.md                  # This file
├── CHANGELOG.md               # Version history
└── .gitignore                 # Git exclusions
```

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/BelphegorPrime/openclaw-plugin-registry.git
cd openclaw-plugin-registry
```

### 2. Add Your Plugin

Create a new plugin file in `src/plugins/` or a category subfolder. See the `forgejoConfig.js` for a real-world example.

### 3. Export Your Plugin

Add your plugin to `src/index.js`:

```javascript
const plugins = {
  helloWorld: require('./plugins/helloWorld'),
  myPlugin: require('./plugins/myPlugin')  // Add your plugin here
};
```

## 🔧 Installing Plugins in OpenClaw

### Local Development Installation
For fast iteration during development, copy the plugin file directly:
```bash
cp src/plugins/myPlugin.js ~/.openclaw/plugins/
```

### Official Package Installation
Create a `package.json` in the plugin directory and install via:
```bash
openclaw plugins install /path/to/plugin-dir --force
```

## 🛠️ Special Case: Git Server Plugins Setup

The `git-servers` plugins require a Personal Access Token (PAT) to communicate with the respective instances.

### Token Configuration
For security, the plugins read the token from a protected local file instead of storing it in the main config:

- **Forgejo:** `~/.openclaw/config/.forgejo_token`
- **GitLab:** `~/.openclaw/config/.gitlab_token`
- **Gitea:** `~/.openclaw/config/.gitea_token`

Example:
```bash
echo "YOUR_TOKEN_HERE" > ~/.openclaw/config/.forgejo_token
chmod 600 ~/.openclaw/config/.forgejo_token
```

### Configuring the Instance
Once the token is in place, configure the server URL:
```javascript
// Using the plugin in OpenClaw
forgejo.configureInstance({
  url: 'https://git.szb.marcel.codes',
  name: 'default'
});
```

## 📋 Plugin Architecture

Every plugin should follow this structure:
- **`setup()`**: Initialize the plugin.
- **`getMetadata()`**: Return name, version, and description.
- **Core Logic**: Export functions for the specific task.

## 🧪 Testing

Run tests from the root directory:
```bash
node tests/test-forgejo.js
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
