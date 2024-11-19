import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { Ad, AdCreateInput, AdUpdateInput } from "../entities/Ad";
import { validate } from "class-validator";
import { Tag } from "../entities/Tag";
import { In } from "typeorm";

@Resolver()
export class AdsResolver {
  @Query(() => [Ad])
  async ads(): Promise<Ad[]> {
    const ads = await Ad.find({
      relations: {
        category: true,
        tags: true,
      },
    });
    return ads;
  }

  @Query(() => Ad, { nullable: true })
  async ad(@Arg("id", () => ID) id: number): Promise<Ad | null> {
    const ad = await Ad.findOne({
      where: { id },
      relations: {
        category: true,
        tags: true,
      },
    });
    if (ad) {
      return ad;
    } else {
      return null;
    }
  }

  @Mutation(() => Ad)
  async createAd(
    @Arg("data", () => AdCreateInput) data: AdCreateInput
  ): Promise<Ad> {
    const newAd = new Ad();
    Object.assign(newAd, data);

    const errors = await validate(newAd);
    if (errors.length > 0) {
      throw new Error(`Validation error: ${JSON.stringify(errors)}`);
    } else {
      await newAd.save();
      return newAd;
    }
  }

  @Mutation(() => Ad, { nullable: true })
  async updateAd(
    @Arg("id", () => ID) id: number,
    @Arg("data", () => AdUpdateInput) data: AdUpdateInput
  ): Promise<Ad | null> {
    const ad = await Ad.findOne({ 
      where: { id },
      relations: {
        tags: true,
      },
    });
    if (ad !== null) {
      Object.assign(ad, data);

    // Si `data.tags` contient des tags, remplacer les objets par des instances réelles (car bug sur relation many to many pour l'update)
    if(data.tags && data.tags.length) {
      const tagIds = data.tags.map(tag => tag.id); // Extraire les IDs des tags
      const realtAgs = await Tag.findBy({id: In(tagIds)}) // Rechercher les tags correspondants dans la base de données
      ad.tags = realtAgs; // Remplacer les tags par les instances réelles
    }

      const errors = await validate(ad);
      if (errors.length > 0) {
        throw new Error(`Validation error: ${JSON.stringify(errors)}`);
      } else {
        await ad.save();
        return ad;
      }
    } else {
      return null;
    }
  }

  @Mutation(() => Ad, { nullable: true })
  async deleteAd(@Arg("id", () => ID) id: number): Promise<Ad | null> {
    const ad = await Ad.findOneBy({ id });
    if (ad !== null) {
      await ad.remove();
      Object.assign(ad, { id });
      return ad;
    } else {
      return null;
    }
  }
}
