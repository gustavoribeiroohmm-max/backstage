import { Controller, Get, Post, Body,Patch, Param,Delete, ParseIntPipe, UseGuards,Req } from '@nestjs/common';
import { BandaService } from '../service/banda.service';
import { CreateBandaDto } from '../dto/create-banda.dto';
import { UpdateBandaDto } from '../dto/update-banda.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('banda')
@UseGuards(JwtAuthGuard)
export class BandaController {
  constructor(private readonly bandaService: BandaService) {}

  @Post()
  createBanda(@Req() req: any, @Body() createBandaDto: CreateBandaDto) {
    const idUsuario = req.user.id_usuario;
    return this.bandaService.createBanda(idUsuario, createBandaDto);
  }

  @Get()
  findAllBandas() {
    return this.bandaService.findAllBandas();
  }

  @Get('minhas')
  findMinhasBandas(@Req() req: any) {
    const idUsuario = req.user.id_usuario;
    return this.bandaService.findBandasByCriador(idUsuario);
  }

  @Get(':id')
  findBandaById(@Param('id', ParseIntPipe) id: number) {
    return this.bandaService.findBandaById(id);
  }

  @Patch(':id')
  updateBanda(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBandaDto: UpdateBandaDto,
  ) {
    return this.bandaService.updateBanda(id, updateBandaDto);
  }

  @Delete(':id')
  removeBanda(@Param('id', ParseIntPipe) id: number) {
    return this.bandaService.removeBanda(id);
  }
}