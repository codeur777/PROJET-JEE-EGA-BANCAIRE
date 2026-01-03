export interface CompteCreateDTO {
  numeroCompte: string;
  typeCompte: string;
  solde: number;
  clientId?: number | null;
}
