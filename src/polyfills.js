// Polyfills for TON API compatibility
import { Buffer } from 'buffer';

// Set global Buffer
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
} else if (typeof global !== 'undefined') {
  global.Buffer = Buffer;
}

// Set global process
if (typeof window !== 'undefined') {
  window.process = window.process || { env: {} };
} else if (typeof global !== 'undefined') {
  global.process = global.process || { env: {} };
}

export { Buffer }; 