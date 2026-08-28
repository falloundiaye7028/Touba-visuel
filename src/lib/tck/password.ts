import { z } from "zod";

export const tckPasswordSchema = z.string()
  .min(12, "Le mot de passe doit contenir au moins 12 caractères")
  .max(200, "Le mot de passe est trop long")
  .regex(/[a-z]/, "Ajoutez au moins une lettre minuscule")
  .regex(/[A-Z]/, "Ajoutez au moins une lettre majuscule")
  .regex(/[0-9]/, "Ajoutez au moins un chiffre")
  .regex(/[^A-Za-z0-9]/, "Ajoutez au moins un caractère spécial");
