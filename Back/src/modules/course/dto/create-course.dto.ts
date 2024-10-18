import { IsString, IsNotEmpty, IsArray, IsNumber, Min, Max, MinLength, MaxLength, ArrayNotEmpty, IsPositive } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty({ message: 'El título es obligatorio.' })
  @MinLength(5, { message: 'El título debe tener al menos 5 caracteres.' })
  @MaxLength(100, { message: 'El título no puede tener más de 100 caracteres.' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción es obligatoria.' })
  @MinLength(20, { message: 'La descripción debe tener al menos 20 caracteres.' })
  @MaxLength(1000, { message: 'La descripción no puede tener más de 1000 caracteres.' })
  description: string;

  @IsArray()
  @ArrayNotEmpty({ message: 'Debe haber al menos una tecnología.' })
  @IsString({ each: true, message: 'Cada tecnología debe ser una cadena de texto.' })
  technologies: string[];

  @IsNumber()
  @IsPositive({ message: 'El precio debe ser un número positivo.' })
  @Min(0, { message: 'El precio mínimo es 0.' })
  @Max(10000, { message: 'El precio máximo es 10,000.' })
  price: number;
}
