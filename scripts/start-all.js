#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const root = path.resolve(__dirname, '..');
const backendDir = path.join(root, 'backend');

function runCommand(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, Object.assign({ stdio: 'inherit', shell: true }, opts));
    p.on('exit', code => (code === 0 ? resolve(code) : reject(new Error(`${cmd} ${args.join(' ')} exited with ${code}`))));
    p.on('error', reject);
  });
}

(async () => {
  try {
    console.log('One-click start (node) — repo root:', root);

    // Install deps if missing
    if (!fs.existsSync(path.join(root, 'node_modules'))) {
      console.log('Installing root dependencies...');
      await runCommand('npm', ['install'], { cwd: root });
    } else {
      console.log('Root node_modules present — skipping install.');
    }

    // Generate Prisma client for backend
    if (fs.existsSync(path.join(backendDir, 'prisma', 'schema.prisma'))) {
      console.log('Generating Prisma client...');
      await runCommand('npx', ['prisma', 'generate', '--schema=prisma/schema.prisma'], { cwd: backendDir });
    }

    // Start backend and frontend concurrently in the same terminal
    console.log('Starting backend and frontend (logs will be printed here). Press Ctrl+C to stop.');

    const backend = spawn('npm', ['run', 'dev'], { cwd: backendDir, stdio: 'pipe', shell: true });
    const frontend = spawn('npm', ['run', 'dev'], { cwd: root, stdio: 'pipe', shell: true });

    function prefixStream(prefix, stream) {
      stream.on('data', chunk => {
        process.stdout.write(`[${prefix}] ${chunk}`);
      });
    }

    prefixStream('backend', backend.stdout);
    prefixStream('backend-err', backend.stderr);
    prefixStream('frontend', frontend.stdout);
    prefixStream('frontend-err', frontend.stderr);

    const exitHandler = (code) => {
      if (code !== 0) console.log('Process exited with', code);
      if (!backend.killed) backend.kill();
      if (!frontend.killed) frontend.kill();
      process.exit(code);
    };

    backend.on('exit', exitHandler);
    frontend.on('exit', exitHandler);

    process.on('SIGINT', () => {
      console.log('Received SIGINT, shutting down...');
      backend.kill();
      frontend.kill();
      process.exit(0);
    });

  } catch (err) {
    console.error('One-click start failed:', err);
    process.exit(1);
  }
})();
