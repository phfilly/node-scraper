const scraper = require('./scraper');
const db = require('./save');

console.log('Starting scraper...');

async function start() {
  db.init();
  const response = await Promise.all([
    scraper.getFNBLaptops(),
    scraper.getWootWareProducts('limit=100&price=14500-16500'),
    scraper.getIncredibleConnectionProducts('15000-20000'),
    scraper.getIncredibleConnectionProduct('msi-ge73-i7-8750h-16gb-256gb-1tb-gtx1060-gaming-notebook'),
    scraper.getEveTechProduct('dell-inspiron-g5-15-5587-core-i5-gtx-1060-gaming-laptop-deal/laptops-for-sale/8661.aspx')
  ])

  response.forEach(async (package) => {
    console.log(`Saving: ${package.length} products | ${package[0]['vendor']}`);
    await db.saveToFireStore(package);
    console.log('Done...');
  });
  // db.saveToFireStore({});
  // console.log('response', response[0]);
  // db.saveToFireStore(response[0]);
  // db.saveToFireStore(response[1]);
  // db.saveToFireStore(response[2]);
};

start();

