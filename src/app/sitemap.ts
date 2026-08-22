import { MetadataRoute } from 'next';
import connectToDatabase from '@/lib/mongodb';
import Job from '@/models/Job';
import Studio from '@/models/Studio';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://empleotattoo.com.ar';

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/empleos`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/estudios`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/artistas`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guia-del-artista`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  let dynamicJobs: MetadataRoute.Sitemap = [];
  let dynamicStudios: MetadataRoute.Sitemap = [];

  try {
    await connectToDatabase();
    
    const jobs = await Job.find({ status: 'active' }).select('_id updatedAt').lean();
    dynamicJobs = jobs.map((j: any) => ({
      url: `${baseUrl}/empleos/${j._id}`,
      lastModified: j.updatedAt ? new Date(j.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    const studios = await Studio.find({ status: 'active' }).select('_id updatedAt').lean();
    dynamicStudios = studios.map((s: any) => ({
      url: `${baseUrl}/estudios/${s._id}`,
      lastModified: s.updatedAt ? new Date(s.updatedAt) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error);
  }

  return [...staticEntries, ...dynamicJobs, ...dynamicStudios];
}

