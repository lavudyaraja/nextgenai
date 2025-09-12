import { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Song ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    // This is a MOCK implementation for demonstration purposes only
    // In a real application, this would return an actual audio file stream
    // For demo purposes, we return a short silent WAV file to demonstrate the UI
    
    // Create a proper WAV file with 1 second of silence
    const sampleRate = 8000;
    const duration = 1; // 1 second
    const numSamples = sampleRate * duration;
    
    // WAV Header (44 bytes)
    const wavHeader = new Uint8Array(44);
    
    // RIFF identifier
    wavHeader.set([0x52, 0x49, 0x46, 0x46], 0); // "RIFF"
    
    // File size (36 + data size)
    const fileSize = 36 + numSamples;
    wavHeader.set([fileSize & 0xFF, (fileSize >> 8) & 0xFF, (fileSize >> 16) & 0xFF, (fileSize >> 24) & 0xFF], 4);
    
    // WAVE identifier
    wavHeader.set([0x57, 0x41, 0x56, 0x45], 8); // "WAVE"
    
    // Format chunk identifier
    wavHeader.set([0x66, 0x6d, 0x74, 0x20], 12); // "fmt "
    
    // Format chunk size
    wavHeader.set([16, 0, 0, 0], 16); // 16 bytes
    
    // Audio format (1 = PCM)
    wavHeader.set([1, 0], 20);
    
    // Number of channels (1 = mono)
    wavHeader.set([1, 0], 22);
    
    // Sample rate
    wavHeader.set([sampleRate & 0xFF, (sampleRate >> 8) & 0xFF, (sampleRate >> 16) & 0xFF, (sampleRate >> 24) & 0xFF], 24);
    
    // Byte rate (sample rate * channels * bits per sample / 8)
    const byteRate = sampleRate * 1 * 1; // 1 channel, 8 bits
    wavHeader.set([byteRate & 0xFF, (byteRate >> 8) & 0xFF, (byteRate >> 16) & 0xFF, (byteRate >> 24) & 0xFF], 28);
    
    // Block align (channels * bits per sample / 8)
    wavHeader.set([1, 0], 32); // 1 channel, 8 bits
    
    // Bits per sample
    wavHeader.set([8, 0], 34); // 8 bits
    
    // Data chunk identifier
    wavHeader.set([0x64, 0x61, 0x74, 0x61], 36); // "data"
    
    // Data chunk size
    wavHeader.set([numSamples & 0xFF, (numSamples >> 8) & 0xFF, (numSamples >> 16) & 0xFF, (numSamples >> 24) & 0xFF], 40);
    
    // Create silent audio data
    const audioData = new Uint8Array(numSamples);
    // Fill with silence (128 for 8-bit unsigned PCM)
    audioData.fill(128);
    
    // Combine header and audio data
    const wavFile = new Uint8Array(wavHeader.length + audioData.length);
    wavFile.set(wavHeader, 0);
    wavFile.set(audioData, wavHeader.length);
    
    return new Response(
      Buffer.from(wavFile),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'audio/wav',
          'Content-Disposition': 'inline; filename="demo-preview.wav"'
        } 
      }
    )
  } catch (error) {
    console.error('Error serving song preview:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to serve song preview' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}