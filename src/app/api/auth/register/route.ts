import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongoClient';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Faltan campos obligatorios' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(); // Usa la BD por defecto de la conexión

    // Verificar si el usuario ya existe
    const existingUser = await db.collection('users').findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: 'El correo electrónico ya está registrado' },
        { status: 409 }
      );
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear el usuario con el esquema que usa NextAuth
    const result = await db.collection('users').insertOne({
      name,
      email,
      password: hashedPassword,
      image: null,
      emailVerified: null,
    });

    return NextResponse.json(
      { message: 'Usuario registrado con éxito', userId: result.insertedId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error al registrar usuario:', error);
    return NextResponse.json(
      { message: 'Ocurrió un error en el servidor', error: error.message },
      { status: 500 }
    );
  }
}
