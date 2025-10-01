import { Module } from '@nestjs/common'
import { HealthModule } from './health/health.module'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { join } from 'path'
import { ServeStaticModule } from '@nestjs/serve-static'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      playground: false,
      context: ({ req, res }) => ({ req, res }),
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      renderPath: '/*',
      exclude: ['/auth*', '/graphql*'],
    }),
    HealthModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
