/**
 * getMediaMimeType
 * Detects the most stable audio MIME type for the current browser.
 * Fixes Safari iOS PWA recording issues by falling back to audio/mp4.
 */
export function getSupportedAudioMimeType(): string {
    if (typeof MediaRecorder === 'undefined') return 'audio/wav';

    const types = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/aac',
        'audio/wav'
    ];

    for (const type of types) {
        if (MediaRecorder.isTypeSupported(type)) {
            return type;
        }
    }

    return 'audio/mp4'; // Default safe fallback for Safari
}

export async function createSafeMediaRecorder(stream: MediaStream): Promise<MediaRecorder> {
    const mimeType = getSupportedAudioMimeType();
    return new MediaRecorder(stream, { mimeType });
}
