import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/auth', '/checkout', '/publicar-empleo'],
    },
    sitemap: 'https://empleotattoo.com.ar/sitemap.xml',
  };
}
