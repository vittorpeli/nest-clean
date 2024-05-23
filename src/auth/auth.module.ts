import { InternalServerErrorException, Logger, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { Env } from 'src/env'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory(config: ConfigService<Env>) {
        const privateKey = config.get('JWT_PRIVATE_KEY', { infer: true })
        const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true })

        if (!privateKey || !publicKey) {
          throw new InternalServerErrorException('JWT keys are not defined in the environment variables')
        }

        Logger.log(`Private key: ${privateKey.slice(0, 30)}...`)
        Logger.log(`Public key: ${publicKey.slice(0, 30)}...`)

        return {
          signOptions: { algorithm: 'RS256' },
          privateKey: privateKey,
          publicKey: privateKey,
          verifyOptions: {
            algorithms: ['RS256']
          },
        }
      },
    })
  ]
})
export class AuthModule {

}