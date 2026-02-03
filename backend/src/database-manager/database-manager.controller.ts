import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { DatabaseManagerService, DatabaseConfig } from './database-manager.service';

class TestConnectionDto {
    dbType: 'mysql' | 'postgres';
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
}

class SetupDatabaseDto extends TestConnectionDto {
    companyId: string;
}

@Controller('api/database')
export class DatabaseManagerController {
    constructor(private readonly databaseManagerService: DatabaseManagerService) { }

    @Post('test')
    async testConnection(@Body() dto: TestConnectionDto) {
        try {
            const config: DatabaseConfig = {
                dbType: dto.dbType,
                host: dto.host,
                port: dto.port,
                database: dto.database,
                username: dto.username,
                password: dto.password,
            };

            const result = await this.databaseManagerService.testConnection(config);
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
    async setupDatabase(@Body() dto: SetupDatabaseDto) {
        try {
            const config: DatabaseConfig = {
                dbType: dto.dbType,
                host: dto.host,
                port: dto.port,
                database: dto.database,
                username: dto.username,
                password: dto.password,
            };

            const result = await this.databaseManagerService.setupDatabase(config);
            return result;
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: `Erro ao configurar banco de dados: ${error.message}`,
                },
                HttpStatus.BAD_REQUEST,
            );
        }
    }
}
