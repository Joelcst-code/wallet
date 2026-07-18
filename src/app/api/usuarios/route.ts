import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const privyUserId = req.nextUrl.searchParams.get("privyUserId");
  if (!privyUserId) {
    return NextResponse.json({ error: "Falta privyUserId" }, { status: 400 });
  }

  const usuario = await prisma.user.findUnique({ where: { privyUserId } });
  return NextResponse.json({ usuario });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { privyUserId, telefono, direccionSolana, nombre, cedula } = body;

  if (!privyUserId || !telefono || !direccionSolana) {
    return NextResponse.json(
      { error: "Faltan datos obligatorios" },
      { status: 400 }
    );
  }

  const usuario = await prisma.user.upsert({
    where: { privyUserId },
    update: { nombre, cedula },
    create: { privyUserId, telefono, direccionSolana, nombre, cedula },
  });

  return NextResponse.json({ usuario });
}
