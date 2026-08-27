const clean = (value: number) => String(value).padStart(6, "0");

export function memberIdentifier(sequence: number, year = new Date().getUTCFullYear()) {
  if (!Number.isSafeInteger(sequence) || sequence < 1) throw new Error("Séquence membre invalide");
  return `TCK-${year}-${clean(sequence)}`;
}

export function receiptIdentifier(sequence: number, date = new Date()) {
  if (!Number.isSafeInteger(sequence) || sequence < 1) throw new Error("Séquence reçu invalide");
  const day = date.toISOString().slice(0, 10).replaceAll("-", "");
  return `TCK-R-${day}-${clean(sequence)}`;
}
