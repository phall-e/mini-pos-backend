import { PartialType } from "@nestjs/swagger";
import { CreateTelegramRequestDto } from "./create-telegram-request.dto";

export class UpdateTelegramRequestDto extends PartialType(CreateTelegramRequestDto) {
    
}