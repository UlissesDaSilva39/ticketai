import { fetchRssFeed } from './lib/ingestion/sources/rss';
fetchRssFeed('https://www.nme.com/feed', 'NME').then(items => {
  console.log('Count:', items.length);
  const title = items[0].title;
  console.log('Title:', title);
  console.log('Hex:', Buffer.from(title, 'utf8').toString('hex').slice(0, 60));
});