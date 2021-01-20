import { execSync, ExecSyncOptions } from 'child_process';

export const PACKAGES = [
  //'core',
  //'schematics',

  // UI
  'formly',
  'auth',
  'markdown',
];

export function exec(cmd: string, options: ExecSyncOptions = { stdio: 'inherit' }) {
  return execSync(cmd, options);
}