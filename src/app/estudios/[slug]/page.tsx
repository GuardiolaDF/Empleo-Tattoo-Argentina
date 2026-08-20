"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, MapPin, Calendar } from "lucide-react";
import { SpecialtyPill } from "@/components/ui/SpecialtyPill";
import { StudioCarousel } from "@/components/ui/StudioCarousel";
import { ContactButtons } from "@/components/ui/ContactButtons";
import { trackEvent } from "@/lib/analytics";
import Link from "next/link";

interface StudioData {
  _id: string;
  userId: string;
  nombre: string;
  anio: string;
  ubicacion: string;
  bio: string;
  instagram: string;
  whatsapp: string;
  website?: string;
  especialidades: string[];
  fotos: string[];
  portada?: string;
}

interface JobData {
  _id: string;
  title: string;
  studioName: string;
  location: string;
  category: string;
  style?: string;
  createdAt: string;
}

export default function PublicStudioProfilePage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;
  const [studio, setStudio] = useState<StudioData | null>(null);
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;

    async function fetchStudio() {
      try {
        const res = await fetch(`/api/studio/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setStudio(data.studio);
          setJobs(data.jobs || []);
          // Track studio view
          if (data.studio?.userId) {
            trackEvent("studio_view", data.studio.userId);
          }
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchStudio();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-body text-muted-foreground">Cargando estudio...</p>
      </div>
    );
  }

  if (error || !studio) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
        <h1 className="text-display-xl mb-4">Estudio no encontrado</h1>
        <p className="text-body-sm text-muted-foreground mb-8">
          El estudio que buscás no existe o fue eliminado.
        </p>
        <button
          onClick={() => router.push("/artistas")}
          className="bg-black text-white px-8 py-4 text-button hover:bg-black/90 transition-colors"
        >
          Ver Ofertas
        </button>
      </div>
    );
  }

  const rawCover = studio.portada || studio.fotos?.[0] || null;
  const [coverUrl, coverHash] = rawCover ? rawCover.split('#pos=') : [null, null];
  const coverPosition = coverHash ? coverHash.replace('_', ' ') : 'center';

  const carouselImages = studio.fotos.map((url, i) => {
    const [cleanUrl, hash] = url.split('#pos=');
    return {
      src: cleanUrl,
      alt: `${studio.nombre} - Trabajo ${i + 1}`,
      position: hash ? hash.replace('_', ' ') : 'center',
    };
  });

  const cleanInstagram = studio.instagram
    ?.replace("@", "")
    .replace("https://instagram.com/", "")
    .replace("https://www.instagram.com/", "") || "";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Cover Image */}
      {coverUrl && (
        <div className="w-full h-[40vh] md:h-[50vh] relative overflow-hidden bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverUrl}
            alt={`Portada de ${studio.nombre}`}
            className="w-full h-full object-cover"
            style={{ objectPosition: coverPosition }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
          {/* Back button on cover */}
          <div className="absolute top-0 left-0 w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
            <button
              onClick={() => {
                if (window.history.length > 2) router.back();
                else router.push('/artistas');
              }}
              className="inline-flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-label-sm">Volver</span>
            </button>
          </div>
          {/* Studio name overlay on cover */}
          <div className="absolute bottom-0 left-0 w-full">
            <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white drop-shadow-lg truncate">
                {studio.nombre.toUpperCase()}
              </h1>
              <p className="text-label-sm text-white/80 mt-2">
                Est. {studio.anio} · {studio.ubicacion}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* If no cover, show simple header */}
      {!coverUrl && (
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12">
          <button
            onClick={() => {
              if (window.history.length > 2) router.back();
              else router.push('/artistas');
            }}
            className="inline-flex items-center space-x-2 text-muted-foreground hover:text-black transition-colors mb-12"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-label-sm">Volver</span>
          </button>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight truncate">{studio.nombre.toUpperCase()}</h1>
          <p className="text-label-sm text-muted-foreground mt-2">
            Est. {studio.anio} · {studio.ubicacion}
          </p>
        </div>
      )}

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 pb-24 space-y-24">
        {/* SECTION: Studio info (2 columns) */}
        <section className="flex flex-col lg:flex-row gap-16 lg:gap-32 pt-16">
          {/* Left Column */}
          <div className="flex-1 space-y-16">
            <div>
              <div className="flex items-center space-x-4 mb-8">
                <span className="text-label-sm text-muted-foreground">
                  Sobre el Estudio
                </span>
                <div className="flex-1 border-t border-border/50"></div>
              </div>
              <p className="text-body leading-loose text-foreground/90">
                {studio.bio}
              </p>
            </div>

            {studio.especialidades?.length > 0 && (
              <div>
                <div className="flex items-center space-x-4 mb-8">
                  <span className="text-label-sm text-muted-foreground">
                    Especialidades
                  </span>
                  <div className="flex-1 border-t border-border/50"></div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {studio.especialidades.map((spec, i) => (
                    <SpecialtyPill
                      key={spec}
                      label={spec}
                      variant={i % 2 === 0 ? "default" : "outline"}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (Sticky) */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="sticky top-12 flex flex-col space-y-12">
              <ContactButtons
                whatsapp={studio.whatsapp}
                instagram={studio.instagram}
                studioUserId={studio.userId}
              />

              <div className="w-full border-t border-border/50"></div>

              <div>
                <span className="text-label-sm text-muted-foreground mb-4 block">
                  Ubicación
                </span>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-body-sm">{studio.ubicacion}</span>
                </div>
                <div className="w-full h-48 bg-gray-100 overflow-hidden border border-border">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    scrolling="no" 
                    marginHeight={0} 
                    marginWidth={0} 
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(studio.ubicacion)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                  ></iframe>
                </div>
              </div>

              {studio.website && (
                <div>
                  <span className="text-label-sm text-muted-foreground mb-4 block">
                    Web
                  </span>
                  <a
                    href={
                      studio.website.startsWith("http")
                        ? studio.website
                        : `https://${studio.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-body-sm underline hover:text-muted-foreground transition-colors"
                  >
                    {studio.website}
                  </a>
                </div>
              )}
            </div>
          </aside>
        </section>

        {/* SECTION: Gallery Carousel */}
        {carouselImages.length > 0 && (
          <section className="bg-muted p-8 md:p-16 lg:p-24 -mx-4 md:-mx-8">
            <div className="flex items-center space-x-4 mb-12 max-w-7xl mx-auto w-full">
              <span className="text-label-sm text-muted-foreground">
                Trabajos del Estudio
              </span>
              <div className="flex-1 border-t border-border/50"></div>
            </div>
            <div className="max-w-7xl mx-auto w-full">
              <StudioCarousel images={carouselImages} />
            </div>
          </section>
        )}

        {/* SECTION: Active Job Listings */}
        {jobs.length > 0 && (
          <section>
            <div className="flex items-center space-x-4 mb-12">
              <span className="text-label-sm text-muted-foreground">
                Ofertas Activas
              </span>
              <div className="flex-1 border-t border-border/50"></div>
            </div>

            <div className="bg-white border border-border">
              {jobs.map((job, i) => (
                <Link
                  key={job._id}
                  href={`/empleos/${job._id}`}
                  className={`block p-8 md:p-12 hover:bg-gray-50 transition-colors ${
                    i < jobs.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="bg-black text-white px-2 py-0.5 text-caption-sm">
                          Activo
                        </span>
                        <span className="text-label-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(job.createdAt).toLocaleDateString("es-AR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <h3 className="text-h3 mb-2">
                        {job.title} — {job.studioName}
                      </h3>
                      <div className="flex items-center gap-4 text-label-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {job.location}
                        </span>
                        {job.category && <span>{job.category}</span>}
                      </div>
                    </div>
                    <span className="text-label-sm text-muted-foreground hover:text-black">
                      Ver Detalle →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
