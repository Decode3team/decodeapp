import { 
    pgTable, 
    varchar,
    json
} from "drizzle-orm/pg-core";

export const discoveryData = pgTable("discovery-data", {
    token_address: varchar("token_address").primaryKey().unique(),
    chain_id: varchar("chain_id_hex"),
    token_name: varchar("token_name"),
    token_data: json("token_data")
});