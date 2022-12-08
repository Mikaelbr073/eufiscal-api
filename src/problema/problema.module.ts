import { Module } from '@nestjs/common';
import { ProblemaService } from './problema.service';
import { ProblemaController } from './problema.controller';
import { PrismaService } from 'src/database/PrismaService';
import { FirebaseService } from 'src/firebase/firebase.service';
import { CidadeService } from 'src/cidade/cidade.service';

@Module({
  controllers: [ProblemaController],
  providers: [ProblemaService, CidadeService, PrismaService, FirebaseService]
})
export class ProblemaModule {}
