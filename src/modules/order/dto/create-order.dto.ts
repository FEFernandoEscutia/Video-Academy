import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateOrderDto {
    
    @IsUUID()
    @IsNotEmpty()
    id: string
    
}
