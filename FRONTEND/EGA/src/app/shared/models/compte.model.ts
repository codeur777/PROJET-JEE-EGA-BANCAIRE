export interface Compte {
  id?: number;
  numeroCompte: string;
  solde: number;
  type: string; // COURANT | EPARGNE
  statut: string; // OUVERT | BLOQUE | FERME
  clientId: number;
}
