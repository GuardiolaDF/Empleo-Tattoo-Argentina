import { Metadata, ResolvingMetadata } from 'next';
import connectToDatabase from '@/lib/mongodb';
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
    
    // El slug suele ser el ID del estudio
    if (slug.length === 24) {
      const studio = await Studio.findById(slug).lean();
      
      if (studio) {
        const title = `${studio.nombre} | Estudio de Tatuajes en ${studio.ubicacion}`;
        const description = studio.bio || `Descubre el perfil de ${studio.nombre}, ubicado en ${studio.ubicacion}. Explora sus trabajos y ofertas laborales en Empleo Tattoo Argentina.`;
        const url = `https://empleotattoo.com.ar/estudios/${slug}`;
        const imageUrl = studio.portada || '/og-image.jpg';

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
    }
  } catch (error) {
    console.error("Error generating metadata for studio:", error);
  }

  // Fallback if not found or error
  return {
    title: 'Estudio de Tatuajes | Empleo Tattoo Argentina',
    description: 'Directorio de los mejores estudios de tatuajes en Argentina.',
  };
}

export default function StudioLayout({ children }: Props) {
  return <>{children}</>;
}
