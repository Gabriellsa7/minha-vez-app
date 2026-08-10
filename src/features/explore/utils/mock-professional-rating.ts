const hashSeed = (id: string) => {
  let hash = 0;

  for (let index = 0; index < id.length; index += 1) {
    hash = (hash * 31 + id.charCodeAt(index)) % 997;
  }

  return hash;
};

// Placeholder rating until the backend exposes real patient reviews.
export const getMockProfessionalRating = (professionalId: string) => {
  const seed = hashSeed(professionalId);

  return Number((4 + (seed % 10) / 10).toFixed(1));
};
