import { Module } from '@nestjs/common'
import { HealthModule } from './health/health.module'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { AppController } from './app.controller'
import { AuthController } from './auth/auth.controller'
import { BlogModule } from './blog/blog.module'

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
    HealthModule,
    UserModule,
    AuthModule,
    BlogModule,
  ],
  controllers: [
    AuthController,
    ...(process.env.NODE_ENV === 'production' ? [AppController] : []),
  ],
})
export class AppModule {}
