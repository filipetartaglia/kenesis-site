import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

const BUCKET = "properties";
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = formData.get("folder") as string | null; // ex: "mansao-jardim-uba"

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Arquivo excede 10MB." }, { status: 400 });
    }

    const allowedTypes = ["image/webp", "image/jpeg", "image/png", "image/avif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Formato não suportado. Use WEBP, JPG, PNG ou AVIF." },
        { status: 400 }
      );
    }

    // Gerar um path único dentro do bucket
    const ext = file.name.split(".").pop() || "webp";
    const timestamp = Date.now();
    const safeName = `${timestamp}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const storagePath = folder ? `${folder}/${safeName}` : safeName;

    const supabase = createAdminClient();

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase Storage error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Gerar URL pública
    const { data: publicUrl } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(data.path);

    return NextResponse.json({
      path: data.path,        // Caminho relativo (para salvar no banco)
      url: publicUrl.publicUrl // URL pública completa (para preview)
    });
  } catch (e: any) {
    console.error("Upload error:", e);
    return NextResponse.json({ error: "Erro interno no upload." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { path } = await request.json();
    if (!path) {
      return NextResponse.json({ error: "Caminho não informado." }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase.storage.from(BUCKET).remove([path]);

    if (error) {
      console.error("Supabase Storage delete error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("Delete error:", e);
    return NextResponse.json({ error: "Erro interno ao deletar." }, { status: 500 });
  }
}
