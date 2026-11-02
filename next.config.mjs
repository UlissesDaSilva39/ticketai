/** @type {import('next').NextConfig} */
const nextConfig = { reactStrictMode: true };

export const gridRedirects = async () => [
  { source: "/home",       destination: "/",          permanent: false },
  { source: "/social",     destination: "/network",   permanent: false },
  { source: "/industry",   destination: "/business",  permanent: false },
  { source: "/shop",       destination: "/business",  permanent: false },
  { source: "/advertise",  destination: "/business",  permanent: false },
  { source: "/royalties",  destination: "/my-grid",   permanent: false },
];

export default nextConfig;

