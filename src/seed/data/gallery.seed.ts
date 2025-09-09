import { EntityType, GalleryTags, MediaPurpose, MediaStatus, PrismaClient } from "@prisma/client";
import { seedMedia } from "./media.seeds";


const prisma = new PrismaClient();


const images = [
    { s3Key: `${EntityType.GALLERY}/1.jpg`,  },
    { s3Key: `${EntityType.GALLERY}/2.jpg`,  },
    { s3Key: `${EntityType.GALLERY}/3.jpg`,  },
    { s3Key: `${EntityType.GALLERY}/4.jpg`,  },
    { s3Key: `${EntityType.GALLERY}/5.jpg`,  },
    { s3Key: `${EntityType.GALLERY}/6.jpg`,  },
    { s3Key: `${EntityType.GALLERY}/7.jpg`,  },
    { s3Key: `${EntityType.GALLERY}/8.jpg`,  },
    { s3Key: `${EntityType.GALLERY}/9.jpg`,  },
    { s3Key: `${EntityType.GALLERY}/10.jpg`,  },
    { s3Key: `${EntityType.GALLERY}/11.jpg`,  },
    { s3Key: `${EntityType.GALLERY}/12.jpg`,  },
    { s3Key: `${EntityType.GALLERY}/13.jpg`,  },
    { s3Key: `${EntityType.GALLERY}/14.jpg`,  },
    { s3Key: `${EntityType.GALLERY}/15.jpg`,  },
    { s3Key: `${EntityType.GALLERY}/16.jpg`,  },
    { s3Key: `${EntityType.GALLERY}/17.jpg`,  },
    { s3Key: `${EntityType.GALLERY}/18.jpg`,  },
    { s3Key: `${EntityType.GALLERY}/19.jpg`,  },
    { s3Key: `${EntityType.GALLERY}/20.jpg`,  },
    { s3Key: `${EntityType.GALLERY}/21.jpg`,  },
    { s3Key: `${EntityType.GALLERY}/22.jpg`,  },
    { s3Key: `${EntityType.GALLERY}/23.jpg`,  },
    { s3Key: `${EntityType.GALLERY}/24.jpg`,  },
    { s3Key: `${EntityType.GALLERY}/25.jpg`,  },
    { s3Key: `${EntityType.GALLERY}/26.jpg`,  },
    { s3Key: `${EntityType.GALLERY}/27.jpg`,  },
    { s3Key: `${EntityType.GALLERY}/28.jpg`,  },
    { s3Key: `${EntityType.GALLERY}/29.jpg`,  },
    { s3Key: `${EntityType.GALLERY}/30.jpg`,  },
    { s3Key: `${EntityType.GALLERY}/31.jpg`,  },
]

type GalleryTag = typeof GalleryTags[keyof typeof GalleryTags];

function getRandomTag(): GalleryTag {
  const values = Object.values(GalleryTags);
  const randomIndex = Math.floor(Math.random() * values.length);
  return values[randomIndex];
}

export const seedGallery = async()=>{

    for (const image of images){

        const galleryInstance =await  prisma.gallery.create({
            data:{
                tag: getRandomTag(),
            }
        })
    
      const img =    await seedMedia({
              s3Key: image.s3Key,
              mimeType: 'image/jpeg',
              fileSize: 65257,
              fileType: '.jpg',
              originalName: 'image seeded',
              entityType: EntityType.GALLERY,
              mediaPurpose: MediaPurpose.IMAGE,
              status: MediaStatus.CONFIRMED,
              confirmedAt: null,
              entityId: galleryInstance.id,
         });
         console.log(`image : id ${img.s3Key} entangled with gallery id ${galleryInstance.id}`)
    }
}