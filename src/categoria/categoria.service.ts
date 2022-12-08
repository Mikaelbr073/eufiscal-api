import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/PrismaService';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { Categoria } from './entities/categoria.entity';

@Injectable()
export class CategoriaService {
  constructor(private prisma: PrismaService) {}
  
  create(createCategoriaDto: CreateCategoriaDto) {
    return this.prisma.categoria.create({
      data: createCategoriaDto,
    });
  }

  findAll(
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.CategoriaWhereUniqueInput;
      where?: Prisma.CategoriaWhereInput;
      orderBy?: Prisma.CategoriaOrderByWithRelationInput;
    }
  ) : Promise<Categoria[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.categoria.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  findOne(id: number) : Promise<Categoria | null> {
    return this.prisma.categoria.findUnique({
      where: {
        id: id
      },
    });
  }

  async update(params: {
    where: Prisma.CategoriaWhereUniqueInput;
    data: UpdateCategoriaDto;
  }): Promise<Categoria> {
    const { where, data } = params;
    return this.prisma.categoria.update({
      data,
      where,
    });
  }

  remove(params: {
    where: Prisma.CategoriaWhereUniqueInput;
  }): Promise<Categoria> {

    let removidoEm = new Date();

    const { where } = params;
    return this.prisma.categoria.update({
      data: {
        removidoEm
      },
      where,
    });
  }

  async deleteCategoria(where: Prisma.CategoriaWhereUniqueInput): Promise<Categoria> {
    return this.prisma.categoria.delete({
      where,
    });
  }

}
