import { IsArray, IsBoolean, IsDecimal, IsNotEmpty, IsString } from "class-validator";

export class CreateCourseDto {

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true }) 
    technologies: string[];

    @IsNotEmpty()
    @IsDecimal({ decimal_digits: '2', force_decimal: true })
    price: number;

    @IsNotEmpty()
    @IsBoolean()
    available?: boolean;
}
