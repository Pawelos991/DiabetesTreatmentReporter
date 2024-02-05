const fs = require('fs');
const download = require('download');

(async () => {
  const address = process.argv[2];
  const destination = process.argv[3];

  console.log(`Downloading ${address} to ${destination}.`);
  try {
    fs.writeFileSync(destination, await download(address));
    console.log('Success');
  } catch (e) {
    console.warn(`Unable to download ${address}`);
    throw e;
  }
})();
