import { execSync, ExecSyncOptions } from 'child_process';

export const PACKAGES = [
  'shared',
  'markdown',
  'core',
  //'schematics',

  // UI
  'formly',
  'auth',
];

export function exec(cmd: string, options: ExecSyncOptions = { stdio: 'inherit' }) {
  return execSync(cmd, options);
}