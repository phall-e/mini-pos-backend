import { ApiProperty } from "@nestjs/swagger";

export class ResponseDto<T> {
    @ApiProperty()
    payload: T;

    @ApiProperty({ 
        example: 1697049600000,
    })
    timestamp: number;
}