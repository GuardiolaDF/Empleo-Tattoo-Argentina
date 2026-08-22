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
    let job = null;
    let studio = null;
    
    let targetId = slug;
    if (slug.length > 24) {
      const match = slug.match(/([a-fA-F0-9]{24})$/);
      if (match) targetId = match[1];
    }
    
    if (targetId.length === 24) {
      job = await Job.findById(targetId).lean();
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
        alternates: {
          canonical: url,
        },
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

  return {
    title: 'Aviso no encontrado | Empleo Tattoo Argentina',
    description: 'El aviso de empleo buscado no existe o ha expirado.',
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function JobLayout({ children }: Props) {
  return <>{children}</>;
}
