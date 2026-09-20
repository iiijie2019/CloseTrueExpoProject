// Browsers do not expose the device's media output volume.
export async function getOutputVolume(): Promise<number | null> { return null; }
