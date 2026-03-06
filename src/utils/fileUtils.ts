export function base64ToBlobUrl(base64Data: string, mimeType: string): string | null {
  try {
    // Remove data URL prefix if present
    const base64 = base64Data.split(',')[1] || base64Data;
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: mimeType });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Erreur lors de la conversion Base64 en Blob URL:', error);
    return null;
  }
}
