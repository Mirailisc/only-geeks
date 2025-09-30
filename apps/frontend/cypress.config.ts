import { defineConfig } from 'cypress'
import createBundler from '@bahmutov/cypress-esbuild-preprocessor'
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor'
import createEsbuildPlugin from '@badeball/cypress-cucumber-preprocessor/esbuild'
import { PrismaClient } from '@package/prisma'
import * as path from 'path'
import * as dotenv from 'dotenv'
import { randomUUID } from 'crypto'

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
          const adminId = randomUUID()
          const userId = randomUUID()

          await prisma.user.createMany({
            data: [
              {
                id: adminId,
                email: 'admin@test.com',
                firstName: 'Admin',
                lastName: 'User',
                isAdmin: true,
              },
              {
                id: userId,
                email: 'user@test.com',
                firstName: 'User',
                lastName: 'User',
                isAdmin: false,
              },
            ],
          })
          await prisma.profile.createMany({
            data: [
              { userId: adminId, picture: '' },
              { userId: userId, picture: '' },
            ],
          })
          return null
        },
        async 'db:clean'() {
          const users = await prisma.user.findMany({
            where: { email: { in: ['admin@test.com', 'user@test.com'] } },
            select: { id: true },
          })

          const userIds = users.map((u) => u.id)

          await prisma.profile.deleteMany({
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
