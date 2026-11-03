export interface AccountInfo{
    id:number;
    email:string;
}

export interface AccountCredentials {
  id: number;
  email: string;
  passwordHash: string;
  accountType: number;
  isActive: boolean;
}