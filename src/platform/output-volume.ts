import { requireOptionalNativeModule } from 'expo';

const volume = requireOptionalNativeModule<{ getOutputVolume(): Promise<number | null> }>('GroveVolume');

export async function getOutputVolume(): Promise<number | null> {
  try { return await volume?.getOutputVolume() ?? null; }
  catch { return null; } // Old binaries and Expo Go can still pronounce words.
}
