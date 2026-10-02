const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// O projeto contém JavaScript compilado ao lado dos arquivos TypeScript.
// Priorizar TS/TSX garante que o Expo execute sempre o código-fonte atualizado.
config.resolver.sourceExts = [
  'ts',
  'tsx',
  ...config.resolver.sourceExts.filter((extension) => !['ts', 'tsx'].includes(extension)),
];

module.exports = config;
