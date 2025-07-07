import dotenv from 'dotenv';

dotenv.config();

export const config = {
  server: {
    port: parseInt(process.env.PORT || '3333')
  },
  // database: {
  //   host: process.env.DB_HOST || 'localhost',
  //   port: parseInt(process.env.DB_PORT || '3306'),
  //   user: process.env.DB_USER || 'root',
  //   password: process.env.DB_PASSWORD || '2811',
  //   name: process.env.DB_NAME || 'projeto_pi'
  // },
  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
    serviceKey: process.env.SUPABASE_SERVICE_KEY || ''
  },
  jwt: {
    secret: process.env.JWT_SECRET || '',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  }
}; 