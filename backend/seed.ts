import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './src/users/entities/user.entity';

async function seed() {
    // Configuração do DataSource
    const dataSource = new DataSource({
        type: 'postgres',
        host: process.env.POSTGRES_HOST || 'localhost',
        port: parseInt(process.env.POSTGRES_PORT || '5432'),
        username: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD || 'password',
        database: process.env.POSTGRES_DB || 'pdv',
        entities: [User],
        synchronize: true,
    });

    try {
        await dataSource.initialize();
        console.log('✅ Conectado ao banco de dados');

        const userRepository = dataSource.getRepository(User);

        // Verificar se o usuário admin já existe
        const existingUser = await userRepository.findOne({
            where: { email: 'joao@patriciaelias.com.br' },
        });

        if (existingUser) {
            console.log('⚠️  Usuário admin já existe!');
            console.log('📧 Email:', existingUser.email);
            console.log('👤 Nome:', existingUser.name);
            console.log('🔑 Role:', existingUser.role);
            await dataSource.destroy();
            return;
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash('31445307@Pe', 10);

        // Criar usuário admin
        const adminUser = userRepository.create({
            name: 'João - Admin',
            email: 'joao@patriciaelias.com.br',
            password: hashedPassword,
            role: UserRole.ADMIN,
            active: true,
        });

        await userRepository.save(adminUser);

        console.log('✅ Usuário admin criado com sucesso!');
        console.log('📧 Email:', adminUser.email);
        console.log('👤 Nome:', adminUser.name);
        console.log('🔑 Role:', adminUser.role);
        console.log('🆔 ID:', adminUser.id);

        await dataSource.destroy();
        console.log('✅ Seed concluído!');
    } catch (error) {
        console.error('❌ Erro ao executar seed:', error);
        process.exit(1);
    }
}

seed();
