import { Metadata, ResolvingMetadata } from 'next';
import connectToDatabase from '@/lib/mongodb';
import Job from '@/models/Job';
import Studio from '@/models/Studio';

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    await connectToDatabase();
    // Replicating the fetch logic from the API to get job details
    let job = null;
    let studio = null;
    
    // Slug might be an ID or a string slug. The API checks by ID first.
    if (slug.length === 24) {
      job = await Job.findById(slug).lean();
    }
    
    if (job) {
      if (job.userId) {
        studio = await Studio.findOne({ userId: job.userId }).lean();
      }
      
      const title = `${job.title} en ${job.category} | ${studio?.nombre || job.studioName}`;
      const description = `Buscamos un ${job.title.toLowerCase()} especializado en ${job.category} para unirse a nuestro estudio ubicado en ${job.location}. Postúlate en Empleo Tattoo Argentina.`;
      const url = `https://empleotattoo.com.ar/empleos/${slug}`;
      const imageUrl = studio?.portada || '/og-image.png';

      return {
        title,
        description,
        openGraph: {
          title,
          description,
          url,
          siteName: "Empleo Tattoo Argentina",
          images: [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: title,
            },
          ],
          locale: "es_AR",
          type: "website",
        },
        twitter: {
          card: "summary_large_image",
          title,
          description,
          images: [imageUrl],
        },
      };
    }
  } catch (error) {
    console.error("Error generating metadata for job:", error);
  }

  // Fallback if not found or error
  return {
    title: 'Aviso de Empleo | Empleo Tattoo Argentina',
    description: 'Encuentra las mejores oportunidades laborales en la industria del tatuaje.',
  };
}

export default function JobLayout({ children }: Props) {
  return <>{children}</>;
}
