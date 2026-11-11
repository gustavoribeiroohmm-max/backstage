import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOportunidadeDto {
  @IsString()
  @IsNotEmpty({ message: 'O título é obrigatório.' })
  titulo: string;

  @IsString()
  @IsNotEmpty({ message: 'A descrição é obrigatória.' })
  descricao: string;

  @IsString()
  @IsNotEmpty({ message: 'A cidade é obrigatória.' })
  cidade: string;

  @IsString()
  @IsNotEmpty({ message: 'O instrumento procurado é obrigatório.' })
  instrumento_procurado: string;
}