const fs = require('fs');
const path = require('path');

// Config
const ROOT = path.resolve(__dirname, '..', '..');
const exts = ['.html', '.js', '.json'];
const titleRegex = /<title>.*?<\/title>/gi;

const replacements = [
  { from: /Bayrampaşa Belediyesi/g, to: 'Orhanpaşa Belediyesi' },
  { from: /Bayrampaşa/g, to: 'Orhanpaşa' }
];

const titleReplacement = '<title>Orhanpaşa Belediyesi - Resmi Web Sitesi</title>';
const emailReplacement = 'iletisim@orhanpasa.bel.tr';
const addressReplacement = 'Orhanpaşa Meydanı, No: 1, İstanbul';

function shouldProcess(file) {
  return exts.includes(path.extname(file).toLowerCase());
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (shouldProcess(full)) files.push(full);
  }
  return files;
}

function processFile(file) {
  let content = fs.readFileSync(file, 'utf-8');
  let changed = false;

  replacements.forEach(({ from, to }) => {
    if (from.test(content)) {
      content = content.replace(from, to);
      changed = true;
    }
  });

  if (titleRegex.test(content)) {
    content = content.replace(titleRegex, titleReplacement);
    changed = true;
  }

  if (content.includes('@bayrampasa')) {
    content = content.replace(/[\w.-]+@bayrampasa\.bel\.tr/gi, emailReplacement);
    changed = true;
  }

  if (content.match(/Yenidoğan Mahallesi Abdi İpekçi Caddesi No:2 Bayrampaşa \/ İstanbul/gi)) {
    content = content.replace(/Yenidoğan Mahallesi Abdi İpekçi Caddesi No:2 Bayrampaşa \/ İstanbul/gi, addressReplacement);
    changed = true;
  }

  if (changed) fs.writeFileSync(file, content);
}

function main() {
  const files = walk(ROOT);
  files.forEach(processFile);
  console.log(`Rebrand complete. Processed ${files.length} files.`);
}

main();
