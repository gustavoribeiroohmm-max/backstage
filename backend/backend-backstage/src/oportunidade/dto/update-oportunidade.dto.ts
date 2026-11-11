import { PartialType } from '@nestjs/mapped-types';
import { CreateOportunidadeDto } from './create-oportunidade.dto';

export class UpdateOportunidadeDto extends PartialType(CreateOportunidadeDto) {}