import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class CreateConvertDto {
    @ApiProperty({ 
        type: 'string', 
        required: true, 
        description: 'Database url', 
        example:'postgres://postgres:postgrespw@localhost:32770/db_name'     
    })
    @IsNotEmpty()
    databaseUrl: string

    @ApiProperty({ 
        type: 'string', 
        required: true,
        description: 'Table name',
        example: 'table'
     })
    @IsNotEmpty()
    table: string

    @ApiProperty({ 
        type: 'string', 
        required: false, 
        description: 'Sheet cell name'
    })
    sheetName: string

    @ApiProperty({ 
        type: 'string', 
        required: false,
        description: 'If is passed this option, the the field, uniqueField, with the same value will be replaced in  the database'
    })
    uniqueField: string

    @ApiProperty({ 
        type: 'string', 
        format: 'binary', 
        required: true,
        description: 'File to be parsed in xls to the database table'
    })
    file: Express.Multer.File

    @ApiProperty({ 
        type: 'number', 
        required: false,
        description: 'Offset to the records to be stored in the database'
    })
    offset: string

    @ApiProperty({ 
        type: 'number', 
        required: false,
        description: 'Limit to the records to be stored in the database'
    })
    limit: string
}

