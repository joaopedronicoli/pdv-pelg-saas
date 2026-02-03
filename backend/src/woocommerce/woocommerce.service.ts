import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import * as CryptoJS from 'crypto-js';

export interface WooCommerceConfig {
    storeUrl: string;
    consumerKey: string;
    consumerSecret: string;
}

export interface TestWooCommerceResult {
    success: boolean;
    message: string;
    storeName?: string;
}

export interface SetupWooCommerceResult {
    success: boolean;
    message: string;
    encryptedKey?: string;
    encryptedSecret?: string;
}

@Injectable()
export class WoocommerceService {
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
     * Create WooCommerce API client
     */
    private createClient(config: WooCommerceConfig): AxiosInstance {
        const baseURL = config.storeUrl.endsWith('/')
            ? config.storeUrl
            : `${config.storeUrl}/`;

        return axios.create({
            baseURL: `${baseURL}wp-json/wc/v3/`,
            auth: {
                username: config.consumerKey,
                password: config.consumerSecret,
            },
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    /**
     * Test WooCommerce connection
     */
    async testConnection(config: WooCommerceConfig): Promise<TestWooCommerceResult> {
        try {
            const client = this.createClient(config);

            // Try to get store settings
            const response = await client.get('system_status');

            if (response.status === 200) {
                const storeName = response.data?.environment?.site_url || 'Loja WooCommerce';
                return {
                    success: true,
                    message: 'Conexão com WooCommerce estabelecida com sucesso!',
                    storeName,
                };
            } else {
                return {
                    success: false,
                    message: 'Não foi possível conectar ao WooCommerce',
                };
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    return {
                        success: false,
                        message: 'Credenciais inválidas. Verifique Consumer Key e Secret.',
                    };
                } else if (error.response.status === 404) {
                    return {
                        success: false,
                        message: 'API WooCommerce não encontrada. Verifique a URL da loja.',
                    };
                }
            }

            return {
                success: false,
                message: `Erro ao conectar: ${error.message}`,
            };
        }
    }

    /**
     * Setup WooCommerce integration
     */
    async setupIntegration(config: WooCommerceConfig): Promise<SetupWooCommerceResult> {
        try {
            // Test connection first
            const testResult = await this.testConnection(config);

            if (!testResult.success) {
                return {
                    success: false,
                    message: testResult.message,
                };
            }

            // Encrypt credentials
            const encryptedKey = this.encrypt(config.consumerKey);
            const encryptedSecret = this.encrypt(config.consumerSecret);

            return {
                success: true,
                message: 'Integração WooCommerce configurada com sucesso!',
                encryptedKey,
                encryptedSecret,
            };
        } catch (error) {
            return {
                success: false,
                message: `Erro ao configurar integração: ${error.message}`,
            };
        }
    }

    /**
     * Sync products from WooCommerce
     */
    async syncProducts(config: WooCommerceConfig): Promise<any[]> {
        try {
            const client = this.createClient(config);

            // Get all products
            const response = await client.get('products', {
                params: {
                    per_page: 100,
                    status: 'publish',
                },
            });

            return response.data;
        } catch (error) {
            throw new Error(`Erro ao sincronizar produtos: ${error.message}`);
        }
    }

    /**
     * Update product stock in WooCommerce
     */
    async updateStock(
        config: WooCommerceConfig,
        productId: string,
        quantity: number,
    ): Promise<boolean> {
        try {
            const client = this.createClient(config);

            await client.put(`products/${productId}`, {
                stock_quantity: quantity,
            });

            return true;
        } catch (error) {
            throw new Error(`Erro ao atualizar estoque: ${error.message}`);
        }
    }
}
