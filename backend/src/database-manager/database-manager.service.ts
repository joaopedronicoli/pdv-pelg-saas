import { Injectable } from '@nestjs/common';
import { createConnection, Connection } from 'mysql2/promise';
import { Client } from 'pg';
import * as CryptoJS from 'crypto-js';

export interface DatabaseConfig {
    dbType: 'mysql' | 'postgres';
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
}

export interface TestConnectionResult {
    success: boolean;
    message: string;
}

export interface SetupDatabaseResult {
    success: boolean;
    message: string;
    encryptedPassword?: string;
}

@Injectable()
export class DatabaseManagerService {
    private readonly encryptionKey: string;

    constructor() {
        this.encryptionKey = process.env.ENCRYPTION_KEY || 'default-key-change-in-production-32';
    }

    /**
     * Encrypt sensitive data
     */
    encrypt(text: string): string {
        return CryptoJS.AES.encrypt(text, this.encryptionKey).toString();
    }

    /**
     * Decrypt sensitive data
     */
    decrypt(encryptedText: string): string {
        const bytes = CryptoJS.AES.decrypt(encryptedText, this.encryptionKey);
        return bytes.toString(CryptoJS.enc.Utf8);
    }

    /**
     * Test database connection
     */
    async testConnection(config: DatabaseConfig): Promise<TestConnectionResult> {
        try {
            if (config.dbType === 'mysql') {
                return await this.testMySQLConnection(config);
            } else {
                return await this.testPostgreSQLConnection(config);
            }
        } catch (error) {
            return {
                success: false,
                message: `Erro ao testar conexão: ${error.message}`,
            };
        }
    }

    /**
     * Test MySQL connection
     */
    private async testMySQLConnection(config: DatabaseConfig): Promise<TestConnectionResult> {
        let connection: Connection;

        try {
            // Try to connect without database first
            connection = await createConnection({
                host: config.host,
                port: config.port,
                user: config.username,
                password: config.password,
            });

            await connection.ping();
            await connection.end();

            return {
                success: true,
                message: 'Conexão MySQL testada com sucesso!',
            };
        } catch (error) {
            return {
                success: false,
                message: `Erro ao conectar no MySQL: ${error.message}`,
            };
        }
    }

    /**
     * Test PostgreSQL connection
     */
    private async testPostgreSQLConnection(config: DatabaseConfig): Promise<TestConnectionResult> {
        const client = new Client({
            host: config.host,
            port: config.port,
            user: config.username,
            password: config.password,
            database: 'postgres', // Connect to default database
        });

        try {
            await client.connect();
            await client.query('SELECT 1');
            await client.end();

            return {
                success: true,
                message: 'Conexão PostgreSQL testada com sucesso!',
            };
        } catch (error) {
            return {
                success: false,
                message: `Erro ao conectar no PostgreSQL: ${error.message}`,
            };
        }
    }

    /**
     * Setup database (create if not exists and run migrations)
     */
    async setupDatabase(config: DatabaseConfig): Promise<SetupDatabaseResult> {
        try {
            if (config.dbType === 'mysql') {
                return await this.setupMySQL(config);
            } else {
                return await this.setupPostgreSQL(config);
            }
        } catch (error) {
            return {
                success: false,
                message: `Erro ao configurar banco de dados: ${error.message}`,
            };
        }
    }

    /**
     * Setup MySQL database
     */
    private async setupMySQL(config: DatabaseConfig): Promise<SetupDatabaseResult> {
        let connection: Connection | null = null;

        try {
            // Connect without database
            connection = await createConnection({
                host: config.host,
                port: config.port,
                user: config.username,
                password: config.password,
            });

            // Create database if not exists
            await connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
            await connection.end();

            // Connect to the new database
            connection = await createConnection({
                host: config.host,
                port: config.port,
                user: config.username,
                password: config.password,
                database: config.database,
            });

            // Create tables
            await this.createTables(connection, 'mysql');
            await connection.end();

            return {
                success: true,
                message: 'Banco de dados MySQL criado e configurado com sucesso!',
                encryptedPassword: this.encrypt(config.password),
            };
        } catch (error) {
            if (connection) {
                await connection.end();
            }
            return {
                success: false,
                message: `Erro ao configurar MySQL: ${error.message}`,
            };
        }
    }

    /**
     * Setup PostgreSQL database
     */
    private async setupPostgreSQL(config: DatabaseConfig): Promise<SetupDatabaseResult> {
        let client: Client | null = null;

        try {
            // Connect to default database
            client = new Client({
                host: config.host,
                port: config.port,
                user: config.username,
                password: config.password,
                database: 'postgres',
            });

            await client.connect();

            // Check if database exists
            const result = await client.query(
                `SELECT 1 FROM pg_database WHERE datname = $1`,
                [config.database]
            );

            if (result.rows.length === 0) {
                // Create database
                await client.query(`CREATE DATABASE "${config.database}"`);
            }

            await client.end();

            // Connect to the new database
            client = new Client({
                host: config.host,
                port: config.port,
                user: config.username,
                password: config.password,
                database: config.database,
            });

            await client.connect();

            // Create tables
            await this.createTablesPostgreSQL(client);
            await client.end();

            return {
                success: true,
                message: 'Banco de dados PostgreSQL criado e configurado com sucesso!',
                encryptedPassword: this.encrypt(config.password),
            };
        } catch (error) {
            if (client) {
                await client.end();
            }
            return {
                success: false,
                message: `Erro ao configurar PostgreSQL: ${error.message}`,
            };
        }
    }

    /**
     * Create tables for MySQL
     */
    private async createTables(connection: Connection, dbType: 'mysql'): Promise<void> {
        const tables = `
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),
        role ENUM('admin', 'cashier', 'stockist', 'attendant') DEFAULT 'cashier',
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS customers (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(50),
        cpf_cnpj VARCHAR(20),
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        sku VARCHAR(100) UNIQUE,
        barcode VARCHAR(100),
        price DECIMAL(10, 2) NOT NULL,
        cost DECIMAL(10, 2),
        stock INT DEFAULT 0,
        min_stock INT DEFAULT 0,
        active BOOLEAN DEFAULT TRUE,
        woocommerce_id VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS sales (
        id VARCHAR(36) PRIMARY KEY,
        customer_id VARCHAR(36),
        user_id VARCHAR(36),
        total DECIMAL(10, 2) NOT NULL,
        discount DECIMAL(10, 2) DEFAULT 0,
        payment_method ENUM('cash', 'credit', 'debit', 'pix') NOT NULL,
        status ENUM('pending', 'completed', 'cancelled') DEFAULT 'completed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS sale_items (
        id VARCHAR(36) PRIMARY KEY,
        sale_id VARCHAR(36) NOT NULL,
        product_id VARCHAR(36) NOT NULL,
        quantity INT NOT NULL,
        unit_price DECIMAL(10, 2) NOT NULL,
        subtotal DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id)
      );
    `;

        const statements = tables.split(';').filter(s => s.trim());
        for (const statement of statements) {
            if (statement.trim()) {
                await connection.query(statement);
            }
        }
    }

    /**
     * Create tables for PostgreSQL
     */
    private async createTablesPostgreSQL(client: Client): Promise<void> {
        const tables = `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),
        role VARCHAR(50) DEFAULT 'cashier',
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS customers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(50),
        cpf_cnpj VARCHAR(20),
        address TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        sku VARCHAR(100) UNIQUE,
        barcode VARCHAR(100),
        price DECIMAL(10, 2) NOT NULL,
        cost DECIMAL(10, 2),
        stock INT DEFAULT 0,
        min_stock INT DEFAULT 0,
        active BOOLEAN DEFAULT TRUE,
        woocommerce_id VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS sales (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        customer_id UUID,
        user_id UUID,
        total DECIMAL(10, 2) NOT NULL,
        discount DECIMAL(10, 2) DEFAULT 0,
        payment_method VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'completed',
        created_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (customer_id) REFERENCES customers(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS sale_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sale_id UUID NOT NULL,
        product_id UUID NOT NULL,
        quantity INT NOT NULL,
        unit_price DECIMAL(10, 2) NOT NULL,
        subtotal DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id)
      );
    `;

        const statements = tables.split(';').filter(s => s.trim());
        for (const statement of statements) {
            if (statement.trim()) {
                await client.query(statement);
            }
        }
    }
}
