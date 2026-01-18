export interface Transaction {
  id?: number;
  type: string; // DEPOT | RETRAIT | VIREMENT
  montant: number;
  dateTransaction?: Date | string;
  compteId: number;
  compteSourceId?: number;
  compteDestinationId?: number;
  typeTransaction?: string; // Pour correspondre au backend
  compteDestinataire?: any; // Pour les virements
}
