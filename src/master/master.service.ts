import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMasterDto } from './dto/create-master.dto';
import { UpdateMasterDto } from './dto/update-master.dto';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Prisma } from '@prisma/client';
import { QueryMasterDto, SearchMasterDto } from './dto/search-master.dto';

@Injectable()
export class MasterService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMasterDto) {
    try {
      const { masterProfessions, ...body } = dto;

      const exists = await this.prisma.master.findFirst({
        where: { phoneNumber: body.phoneNumber },
      });
      if (exists) {
        throw new ConflictException('Master with this phoneNumber number already exists.');
      }

      // Validate masterProfessions
      if (masterProfessions?.length) {
        let professionIds = masterProfessions.map(mp => mp.professionId);

        const validProfessions = await this.prisma.profession.findMany({
          where: { id: { in: professionIds } },
        });
        
        if (validProfessions.length !== professionIds.length) {
          throw new BadRequestException('One or more profession IDs are invalid.');
        }

        let levelIds = masterProfessions
          .filter(mp => mp.levelId)
          .map(mp => mp.levelId)
          .filter(id => id !== undefined) as string[];

        levelIds = Array.from(new Set(levelIds));

        if (levelIds.length) {
          const validLevels = await this.prisma.level.findMany({
            where: { id: { in: levelIds } },
          });
          if (validLevels.length !== levelIds.length) {
            throw new BadRequestException('One or more level IDs are invalid.');
          }
        }
      }

      const master = await this.prisma.master.create({ data: body });

      if (masterProfessions?.length) {
        const masterProfessionData = masterProfessions.map(mp => ({
          masterId: master.id,
          ...mp,
        }));
        const createdmasterProfessions = await this.prisma.masterProfession.createMany({ data: masterProfessionData });
        // if (  createdmasterProfessions.count !== masterProfessionData.length) {
        //   throw new BadRequestException('Failed to create MasterProfession records.');
        // }

        if (  createdmasterProfessions.count !== 0 ) {
          const masterProfessions = await this.prisma.masterProfession.findMany({
            where: { masterId: master.id },
            include: { profession: true, level: true },
          });

          master['masterProfessions'] = masterProfessions;
        } 

      }

      return { data: master };
    } catch (error) {
      this.handleError(error);
    }
  }


  async findAll(query: QueryMasterDto) {
    const {
      page = 1,
      limit = 10,
      orderBy = 'asc',
      sortBy = 'firstName',
      firstName,
      lastName,
      phoneNumber,
      isActive,
      birthYear,
      maxYear,
      minYear,
    } = query;
  
    const where: any = {};
  
    if (firstName || lastName) {
      where.OR = [
        { firstName: { contains: firstName, mode: 'insensitive' } },
        { lastName: { contains: lastName, mode: 'insensitive' } },
      ];
    }
  
    if (phoneNumber) {
      where.phoneNumber = { contains: phoneNumber, mode: 'insensitive' };
    }
  
    if (isActive === 'true') {
      where.isActive = true;
    } else if (isActive === 'false') {
      where.isActive = false;
    }
  
    if (birthYear || maxYear || minYear) {
      where.birthYear = {
        ...(minYear && { gte: new Date(minYear).getFullYear() }),
        ...(maxYear && { lte: new Date(maxYear).getFullYear() }),
        ...(birthYear && { equals: new Date(birthYear).getFullYear() }),
      };
    }
  
    const [data, total] = await this.prisma.$transaction([
      this.prisma.master.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: orderBy },
        include: { masterProfessions: true },
      }),
      this.prisma.master.count({ where }),
    ]);

    if (data.length) {  

      for ( let i = 0; i < data.length; i++) {
        const master = data[i];
        
        const masterRating = await this.calculateMasterRating(master.id);
        
        master['masterRating'] = masterRating;
      }

      // for (const master of data) {
      //   const masterRating = this.calculateMasterRating(master.id);
      //   master['masterRatingldjfnvldfkj'] = masterRating;
      // }
    }
  
    return {
      total,
      currentPage: +page,
      totalPages: Math.ceil(total / +limit),
      data,
    };
  }
  
  async search(query: SearchMasterDto) {
    const {
      page = 1,
      limit = 10,
      orderBy = 'asc',
      sortBy = 'experience',
      levelId,
      professionId,
      minWorkingHours,
      gteMinWorkingHours,
      lteMinWorkingHours,
      priceHourly,
      gtePriceHourly,
      ltePriceHourly,
      priceDaily,
      gtePriceDaily,
      ltePriceDaily,
      experience,
      gteExperience,
      lteExperience,
    } = query;
  
    const where: any = {};
  
    if (levelId) {
      where.levelId = levelId;
    }
  
    if (professionId) {
      where.professionId = professionId;
    }
  
    if (minWorkingHours || gteMinWorkingHours || lteMinWorkingHours) {
      where.minWorkingHours = {
        ...(gteMinWorkingHours && { gte: gteMinWorkingHours }),
        ...(lteMinWorkingHours && { lte: lteMinWorkingHours }),
        ...(minWorkingHours && { equals: minWorkingHours }),
      };
    }
  
    if (priceHourly || gtePriceHourly || ltePriceHourly) {
      where.priceHourly = {
        ...(gtePriceHourly && { gte: gtePriceHourly }),
        ...(ltePriceHourly && { lte: ltePriceHourly }),
        ...(priceHourly && { equals: priceHourly }),
      };
    }
  
    if (priceDaily || gtePriceDaily || ltePriceDaily) {
      where.priceDaily = {
        ...(gtePriceDaily && { gte: gtePriceDaily }),
        ...(ltePriceDaily && { lte: ltePriceDaily }),
        ...(priceDaily && { equals: priceDaily }),
      };
    }
  
    if (experience || gteExperience || lteExperience) {
      where.experience = {
        ...(gteExperience && { gte: gteExperience }),
        ...(lteExperience && { lte: lteExperience }),
        ...(experience && { equals: experience }),
      };
    }
  
    const [data, total] = await this.prisma.$transaction([
      this.prisma.masterProfession.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: orderBy },
        include: { master: true },
      }),
      this.prisma.masterProfession.count({ where }),
    ]);

    // if (data.length !== 0) { 
    //   for (let i = 0; i < data.length; i++) {
    //  }
  
    return {
      total,
      currentPage: +page,
      totalPages: Math.ceil(total / +limit),
      data: data.map((item) => ({ ...item.master, ...item })),
    };
  }

  // async findAll(params: {
  //   page?: number;
  //   limit?: number;
  //   search?: string;
  //   sortBy?: string;
  //   sortOrder?: 'asc' | 'desc';
  //   isActive?: boolean;
  // }) {
  //   try {
  //     const {
  //       page = 1,
  //       limit = 10,
  //       search,
  //       sortBy = 'createdAt',
  //       sortOrder = 'desc',
  //       isActive,
  //     } = params;

  //     const where: any = {};
  //     if (search) {
  //       where.OR = [
  //         { firstName: { contains: search, mode: 'insensitive' } },
  //         { lastName: { contains: search, mode: 'insensitive' } },
  //         { phoneNumber: { contains: search, mode: 'insensitive' } },
  //       ];
  //     }
  //     if (typeof isActive === 'boolean') {
  //       where.isActive = isActive;
  //     }

  //     const [data, total] = await this.prisma.$transaction([
  //       this.prisma.master.findMany({
  //         where,
  //         include: { masterProfessions: true },
  //         orderBy: { [sortBy]: sortOrder },
  //         skip: (page - 1) * limit,
  //         take: +limit,
  //       }),
  //       this.prisma.master.count({ where }),
  //     ]);

  //     // if (!data.length) {
  //     //   throw new NotFoundException('Masters not found.');
  //     // }

  //     return {
  //         total,
  //         currentPage: +page,
  //         totalPages: Math.ceil(total / +limit),
  //         data,
  //     };
  //   } catch (error) {
  //     this.handleError(error);
  //   }
  // }

  async findOne(id: string) {
    try {
      const master = await this.prisma.master.findUnique({
        where: { id },
        include: { masterProfessions: true },
      });
      if (!master) {
        throw new NotFoundException('Master not found with the provided ID.');
      }

      const masterRating = await this.calculateMasterRating(id);
      master['masterRating'] = masterRating;

      return master;
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(id: string, dto: UpdateMasterDto) {
    try {
      const existing = await this.prisma.master.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException('Master not found with the provided ID.');
      }

      const { img, passportImg, masterProfessions, ...body } = dto;

      if (img && existing.img && img !== existing.img) {
        await this.removeImage(existing.img);
      }
      if (passportImg && existing.passportImg && passportImg !== existing.passportImg) {
        await this.removeImage(existing.passportImg);
      }

      const updated = await this.prisma.master.update({
        where: { id },
        data: {
          ...body,
          img: img ?? existing.img,
          passportImg: passportImg ?? existing.passportImg,
        },
      });

      if (masterProfessions?.length) {
        let professionIds = masterProfessions.map(mp => mp.professionId).filter(id => id !== undefined);

        const validProfessions = await this.prisma.profession.findMany({
          where: { id: { in: professionIds } },
        });
        if (validProfessions.length !== professionIds.length) {
          throw new BadRequestException('One or more profession IDs are invalid.');
        }

        let levelIds = masterProfessions
          .filter(mp => mp.levelId)
          .map(mp => mp.levelId)
          .filter(id => id !== undefined);

        levelIds = Array.from(new Set(levelIds));

        if (levelIds.length) {
          const validLevels = await this.prisma.level.findMany({
            where: { id: { in: levelIds } },
          });
          if (validLevels.length !== levelIds.length) {
            throw new BadRequestException('One or more level IDs are invalid.');
          }
        }

        // Delete old masterProfessions and create new ones
        let deleted = await this.prisma.masterProfession.deleteMany({ where: { masterId: id } });
        const masterProfessionData = masterProfessions.map(mp => ({
          masterId: id,
          professionId: mp.professionId, 
          minWorkingHours: mp.minWorkingHours, 
          levelId: mp.levelId, 
          priceHourly: mp.priceHourly ?? 40000,
          priceDaily: mp.priceDaily ?? 400000, 
          experience: mp.experience ?? 2.5,
        }));
        const createdmasterProfessions = await this.prisma.masterProfession.createMany({ data: masterProfessionData });

        if (createdmasterProfessions.count !== 0) {
          const masterProfessions = await this.prisma.masterProfession.findMany({
            where: { masterId: id },
            include: { profession: true, level: true },
          })

          updated['masterProfessions'] = masterProfessions;
        }
      }

      return { data: updated };
    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(id: string) {
    try {
      const existing = await this.prisma.master.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException('Master not found.');
      }

      if (existing.img) {
        await this.removeImage(existing.img);
      }
      if (existing.passportImg) {
        await this.removeImage(existing.passportImg);
      }

      const data = await this.prisma.master.delete({ where: { id } });
      if (!data) {
        throw new BadRequestException('Failed to delete master.');
      }

      return { data };
    } catch (error) {
      this.handleError(error);
    }
  }

  private async removeImage(imgPath: string) {
    try {
      const filePath = path.join('uploads', imgPath);
      await fs.unlink(filePath);
    } catch (err) {
    }
  }

  private handleError(error: any) {
    if (
      error instanceof BadRequestException ||
      error instanceof NotFoundException ||
      error instanceof ConflictException
    ) {
      throw error;
    }
    console.error(error);
    throw new InternalServerErrorException('Internal server error');
  }

  private async calculateMasterRating(masterId: string) {
    const masterRating = await this.prisma.masterRatings.findMany({
      where: {
        masterId: masterId
      },
    })

    if (!masterRating.length) {
      return 0;
    }

    const totalRating = masterRating.reduce((acc, rating) => acc + rating.star, 0);
    const averageRating = totalRating / masterRating.length;
    return averageRating.toFixed(1);
  }

} 