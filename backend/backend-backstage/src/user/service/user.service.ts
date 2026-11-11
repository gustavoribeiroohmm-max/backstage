import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import * as bcrypt from 'bcrypt'; 

@Injectable()
export class UsersService {
  // Injeção de dependência via construtor
  constructor(private readonly prisma: PrismaService) {}

  // CRIA O USUÁRIO E O PERFIL ANINHADO EM UMA ÚNICA OPERAÇÃO
  async createUser(data: CreateUserDto) {
    const { nome, email, senha } = data;

    // 1. Verifica se já existe um usuário cadastrado com este e-mail
    const usuarioExiste = await this.prisma.usuario.findUnique({
      where: { email },
    });

    if (usuarioExiste) {
      throw new BadRequestException('Este e-mail já está registrado.');
    }

    const saltRounds = 10;
    
    // Gera o hash da senha antes de salvar
    const hashedPassword = await bcrypt.hash(senha, saltRounds);

    // 2. Cria o usuário e o perfil automaticamente
    return this.prisma.usuario.create({
      data: {
        ...data,
        senha: hashedPassword, // Substitui a senha em texto plano pelo hash seguro
        perfil: {
          create: {
            nome_artistico: nome, // Usa o nome civil como padrão inicial
            cidade: 'Não informada',
            instrumentos: 'Não informado',
            generos: 'Não informado',
            biografia: '',
          },
        },
      },
      include: {
        perfil: true, // Traz o perfil criado junto na resposta se necessário
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.usuario.findUnique({
      where: { email },
    });
  } 

  async findAll() {
    // Utilizando o Prisma Client normalmente
    return this.prisma.usuario.findMany();
  }

  // READ ONE BY ID
  async findUser(id: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id_usuario: id },
      include: { perfil: true }, // Opcional: já traz o perfil junto quando buscar o usuário por ID
    });

    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    return usuario;
  }

  // UPDATE
  async updateUser(id: number, data: UpdateUserDto) {
    // Verifica se o usuário existe antes de atualizar
    await this.findUser(id);

    return this.prisma.usuario.update({
      where: { id_usuario: id },
      data,
    });
  }

  // DELETE
  async removeUser(id: number) {
    // Verifica se o usuário existe antes de deletar
    await this.findUser(id);

    return this.prisma.usuario.delete({
      where: { id_usuario: id },
    });
  }
}