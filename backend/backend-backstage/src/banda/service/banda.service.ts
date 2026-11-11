import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // Ajuste o caminho do PrismaService se necessário
import { CreateBandaDto } from '../dto/create-banda.dto';
import { UpdateBandaDto } from '../dto/update-banda.dto';

@Injectable()
export class BandaService {
  constructor(private prisma: PrismaService) {}

  async createBanda(userId: number, createBandaDto: CreateBandaDto) {
    return this.prisma.banda.create({
      data: {
        ...createBandaDto,
        id_criador: userId,
      },
    });
  }

  async findAllBandas() {
    return this.prisma.banda.findMany();
  }

  async findBandasByCriador(userId: number) {
    return this.prisma.banda.findMany({
      where: { id_criador: userId },
      orderBy: { id_banda: 'desc' },
    });
  }

  async findBandaById(id: number) {
    const banda = await this.prisma.banda.findUnique({
      where: { id_banda: id },
    });

    if (!banda) {
      throw new NotFoundException('Banda não encontrada.');
    }

    return banda;
  }

  async updateBanda(id: number, updateBandaDto: UpdateBandaDto) {
    await this.findBandaById(id);

    return this.prisma.banda.update({
      where: { id_banda: id },
      data: updateBandaDto,
    });
  }

  async removeBanda(id: number) {
    await this.findBandaById(id);

    return this.prisma.banda.delete({
      where: { id_banda: id },
    });
  }
}