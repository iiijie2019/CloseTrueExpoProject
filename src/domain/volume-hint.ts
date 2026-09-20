export function shouldHintLowVolume(volume: number | null, lastHint: number | null, now: number) {
  return volume !== null && Number.isFinite(volume) && volume >= 0 && volume < 0.2 && (lastHint === null || now - lastHint >= 60_000);
}
