import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read arguments or environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || process.argv[2];
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.argv[3];
const BUCKET_NAME = process.env.BUCKET_NAME || process.argv[4];

if (!SUPABASE_URL || !BUCKET_NAME) {
  console.error('Usage: node upload_to_supabase.mjs <SUPABASE_URL> <SUPABASE_KEY> <BUCKET_NAME>');
  console.error('Example: node upload_to_supabase.mjs https://abcdefghijklm.supabase.co sb_secret_... images');
  process.exit(1);
}

const PUBLIC_DIR = path.resolve(__dirname, '../frontend/public');

const MIME_TYPES = {
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
  '.json': 'application/json',
};

function getAllFiles(dir, base = '') {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const relPath = path.join(base, file).replace(/\\/g, '/');
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, relPath));
    } else {
      const ext = path.extname(file).toLowerCase();
      if (MIME_TYPES[ext]) {
        results.push({ fullPath, relPath, ext });
      }
    }
  }
  return results;
}

async function uploadFile(fileObj) {
  const { fullPath, relPath, ext } = fileObj;
  const mimeType = MIME_TYPES[ext] || 'application/octet-stream';
  const fileBuffer = fs.readFileSync(fullPath);

  const cleanUrl = SUPABASE_URL.replace(/\/+$/, '');
  const uploadEndpoint = `${cleanUrl}/storage/v1/object/${BUCKET_NAME}/${relPath}`;

  try {
    const response = await fetch(uploadEndpoint, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': mimeType,
        'x-upsert': 'true',
      },
      body: fileBuffer,
    });

    if (response.ok) {
      console.log(`✓ Uploaded: ${relPath}`);
      return true;
    } else {
      const errText = await response.text();
      console.error(`✗ Failed ${relPath} (${response.status}): ${errText}`);
      return false;
    }
  } catch (err) {
    console.error(`✗ Error uploading ${relPath}: ${err.message}`);
    return false;
  }
}

async function run() {
  console.log(`Starting upload to Supabase Storage:`);
  console.log(`- Project URL: ${SUPABASE_URL}`);
  console.log(`- Bucket: ${BUCKET_NAME}`);
  console.log(`- Source directory: ${PUBLIC_DIR}\n`);

  const files = getAllFiles(PUBLIC_DIR);
  console.log(`Found ${files.length} asset files to upload.\n`);

  const CONCURRENCY = 6;
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < files.length; i += CONCURRENCY) {
    const chunk = files.slice(i, i + CONCURRENCY);
    const results = await Promise.all(chunk.map((f) => uploadFile(f)));
    for (const res of results) {
      if (res) successCount++;
      else failCount++;
    }
    process.stdout.write(`Progress: ${successCount + failCount}/${files.length} files processed...\r`);
  }

  console.log(`\n========================================`);
  console.log(`Upload Complete: ${successCount}/${files.length} files successfully uploaded (Failed: ${failCount}).`);
  console.log(`Public URL base: ${SUPABASE_URL.replace(/\/+$/, '')}/storage/v1/object/public/${BUCKET_NAME}/`);
  console.log(`========================================`);
}

run();
