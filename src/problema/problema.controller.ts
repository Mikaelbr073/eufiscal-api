import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ProblemaService } from './problema.service';
import { CreateProblemaDto } from './dto/create-problema.dto';
import { UpdateProblemaDto } from './dto/update-problema.dto';
import { HistoricoProblema, Problema } from './entities/problema.entity';
import { FirebaseService } from 'src/firebase/firebase.service';
import { JwtAuthGuard } from 'src/auth/shared/jwt-auth.guard';
import { CidadeService } from 'src/cidade/cidade.service';

@Controller('problema')
export class ProblemaController {
  constructor(private readonly problemaService: ProblemaService, private readonly cidadeService: CidadeService, private readonly firebaseService: FirebaseService) {}

  @Post()
  create(@Body() createProblemaDto: CreateProblemaDto) {
    return this.firebaseService.getFotoUrl(createProblemaDto.fotoId).then( foto => {
      createProblemaDto.fotoURL = foto;
      this.cidadeService.findAll({
        where: {
          nome: {
            startsWith: createProblemaDto.cidade,
            endsWith: createProblemaDto.cidade,
            mode: 'insensitive'
          }
        }
      }).then(cidade => {
        createProblemaDto.cidadeID = cidade[0].id;
        let problema = this.problemaService.create(createProblemaDto);
        problema.then(x => this.problemaService.createHistorico({ id: x.id, statusID: x.statusID}));
        return problema;
      })
    });
  }

  @Get()
  findAll(@Query('statusID') statusID: string, @Query('categoriaID') categoriaID: string, @Query('cidadeID') cidadeID: string) {
    let filtro = {
      where: {
        removidoEm: null,
        statusID: +statusID,
        categoriaID: +categoriaID,
        cidadeID: +cidadeID,
      }
    }

    if(!statusID)
      delete filtro.where.statusID
    
    if(!categoriaID)
      delete filtro.where.categoriaID

    if(!cidadeID)
      delete filtro.where.cidadeID
      
    return this.problemaService.findAll(filtro);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.problemaService.findOne(+id).then(problema => {
      return this.problemaService.findHistoricos({
        where: {
          problemaID: +id
        }
      }).then(historico => {
        problema.statusHistorico = { 
          abertura: null,
          analise: null,
          resolvido: null,
        };

        historico.forEach(element => {
          if(element.status.id == 1){
            problema.statusHistorico.abertura = {
              data: element.data,
              descricao: "Inicio da denuncia"
            }
          }
          
          if(element.status.id == 2){
            problema.statusHistorico.analise = {
              data: element.data,
              descricao: "Denuncia foi analisada e aceita. Está aguardando a resposta do órgão responsável."
            }
          }
          
          if(element.status.id == 3){
            problema.statusHistorico.resolvido = {
              data: element.data,
              descricao: "Denuncia vista por órgão responsável e o problema foi solucionado."
            }
          }
        });
        return problema;
      })

    })
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/atualizarStatus')
  atualizarStatus(@Param('id') id: string) {
    var problema = this.problemaService.findOne(+id);
    let problemaStatus = 0; 
    return problema.then( x => {
      problemaStatus = x.status.id
      if(problemaStatus == 1)
        problemaStatus= 2;
      else if (problemaStatus == 2)
        problemaStatus = 3;
      else
        return {
          mensagem: "Status não pode ser alterado"
        };     
      return this.problemaService.createHistorico({ id: +id, statusID: problemaStatus}).then( hist => {
        return this.problemaService.updateStatus(
          {
            where : {
              id: +id
            },
            data: {
              id:  +id,
              statusID: problemaStatus
            }
          }
        ).then(stats => {
          return {
            mensagem: "Status alterado com sucesso"
          }
        })
      });
    })   
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProblemaDto: UpdateProblemaDto) {
    return this.problemaService.update({
      where : {
        id: +id
      },
      data: updateProblemaDto
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.problemaService.remove({
      where : {
        id: +id
      }
    });
  }

  @Get('firebase/:id')
  buscarFoto(@Param('id') id: string) {
    return this.firebaseService.getFotoUrl(id);
  }

}
