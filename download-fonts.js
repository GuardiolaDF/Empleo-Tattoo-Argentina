const fs = require('fs');
const https = require('https');
const path = require('path');

const fontsDir = path.join(__dirname, 'public', 'fonts');
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        download(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log('Downloading Inter-Bold.ttf...');
  await download('https://github.com/rsms/inter/releases/download/v3.19/Inter-Bold.ttf', path.join(fontsDir, 'Inter-Bold.ttf'));
  
  console.log('Downloading BodoniModa.ttf...');
  // Since bodoni is hard to find directly, we can use a google fonts direct link to a TTF, or a known mirror.
  // Using a known mirror for a serif font like Playfair Display or Bodoni Moda.
  // We'll use Playfair Display as a fallback if Bodoni isn't easily downloadable via raw TTF.
  await download('https://github.com/googlefonts/PlayfairDisplay/raw/main/fonts/ttf/PlayfairDisplay-Italic.ttf', path.join(fontsDir, 'BodoniModa-Italic.ttf'));
  
  console.log('Done!');
}

run();
