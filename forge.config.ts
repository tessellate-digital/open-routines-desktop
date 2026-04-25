import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDMG } from '@electron-forge/maker-dmg';
import { VitePlugin } from '@electron-forge/plugin-vite';
const config: ForgeConfig = {
  packagerConfig: {
    asar: {
      unpack: '**/*.node',
    },
    name: 'Open Routines',
    icon: './resources/icon',
    extendInfo: {
      CFBundleIconFile: 'icon',
    },
    extraResource: ['resources/icon.icns'],
    osxSign: {
      optionsForFile: () => ({
        entitlements: './entitlements.plist',
      }),
    },
    ...(process.env.APPLE_ID &&
      process.env.APPLE_PASSWORD &&
      process.env.APPLE_TEAM_ID && {
        osxNotarize: {
          appleId: process.env.APPLE_ID,
          appleIdPassword: process.env.APPLE_PASSWORD,
          teamId: process.env.APPLE_TEAM_ID,
        },
      }),
  },
  makers: [new MakerZIP({}, ['darwin', 'linux']), new MakerDMG({ name: 'Open-Routines', icon: './resources/icon.icns' })],
  plugins: [
    new VitePlugin({
      build: [
        {
          entry: 'src/main/index.ts',
          config: 'vite.main.config.ts',
          target: 'main',
        },
        {
          entry: 'src/preload/preload.ts',
          config: 'vite.preload.config.ts',
          target: 'preload',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.ts',
        },
      ],
    }),
  ],
};

export default config;
