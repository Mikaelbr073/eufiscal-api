import { Test, TestingModule } from '@nestjs/testing';
import exp from 'constants';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';

describe('UsuarioController', () => {
  let controller: UsuarioController;
  const mockUsuarioService = {
    create: jest.fn(dto => {
      return {
        id: 1,
        ...dto
      }
    }),
    update: jest.fn().mockImplementation((id, dto) => {
      return {
        id: 1,
        ...dto
      }
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuarioController],
      providers: [UsuarioService],
    }).overrideProvider(UsuarioService).useValue(mockUsuarioService).compile();

    controller = module.get<UsuarioController>(UsuarioController);
  });

  it('Deve criar um Usuario', () => {
    var dto = {
      nome: 'User 1',
      cpf: "198408324", 
      email: "email@email.com" ,
      senha: "password"
    }
    expect(controller.create(dto)).toEqual({
      id: expect.any(Number),
      nome: 'User 1',
      cpf: "198408324", 
      email: "email@email.com" ,
      senha: "password"
    });

    expect(mockUsuarioService.create).toHaveBeenCalledWith(dto);
  })

  it('Deve atualizar um Usuario', () => {
    var dto = {
      id: 1,
      nome: 'User 2',
      cpf: "5005050", 
      email: "email@email.com" ,
      senha: "password2"
    }
    expect(controller.update('1', dto))
    // .toEqual({
    //   id: 1,
    //   ...dto
    // });

    expect(mockUsuarioService.update).toHaveBeenCalled();
  })

});
