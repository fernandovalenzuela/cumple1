import bcrypt from "bcryptjs";
import { AccountRepository } from "./AccountRepository";
import { AccountType } from "@/lib/constants";
import { createSession, SessionType,} from "@/lib/auth/session";

export type AccountAuthResult =
  | {success: true; accountType: AccountType;}
  | {success: false;message: string;};

export class AccountAuthService {
  private repository: AccountRepository;
  constructor() {
    this.repository = new AccountRepository();
  }

  async authenticate(
    email: string,
    password: string
  ): Promise<AccountAuthResult> {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      return {success: false,message: "Email o contraseña incorrectos.", };
    }

    const account = await this.repository.findCredentialsByEmail(normalizedEmail);

    // No revelar si el email existe o no.
    if (!account || !account.passwordHash) {
      return {success: false, message: "Email o contraseña incorrectos.",};
    }

    const passwordIsValid = await bcrypt.compare(password, account.passwordHash);

    if (!passwordIsValid) {
      return {success: false, message: "Email o contraseña incorrectos.", };
    }

    if (!account.isActive) {
      return { success: false,message: "La cuenta se encuentra deshabilitada.", };
    }
    const accountTypeMap: Record<string, AccountType> = {
        organizer: AccountType.Organizer,
        partner: AccountType.Partner,
        webmaster: AccountType.Webmaster,
    };

    const accountType =
    accountTypeMap[String(account.accountType)];

    if (accountType === undefined) {
    console.error("Tipo de cuenta desconocido:", account.accountType );

    return {
        success: false,
        message: "Tipo de cuenta inválido.",
    };
    }

    await createSession({
      type: SessionType.Account,
      accountId: account.id,
      accountType,
    });

    return { success: true, accountType, };
  }
}