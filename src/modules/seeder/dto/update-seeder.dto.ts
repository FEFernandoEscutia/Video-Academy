import { PartialType } from '@nestjs/swagger';
import { CreateSeederDto } from './create-seeder.dto';

export class UpdateSeederDto extends PartialType(CreateSeederDto) {}
