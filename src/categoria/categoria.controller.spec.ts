import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaController } from './categoria.controller';
import { CategoriaService } from './categoria.service';

describe('CategoriaController', () => {
  let controller: CategoriaController;

  const mockCategoriaService = {
    create: jest.fn(dto => {
      return {
        id: 1,
        
        ...dto
      }
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriaController],
      providers: [CategoriaService],
    }).overrideProvider(CategoriaService).useValue(mockCategoriaService).compile();

    controller = module.get<CategoriaController>(CategoriaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Deve criar uma categoria', () => {
    expect(controller.create({
      nome: 'Categoria 1',
      atualizadoEm: null,
      criadoEm: null,
      removidoEm:null
    })).toEqual({
      id: 1,
      nome: 'Categoria 1',
      atualizadoEm: null,
      criadoEm: null,
      removidoEm:null
    });
  })
});
