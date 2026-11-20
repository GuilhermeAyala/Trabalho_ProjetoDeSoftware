const { spawnSync } = require('node:child_process');
const { networkInterfaces } = require('node:os');

const addresses = Object.values(networkInterfaces())
  .flat()
  .filter((address) => address?.family === 'IPv4' && !address.internal)
  .map((address) => address.address);
const priority = (address) => {
  if (address.startsWith('192.168.')) return 0;
  if (address.startsWith('10.')) return 1;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(address)) return 2;
  return 3;
};
const lanHost = addresses.sort((left, right) => priority(left) - priority(right))[0];

const expoCli = require.resolve('expo/bin/cli');
const result = spawnSync(
  process.execPath,
  [expoCli, 'start', '--lan', ...process.argv.slice(2)],
  {
    env: {
      ...process.env,
      EXPO_NO_DEPENDENCY_VALIDATION: '1',
      EXPO_NO_TELEMETRY: '1',
      ...(lanHost && !process.env.REACT_NATIVE_PACKAGER_HOSTNAME
        ? { REACT_NATIVE_PACKAGER_HOSTNAME: lanHost }
        : {}),
    },
    stdio: 'inherit',
  },
);

if (result.error) {
  console.error('Não foi possível iniciar o Expo:', result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
