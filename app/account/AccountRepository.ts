import { sql } from "@/lib/db";
import { AccountInfo,AccountCredentials  } from "./dto/accountDTOs";

export class AccountRepository{

    async findById(accountId:number):Promise<AccountInfo|null>{

        const rows=await sql<AccountInfo[]>`
            SELECT
                id,
                email
            FROM "birthdayAccounts"
            WHERE id=${accountId}
        `;

        if(rows.length===0){
            return null;
        }

        return{
            id:rows[0].id,
            email:rows[0].email,
        };

    }

    async updateEmail(accountId:number,email:string):Promise<void>{

        await sql`
            UPDATE "birthdayAccounts"
            SET
                email=${email},
                updated_at=NOW()
            WHERE id=${accountId}
        `;

    }

    async findCredentialsByEmail( email: string ): Promise<AccountCredentials | null> {
        const rows = await sql<AccountCredentials[]>`
            SELECT
            id,email,"passwordHash","accountType","isActive"
            FROM "birthdayAccounts"
            WHERE lower(email) = ${email.trim().toLowerCase()}
            LIMIT 1
        `;
        if (rows.length === 0) {
            return null;
        }
        return rows[0];
    }

}