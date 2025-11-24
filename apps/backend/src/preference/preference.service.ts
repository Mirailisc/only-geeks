import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { ThemeType } from './dto/preference.input'
import { PreferenceEntity } from './entities/preference.entity'

@Injectable()
export class PreferenceService {
  constructor(private prisma: PrismaService) {}
  async updatePreference(
    userId: string,
    currentTheme?: ThemeType,
    isPublicProfile?: boolean,
  ): Promise<PreferenceEntity> {
    await this.prisma.preference.update({
      where: { userId },
      data: {
        ...(currentTheme !== undefined && { currentTheme }),
        ...(isPublicProfile !== undefined && { isPublicProfile }),
      },
    })
    const pref = await this.prisma.preference.findUnique({
      where: { userId },
    })

    return pref
  }
}
