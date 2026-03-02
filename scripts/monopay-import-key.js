#!/usr/bin/env node
'use strict';

// this script inputs {MONO_MERCHANT_TOKEN, mono public/private key}, imports monopay signing key, returns keyId from API response/list
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const ARG_KEY_PATH = process.argv[2];

const resolveFile = (relativePath) => path.resolve(process.cwd(), relativePath);
const ENV_FILE_PATH = resolveFile('.env');

const parseDotEnv = () => {
  if (!fs.existsSync(ENV_FILE_PATH)) return {};
  const content = fs.readFileSync(ENV_FILE_PATH, 'utf8');
  const lines = content.split(/\r?\n/);
  const parsed = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex <= 0) continue;
    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    parsed[key] = value;
  }

  return parsed;
};

const localEnv = parseDotEnv();

const getEnv = (key, fallback = '') => process.env[key] || localEnv[key] || fallback;

const API_BASE = getEnv('MONO_API_URL', 'https://api.monobank.ua');
const TOKEN = getEnv('MONO_MERCHANT_TOKEN');
const KEY_NAME = getEnv('MONO_WIDGET_KEY_NAME', `kush-widget-${Date.now()}`);
const EXPIRES_AT = getEnv('MONO_WIDGET_KEY_EXPIRES_AT');

const readPublicKeyPem = () => {
  const explicitPath = ARG_KEY_PATH ? resolveFile(ARG_KEY_PATH) : null;
  const defaultPath = resolveFile('mono_public.pem');

  if (explicitPath && fs.existsSync(explicitPath)) {
    return fs.readFileSync(explicitPath, 'utf8').trim();
  }

  if (fs.existsSync(defaultPath)) {
    return fs.readFileSync(defaultPath, 'utf8').trim();
  }

  // Fallback: derive public key from MONO_WIDGET_PRIVATE_KEY (base64-encoded PEM)
  const privateKeyBase64 = getEnv('MONO_WIDGET_PRIVATE_KEY');
  if (!privateKeyBase64) {
    throw new Error(
      'Public key not found. Provide mono_public.pem as argument or set MONO_WIDGET_PRIVATE_KEY in environment.'
    );
  }

  const privateKeyPem = Buffer.from(privateKeyBase64, 'base64').toString('utf8');
  const publicKey = crypto.createPublicKey(privateKeyPem);
  return publicKey.export({ type: 'spki', format: 'pem' }).toString().trim();
};

const importPublicKey = async (keyValueBase64) => {
  const payload = { keyValue: keyValueBase64, keyName: KEY_NAME };
  if (EXPIRES_AT) payload.expiresAt = EXPIRES_AT;

  const response = await fetch(`${API_BASE}/api/merchant/monopay/pubkey-import`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Token': TOKEN,
    },
    body: JSON.stringify(payload),
  });

  const raw = await response.text();
  let data = null;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch (error) {
    data = { raw, parseError: String(error) };
  }

  return { ok: response.ok, status: response.status, data };
};

const listPublicKeys = async () => {
  const response = await fetch(`${API_BASE}/api/merchant/monopay/pubkey-list`, {
    method: 'GET',
    headers: { 'X-Token': TOKEN },
  });

  const raw = await response.text();
  let data = null;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch (error) {
    data = { raw, parseError: String(error) };
  }

  return { ok: response.ok, status: response.status, data };
};

const main = async () => {
  if (!TOKEN) {
    throw new Error('MONO_MERCHANT_TOKEN is required');
  }

  const publicKeyPem = readPublicKeyPem();
  // monobank docs require keyValue as base64 of pubkey.pem content
  const keyValueBase64 = Buffer.from(publicKeyPem, 'utf8').toString('base64');

  console.log('Importing MonoPay key...');
  const imported = await importPublicKey(keyValueBase64);
  console.log(`Import status: ${imported.status}`);
  console.log('Import response:', JSON.stringify(imported.data, null, 2));

  console.log('\nFetching key list...');
  const listed = await listPublicKeys();
  console.log(`List status: ${listed.status}`);
  console.log('List response:', JSON.stringify(listed.data, null, 2));

  const keys = listed?.data?.list;
  if (Array.isArray(keys) && keys.length) {
    const latest = keys[keys.length - 1];
    const keyId = latest?.keyId || latest?.id;
    if (keyId) {
      console.log(`\nMONO_WIDGET_KEY_ID=${keyId}`);
      console.log('Set this value in backend/.env');
    }
  }
};

(async () => {
  try {
    await main();
  } catch (error) {
    console.error('MonoPay key import failed:', error.message);
    process.exit(1);
  }
})();
