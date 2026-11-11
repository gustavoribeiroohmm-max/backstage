import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePerfilDto } from '../dto/create-perfil.dto';
import { UpdatePerfilDto } from '../dto/update-perfil.dto';

@Injectable()
export class PerfilService {
  constructor(private prisma: PrismaService) {}

  async createPerfil(userId: number, createPerfilDto: CreatePerfilDto) {
    return this.prisma.perfil.create({
      data: {
        ...createPerfilDto,
        id_usuario: userId,
      },
    });
  }

  async findByUserId(userId: number) {
    const perfil = await this.prisma.perfil.findUnique({
      where: { id_usuario: userId },
    });

    if (!perfil) {
      throw new NotFoundException('Perfil não encontrado para este usuário.');
    }

    return perfil;
  }

  async updatePerfil(userId: number, updatePerfilDto: UpdatePerfilDto) {
    await this.findByUserId(userId);

    return this.prisma.perfil.update({
      where: { id_usuario: userId },
      data: updatePerfilDto,
    });
  }

  async removePerfil(userId: number) {
    await this.findByUserId(userId);

    return this.prisma.perfil.delete({
      where: { id_usuario: userId },
    });
  }
}