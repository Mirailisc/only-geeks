import { defineConfig } from 'cypress'
import createBundler from '@bahmutov/cypress-esbuild-preprocessor'
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor'
import createEsbuildPlugin from '@badeball/cypress-cucumber-preprocessor/esbuild'
import { PrismaClient } from '@package/prisma'
import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const prisma = new PrismaClient()

export default defineConfig({
  e2e: {
    specPattern: '**/*.feature',
    supportFile: 'cypress/support/e2e.ts',
    video: true,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config)

      on(
        'file:preprocessor',
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        }),
      )

      on('task', {
        async 'db:seed'() {
          await prisma.user.createMany({
            data: [
              {
                email: 'admin@test.com',
                username: 'adminu',
                picture: 'https://i.pravatar.cc/300?img=5',
                firstName: 'Admin',
                lastName: 'User',
                isAdmin: true,
                type: 'local',
              },
              {
                email: 'user@test.com',
                picture: 'https://i.pravatar.cc/300?img=3',
                firstName: 'User',
                username: 'useru',
                lastName: 'User',
                isAdmin: false,
                type: 'local',
              },
              {
                email: 'janedoe@gmail.com',
                picture: 'https://i.pravatar.cc/300?img=8',
                firstName: 'Jane',
                lastName: 'Doe',
                username: 'janedoe2',
                isAdmin: false,
                type: 'local',
                password: '$2b$10$4F3aQi6PJkh25TwleeKeEe.G4WyXryaFiCkfJSivwYPk12Bzak0Ky',
              },
            ],
          })
          return null
        },
        async 'db:clean'() {
          const users = await prisma.user.findMany({
            where: { email: { in: ['admin@test.com', 'user@test.com', 'janedoe@gmail.com', 'johndoe@gmail.com'] } },
            select: { id: true },
          })
          const userIds = users.map((u) => u.id)
          await prisma.blog.deleteMany({
            where: { userId: { in: userIds } },
          })
          await prisma.user.deleteMany({
            where: { id: { in: userIds } },
          })
          return null
        },
      })

      return config
    },
    baseUrl: 'http://localhost:3000',
  },
})
