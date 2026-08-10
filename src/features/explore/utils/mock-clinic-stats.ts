const hashSeed = (id: string) => {
  let hash = 0;

  for (let index = 0; index < id.length; index += 1) {
    hash = (hash * 31 + id.charCodeAt(index)) % 997;
  }

  return hash;
};

// Placeholder metrics until the backend exposes a real per-unit queue summary.
export const getMockClinicStats = (healthUnitId: string) => {
  const seed = hashSeed(healthUnitId);

  return {
    waitMinutes: 5 + (seed % 26),
    activeQueueSize: 2 + (seed % 18),
  };
};
