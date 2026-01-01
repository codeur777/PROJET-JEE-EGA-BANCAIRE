export interface Client {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  statut?: string; // ACTIF | INACTIF
  
  // Champs supplémentaires
  dateNaissance?: Date | string;
  sexe?: string; // HOMME | FEMME
  nationalite?: string;
  ville?: string;
  codePostal?: string;
  typeDocument?: string; // CNI | PASSEPORT | PERMIS | AUTRE
  numeroDocument?: string;
  dateInscription?: Date | string;
}