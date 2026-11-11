import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOportunidadeDto } from '../dto/create-oportunidade.dto';
import { UpdateOportunidadeDto } from '../dto/update-oportunidade.dto';

@Injectable()
export class OportunidadeService {
  constructor(private prisma: PrismaService) {}

  async createOportunidade(userId: number, createOportunidadeDto: CreateOportunidadeDto) {
    return this.prisma.oportunidade.create({
      data: {
        ...createOportunidadeDto,
        id_anunciante: userId,
      },
    });
  }

  async findAllOportunidades() {
    return this.prisma.oportunidade.findMany({
      include: {
        anunciante: {
          select: {
            id_usuario: true,
            nome: true,
            email: true,
          },
        },
      },
    });
  }

  async findOportunidadeById(id: number) {
    const oportunidade = await this.prisma.oportunidade.findUnique({
      where: { id_oportunidade: id },
      include: {
        anunciante: {
          select: {
            id_usuario: true,
            nome: true,
            email: true,
          },
        },
      },
    });

    if (!oportunidade) {
      throw new NotFoundException('Oportunidade não encontrada.');
    }

    return oportunidade;
  }

  async updateOportunidade(id: number, updateOportunidadeDto: UpdateOportunidadeDto) {
    await this.findOportunidadeById(id);

    return this.prisma.oportunidade.update({
      where: { id_oportunidade: id },
      data: updateOportunidadeDto,
    });
  }

  async removeOportunidade(id: number) {
    await this.findOportunidadeById(id);

    return this.prisma.oportunidade.delete({
      where: { id_oportunidade: id },
    });
  }
}