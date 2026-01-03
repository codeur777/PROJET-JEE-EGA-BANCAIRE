export interface Compte {
  id?: number;
  numeroCompte: string;
  solde: number;
  typeCompte: string; // COURANT | EPARGNE
  statut: string; // OUVERT | BLOQUE | FERME
  clientId?: number | null ;
  dateCreation?: Date | string;
  // createdAt?: string | Date;
  
  // Relation avec le client (peut être chargé par le backend)
  client?: {
    id?: number;
    nom: string;
    prenom: string;
    email: string;
  };
}