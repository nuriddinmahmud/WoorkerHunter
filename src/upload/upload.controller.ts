import { 
    Controller, Post, Get, Param, Res, UploadedFiles, UseInterceptors 
  } from '@nestjs/common';
  import { FilesInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';
  import { Response } from 'express';
  import { join } from 'path';
  import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
  import * as path from 'path';
  
  @ApiTags('File Upload')
  @Controller('upload')
  export class UploadController {
    /**
     * Upload multiple image files
     */
    @Post()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          files: {
            type: 'array',
            items: { type: 'string', format: 'binary' },
          },
        },
      },
    })
    @ApiResponse({ status: 201, description: 'Files have been uploaded successfully!' })
    @UseInterceptors(
      FilesInterceptor('files', 10, {
        storage: diskStorage({
          destination: './uploads',
          filename(req, file, callback) {
            const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
            callback(null, uniqueName);
          },
        }),
      }),
    )
  
    uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
      const uploadedFiles = files.map(file => file.filename);
      return { message: 'Files have been uploaded successfully!', fileNames: uploadedFiles };
    }
    
    @Get(':filename')
    @ApiParam({ name: 'filename', required: true, description: 'The name of the file to retrieve' })
    @ApiResponse({ status: 200, description: 'File has been retrieved successfully!' })
    @ApiResponse({ status: 404, description: 'File not found!' })
    getFile(@Param('filename') filename: string, @Res() res: Response) {
      const filePath = join(__dirname, '..', '..', 'uploads', filename);
      return res.sendFile(filePath);
    }
  }
  