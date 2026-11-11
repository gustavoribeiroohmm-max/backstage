import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBandaDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome da banda é obrigatório.' })
  nome_banda: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsString()
  @IsOptional()
  genero?: string;

  @IsString()
  @IsOptional()
  cidade?: string;
}