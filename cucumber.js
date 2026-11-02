// Cucumber loads the TypeScript steps and hooks for both npm and direct CLI runs.
module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['step-definitions/**/*.ts', 'hooks/**/*.ts'],
  },
};
