// ── VetAlert Types ──────────────────────────────────────────────────────────

export type UserRole = 'VETERINAIRE' | 'ELEVEUR';

export interface VetUser {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  role: UserRole;
  avatar?: string;
  specialite?: string;   // vétérinaire
  numeroOrdre?: string;  // vétérinaire
  ferme?: string;        // éleveur
  localisation?: string;
  premium: boolean;
  createdAt: string;
}

export type AnimalEspece = 'boeuf' | 'mouton' | 'chevre' | 'cheval' | 'ane' | 'chameau' | 'poule' | 'porc';
export type AnimalSexe = 'male' | 'femelle';
export type EtatSante = 'bonne_sante' | 'malade' | 'en_traitement' | 'surveillance' | 'critique';

export interface Animal {
  id: string;
  numeroId: string;
  nom: string;
  espece: AnimalEspece;
  race: string;
  sexe: AnimalSexe;
  ageAns: number;
  ageMois: number;
  poids: number;
  photo?: string;
  etatSante: EtatSante;
  dateNaissance: string;
  proprietaireId: string;
  proprietaireNom: string;
  veterinaire: string;
  notes?: string;
  createdAt: string;
}

export type TypeRdv = 'vaccination' | 'vermifuge' | 'consultation' | 'insemination' | 'controle_sanitaire' | 'traitement';
export type StatutRdv = 'programme' | 'confirme' | 'termine' | 'annule' | 'urgent';

export interface RendezVous {
  id: string;
  animalId: string;
  animalNom: string;
  animalEspece: AnimalEspece;
  veterinaire: string;
  eleveur: string;
  date: string;
  heure: string;
  type: TypeRdv;
  motif: string;
  statut: StatutRdv;
  lieu?: string;
  notes?: string;
}

export type TypeAlerte = 'vaccin' | 'traitement' | 'rendez_vous' | 'urgence' | 'controle' | 'rappel';
export type PrioriteAlerte = 'normale' | 'haute' | 'urgente';

export interface Alerte {
  id: string;
  type: TypeAlerte;
  titre: string;
  message: string;
  animalId?: string;
  animalNom?: string;
  date: string;
  lue: boolean;
  priorite: PrioriteAlerte;
}

export type TypeDossier = 'maladie' | 'vaccin' | 'traitement' | 'operation' | 'analyse' | 'prescription';

export interface DossierMedical {
  id: string;
  animalId: string;
  animalNom: string;
  animalEspece: AnimalEspece;
  type: TypeDossier;
  titre: string;
  description: string;
  medicaments?: string[];
  dose?: string;
  veterinaire: string;
  date: string;
  prochainControle?: string;
}
