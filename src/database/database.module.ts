import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from 'src/config/config';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({

    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [config],
            envFilePath:
                process.env.NODE_ENV === 'prod'
                    ? '.prod.env'
                : process.env.NODE_ENV === 'stg'
                    ? '.stage.env'
                    : '.env',
    }),
    TypeOrmModule.forRootAsync({
  inject: [config.KEY],
  useFactory: (cfg: ConfigType<typeof config>) => {
    const { postgres } = cfg;
    return {
      type: 'postgres',
      host: postgres.host,
      port: postgres.port,
      username: postgres.user,
      password: postgres.password,
      database: postgres.dbName,
      synchronize: true,
      autoLoadEntities: true,
      ssl: { rejectUnauthorized: false },
      //logging: true,
    };
  },
}),
    ],
    providers: [],
    exports: [TypeOrmModule],

})
export class DatabaseModule {}
