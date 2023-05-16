import { Controller,Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiConsumes, ApiProperty, ApiTags } from '@nestjs/swagger'
import { ConvertService } from './convert.service';
import { CreateConvertDto } from './dto/create-convert.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

@Controller('convert')
export class ConvertController {
  constructor(private readonly convertService: ConvertService) {}

  @Post() 
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Fields added to the database.'})
  @ApiResponse({ status: 400, description: 'Invalid or missing params.'})
  @ApiResponse({ status: 406, description: 'Database not suported yet.'})
  @ApiResponse({ status: 500, description: 'Server error.'})
  @ApiTags('Convert')
  @UseInterceptors(FileInterceptor('file'))
  create(@Body() createConvertDto: CreateConvertDto,  @UploadedFile() file: Express.Multer.File) {
    return this.convertService.create(createConvertDto, file);
  }
}
