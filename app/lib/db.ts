import postgres from "postgres";


const globalForDb =
  globalThis as unknown as {
    sql?: ReturnType<
      typeof postgres
    >;
  };

export const sql =
  globalForDb.sql ??
  postgres(
    process.env.POSTGRES_URL!,
    {
      ssl: "require",
      prepare: false, // Desactiva la caché de sentencias preparadas: ver archivo problema#1_db donde esta la explicacion
      /*debug: (connection, query, parameters) => {
        console.log("=============================================");
        console.log("🚀 SQL ENVIADO A POSTGRES:");
        console.log(query);
        console.log("📦 PARAMETROS REALES:", parameters);
        console.log("=============================================");
      }*/
    }
  );

if (
  process.env.NODE_ENV !==
  "production"
) {
  globalForDb.sql =
    sql;
}