import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../../database';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { AuthorizeModule } from '../authorize/authorize.module';
import { ArticleManagementModule } from '../article-management/article-management.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    AutomapperModule.forRoot({ strategyInitializer: classes() }),
    AuthorizeModule,
    ArticleManagementModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
