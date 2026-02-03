import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { WoocommerceService, WooCommerceConfig } from './woocommerce.service';

class TestWooCommerceDto {
    storeUrl: string;
    consumerKey: string;
    consumerSecret: string;
}

class SetupWooCommerceDto extends TestWooCommerceDto {
    companyId: string;
    autoSync: boolean;
}

@Controller('api/woocommerce')
export class WoocommerceController {
    constructor(private readonly woocommerceService: WoocommerceService) { }

    @Post('test')
    async testConnection(@Body() dto: TestWooCommerceDto) {
        try {
            const config: WooCommerceConfig = {
                storeUrl: dto.storeUrl,
                consumerKey: dto.consumerKey,
                consumerSecret: dto.consumerSecret,
            };

            const result = await this.woocommerceService.testConnection(config);
            return result;
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: `Erro ao testar conexão: ${error.message}`,
                },
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    @Post('setup')
    async setupIntegration(@Body() dto: SetupWooCommerceDto) {
        try {
            const config: WooCommerceConfig = {
                storeUrl: dto.storeUrl,
                consumerKey: dto.consumerKey,
                consumerSecret: dto.consumerSecret,
            };

            const result = await this.woocommerceService.setupIntegration(config);
            return result;
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: `Erro ao configurar integração: ${error.message}`,
                },
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    @Post('sync')
    async syncProducts(@Body() dto: TestWooCommerceDto) {
        try {
            const config: WooCommerceConfig = {
                storeUrl: dto.storeUrl,
                consumerKey: dto.consumerKey,
                consumerSecret: dto.consumerSecret,
            };

            const products = await this.woocommerceService.syncProducts(config);
            return {
                success: true,
                message: `${products.length} produtos sincronizados com sucesso!`,
                products,
            };
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: `Erro ao sincronizar produtos: ${error.message}`,
                },
                HttpStatus.BAD_REQUEST,
            );
        }
    }
}
