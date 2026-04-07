const { exec, spawn } = require('child_process');
const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const localIP = getLocalIP();

console.log('');
console.log('========================================');
console.log(`  📱 Access from HP: http://${localIP}:3000`);
console.log('========================================');
console.log('');

const next = spawn('npx', ['next', 'dev', '--hostname', '0.0.0.0'], {
  stdio: 'inherit',
  shell: true
});

next.on('close', (code) => {
  process.exit(code);
});
