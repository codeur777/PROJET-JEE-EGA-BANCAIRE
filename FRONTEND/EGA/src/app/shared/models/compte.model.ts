export interface Compte {
  id?: number;
  numeroCompte: string;
  solde: number;
  typeCompte: string; // COURANT | EPARGNE
  statut: string; // OUVERT | BLOQUE | FERME
  clientId?: number | null ;
  dateCreation?: Date | string;
  // createdAt?: string | Date;

  // Informations du client (incluses dans les réponses API)
  clientNom?: string;
  clientPrenom?: string;
  clientEmail?: string;

  // Pour compatibilité avec l'ancien format
  client?: {
    id?: number;
    nom: string;
    prenom: string;
    email: string;
  };
}