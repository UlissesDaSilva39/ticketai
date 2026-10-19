import PromotersClient from './PromotersClient';

export const metadata = {
  title: 'Discover Promoters | GRID',
  description: "Browse every promoter on GRID. Filter by city and discover who's actively booking artists and running events.",
};

export default function PromotersPage() {
  return <PromotersClient />;
}
