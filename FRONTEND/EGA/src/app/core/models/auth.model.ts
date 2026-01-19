export interface User {
  id?: number;
  email: string;
  role: string; // 'ADMIN', 'AGENT', 'CLIENT'
  nom?: string;
  prenom?: string;
  clientId?: number;
}

export interface AuthResponse {
  token: string;
  user?: User;
  message?: string;
}

export interface ClientUser extends User {
  clientId: number;
  nom: string;
  prenom: string;
}
