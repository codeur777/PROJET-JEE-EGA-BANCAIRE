export interface Transaction {
  id?: number;
  type: string; // DEPOT | RETRAIT | VIREMENT
  montant: number;
  dateOperation?: Date;
  compteId: number;
  compteSourceId?: number;
  compteDestinationId?: number;
}
