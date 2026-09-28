import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import connectToDatabase from '@/lib/mongodb';
import Convention from '@/models/Convention';
import ConventionEditForm from './ConventionEditForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function EditarConvencionPage({ params }: { params: { slug: string } }) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/api/auth/signin');
  }

  await connectToDatabase();
  const convention = await Convention.findById(params.slug).lean();

  if (!convention) {
    notFound();
  }

  // Allow only the owner or an admin
  if (convention.userId !== session.user.id && session.user.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Acceso Denegado</h1>
        <p className="text-neutral-400 mb-8">No tienes permiso para editar esta convención.</p>
        <Link href="/dashboard?tab=convenciones" className="text-primary hover:underline">
          Volver al dashboard
        </Link>
      </div>
    );
  }

  // Need to convert ObjectIds and Dates to string/plain for Client Components
  const serializedConvention = {
    ...convention,
    _id: convention._id.toString(),
    startDate: convention.startDate.toISOString(),
    endDate: convention.endDate.toISOString(),
    createdAt: convention.createdAt.toISOString(),
    updatedAt: convention.updatedAt.toISOString(),
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link href="/dashboard?tab=convenciones" className="inline-flex items-center gap-2 text-neutral-400 hover:text-primary transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        <span>Volver al dashboard</span>
      </Link>

      <ConventionEditForm convention={serializedConvention} />
    </div>
  );
}
