const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const path = require('node:path');

module.exports = {
  packagerConfig: {
    asar: false,
    icon: "./src/assets/ico/Executable",
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        iconUrl: "https://raw.githubusercontent.com/Dustin-Jiang/portal-2d/master/src/assets/ico/Executable.ico",
        setupIcon: path.resolve(__dirname, "./src/assets/ico/Installer-Windows.ico"),
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        icon: './src/assets/ico/Installer-macOS.icns',
        format: 'ULFO',
      }
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        name: 'portal-its-mygo',
        productName: 'Portal: It\'s MyGO!!!!!',
        section: 'games',
        categories: ['Game'],
        bin: "Portal - It's MyGO!!!!!",
      },
    },
  ],
  plugins: [
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: false,
      [FuseV1Options.OnlyLoadAppFromAsar]: false,
    }),
  ],
};
