import { Controller, Get,Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { OportunidadeService } from '../service/oportunidade.service';
import { CreateOportunidadeDto } from '../dto/create-oportunidade.dto';
import { UpdateOportunidadeDto } from '../dto/update-oportunidade.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('oportunidade')
@UseGuards(JwtAuthGuard)
export class OportunidadeController {
  constructor(private readonly oportunidadeService: OportunidadeService) {}

  @Post()
  create(@Req() req: any, @Body() createOportunidadeDto: CreateOportunidadeDto) {
    const idUsuario = req.user.id_usuario;
    return this.oportunidadeService.createOportunidade(idUsuario, createOportunidadeDto);
  }

  @Get()
  findAll() {
    return this.oportunidadeService.findAllOportunidades();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.oportunidadeService.findOportunidadeById(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOportunidadeDto: UpdateOportunidadeDto,
  ) {
    return this.oportunidadeService.updateOportunidade(id, updateOportunidadeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.oportunidadeService.removeOportunidade(id);
  }
}