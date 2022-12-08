import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaService } from './categoria.service';

describe('CategoriaService', () => {
  let service: CategoriaService;

  const mockCategoriaService = {

  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriaService],
    }).overrideProvider(CategoriaService).useValue(mockCategoriaService).compile();

    service = module.get<CategoriaService>(CategoriaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Deve criar uma categoria', () => {
    expect(service.create({
      nome: 'Categoria 1',
      atualizadoEm: null,
      criadoEm: null,
      removidoEm:null
    })).toEqual(expect.objectContaining({
      id: expect.any(Number),
      nome: 'Categoria 1',
      atualizadoEm: null,
      criadoEm: expect.any(Date),
      removidoEm:null
    }));
  })
});
