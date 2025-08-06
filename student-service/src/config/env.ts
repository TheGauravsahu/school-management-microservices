import "dotenv/config";

const { 
    PORT, 
    DB_URL 
} = process.env;

export const env = {
  PORT,
  DB_URL,
};
