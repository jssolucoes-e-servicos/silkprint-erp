import { execSync } from 'child_process';
import net from 'net';

console.log('--- SYSTEM PROCESSES ---');
try {
  // Use ps or other methods if possible
  const ps = execSync('ps -ef || ps aux || true').toString();
  console.log(ps);
} catch (e) {
  console.error('Failed to run ps:', e);
}

console.log('--- PORT 3000 STATUS ---');
const port = 3000;
const client = new net.Socket();
client.setTimeout(2000);
client.on('connect', () => {
  console.log('Port 3000 is open and accepting connections.');
  client.destroy();
}).on('timeout', () => {
  console.log('Attempt to connect to port 3000 timed out.');
  client.destroy();
}).on('error', (err) => {
  console.log('Port 3000 connection error:', err.message);
}).connect(port, '127.0.0.1');
