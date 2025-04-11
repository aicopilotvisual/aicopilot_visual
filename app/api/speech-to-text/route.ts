// app/api/speech-to-text/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Convert the File to a buffer
    const buffer = Buffer.from(await audioFile.arrayBuffer());
    
    // Create a Blob from the buffer
    const blob = new Blob([buffer], { type: audioFile.type });
    
    // Create a File object from the Blob
    const file = new File([blob], audioFile.name, { 
      type: audioFile.type 
    });
    
    // Transcribe the audio using OpenAI's API
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
    });

    return NextResponse.json({ 
      text: transcription.text
    });
  } catch (error) {
    console.error('Error transcribing audio:', error);
    return NextResponse.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 }
    );
  }
}