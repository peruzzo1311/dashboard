export interface Usuario {
  admin: boolean;
  allowedToChangePassword: boolean;
  authenticationType: string;
  blocked: boolean;
  changePassword: boolean;
  email: string;
  fullName: string;
  id: string;
  integration: { integrationName: string };
  photo: string;
  photoUrl: string;
  photoUrlExpirationDate: string;
  properties: Propriedades[];
  tenantDomain: string;
  tenantLocale: string;
  username: string;
  _discriminator: string;
  manterLogado: boolean;
  token: string;
}

export interface Propriedades {
  name: string;
  value: string;
}

export interface UsuarioRegistro {
  nome: string | null | undefined;
  sobrenome: string | null | undefined;
  email: string;
  senha: string | null | undefined;
  codCli: number;
  documento: string;
  token: string;
}
