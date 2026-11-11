import { Controller, Get, Post, Body, Patch, Delete, UseGuards, Req } from '@nestjs/common';
import { PerfilService } from '../service/perfil.service';
import { CreatePerfilDto } from '../dto/create-perfil.dto';
import { UpdatePerfilDto } from '../dto/update-perfil.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('perfil')
@UseGuards(JwtAuthGuard)
export class PerfilController {
  constructor(private readonly perfilService: PerfilService) {}

  @Post()
  create(@Req() req: any, @Body() createPerfilDto: CreatePerfilDto) {
    const idUsuario = req.user.id_usuario;
    return this.perfilService.createPerfil(idUsuario, createPerfilDto);
  }

  @Get()
  findMeuPerfil(@Req() req: any) {
    const idUsuario = req.user.id_usuario;
    return this.perfilService.findByUserId(idUsuario);
  }

  @Patch()
  update(@Req() req: any, @Body() updatePerfilDto: UpdatePerfilDto) {
    const idUsuario = req.user.id_usuario;
    return this.perfilService.updatePerfil(idUsuario, updatePerfilDto);
  }

  @Delete()
  remove(@Req() req: any) {
    const idUsuario = req.user.id_usuario;
    return this.perfilService.removePerfil(idUsuario);
  }
}