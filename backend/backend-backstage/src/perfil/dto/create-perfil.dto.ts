import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePerfilDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome artístico é obrigatório.' })
  nome_artistico: string;

  @IsString()
  @IsNotEmpty({ message: 'A cidade é obrigatória.' })
  cidade: string;

  @IsString()
  @IsNotEmpty({ message: 'Os instrumentos são obrigatórios.' })
  instrumentos: string;

  @IsString()
  @IsOptional()
  generos?: string;

  @IsString()
  @IsOptional()
  biografia?: string;
}