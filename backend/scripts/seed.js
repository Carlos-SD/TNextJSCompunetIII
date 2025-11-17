#!/usr/bin/env node

const http = require('http');

// Configuración
const HOST = process.env.DB_HOST || 'localhost';
const PORT = process.env.PORT || 3000;
const ENDPOINT = '/api/seed';
const CLEAR_ENDPOINT = '/api/seed/clear';

// Función para hacer la petición
function makeRequest(path, callback) {
  const options = {
    hostname: 'localhost',
    port: PORT,
    path: path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      callback(null, { status: res.statusCode, data });
    });
  });

  req.on('error', (error) => {
    callback(error, null);
  });

  req.end();
}

// Ejecutar seed
function runSeed(clear = false) {
  console.log('🌱 Ejecutando seed...\n');

  const endpoint = clear ? CLEAR_ENDPOINT : ENDPOINT;
  const action = clear ? 'limpiando' : 'poblando';

  console.log(`${action.charAt(0).toUpperCase() + action.slice(1)} datos...`);

  makeRequest(endpoint, (error, result) => {
    if (error) {
      console.error('❌ Error:', error.message);
      console.error('\n💡 Asegúrate de que el servidor esté corriendo:');
      console.error('   bun run start:dev');
      process.exit(1);
    }

    if (result.status === 200 || result.status === 201) {
      console.log('✅ Éxito!');
      console.log(result.data);
      process.exit(0);
    } else {
      console.error('❌ Error:', result.status);
      console.error(result.data);
      process.exit(1);
    }
  });
}

// Parsear argumentos
const args = process.argv.slice(2);
const clear = args.includes('--clear') || args.includes('-c');

// Ejecutar
runSeed(clear);
