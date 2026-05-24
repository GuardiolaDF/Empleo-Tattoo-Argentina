import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  title: String,
  studioName: String,
  location: String,
  description: String,
  category: String,
  style: String,
  status: String,
  paymentId: String,
}, { strict: false });
const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const studios = [
      { studioName: "Estudio 1", role: "Tatuador/a", specialty: "Realismo", location: "CABA", puesto: "Tatuador/a", experiencia: "Intermedio (1-3 años)", especialidad: "Realismo", tipoEstudio: "Privado", tipoRol: "Residente con porcentaje", ubicacion: "CABA" },
      { studioName: "Estudio 2", role: "Tatuador/a", specialty: "Blackwork", location: "CABA", puesto: "Tatuador/a", experiencia: "Avanzado (3-5 años)", especialidad: "Blackwork", tipoEstudio: "Privado", tipoRol: "Residente con porcentaje", ubicacion: "CABA" },
      { studioName: "Estudio 3", role: "Tatuador/a", specialty: "Dotwork", location: "CABA", puesto: "Tatuador/a", experiencia: "Senior (+5 años)", especialidad: "Dotwork", tipoEstudio: "Privado", tipoRol: "Alquiler de box", ubicacion: "CABA" },
      { studioName: "Estudio 4", role: "Tatuador/a", specialty: "Fineline", location: "CABA", puesto: "Tatuador/a", experiencia: "Intermedio (1-3 años)", especialidad: "Fineline", tipoEstudio: "Privado", tipoRol: "Residente con porcentaje", ubicacion: "CABA" }
    ];

    for (const s of studios) {
      const job = new Job({
        title: s.puesto,
        studioName: s.studioName,
        location: s.ubicacion,
        description: `Horario: Lunes a Viernes | Experiencia: ${s.experiencia} | Tipo de estudio: ${s.tipoEstudio}`,
        category: s.especialidad,
        style: s.tipoRol,
        status: 'active',
        paymentId: 'mock-seed-id'
      });
      await job.save();
      console.log(`Saved ${s.studioName}`);
    }

    console.log('Seed complete.');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
seed();
