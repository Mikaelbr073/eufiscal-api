import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';
import { AuthService } from './shared/auth.service';
import { UsuarioService } from 'src/usuario/usuario.service';
import { LocalStrategy } from './shared/local.strategy';
import { JwtStrategy } from './shared/jwt.strategy';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsuarioModule,
     PassportModule,
     JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '24h' },
      }),
    ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy
  ],
})
export class AuthModule {}
