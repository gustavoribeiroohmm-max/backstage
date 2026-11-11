import { Body, Controller, Post, Get, Patch, Delete, Param, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { UsersService } from '../service/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  // Rota pública para registro de novo usuário (cria Usuário + Perfil aninhado)
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  // Listagem protegida por JWT
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  // Buscar usuário por ID (Protegida)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findUser(id);
  }

  // Atualizar dados do usuário logado (Protegida)
  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateUser(
    @Req() req: any,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const idUsuario = req.user.id_usuario;
    return this.usersService.updateUser(idUsuario, updateUserDto);
  }

  // Excluir conta do usuário logado (Protegida)
  @UseGuards(JwtAuthGuard)
  @Delete()
  async removeUser(@Req() req: any) {
    const idUsuario = req.user.id_usuario;
    return this.usersService.removeUser(idUsuario);
  }
}