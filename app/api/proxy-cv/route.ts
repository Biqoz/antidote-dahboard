import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL invalide' },
        { status: 400 }
      );
    }

    // Télécharger le fichier depuis WordPress
    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Erreur lors du téléchargement: ${response.status}` },
        { status: response.status }
      );
    }

    // Récupérer le contenu du fichier
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Retourner le PDF avec les bons headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': buffer.length.toString(),
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Erreur dans le proxy CV:', error);
    return NextResponse.json(
      { error: 'Erreur lors du téléchargement du CV' },
      { status: 500 }
    );
  }
}
