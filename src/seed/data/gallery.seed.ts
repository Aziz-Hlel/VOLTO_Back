import { EntityType, GalleryTags, MediaPurpose, MediaStatus, PrismaClient } from "@prisma/client";
import { seedMedia } from "./media.seeds";


const prisma = new PrismaClient();


const images = [
  { 
    s3Key: `${EntityType.GALLERY}/1.jpg`,  
  id: "2f1a4c5d-8a19-4f68-90e0-24e9dcf3fa2b" },
  { 
    s3Key: `${EntityType.GALLERY}/2.jpg`,  
  id: "8c21a9f2-47a7-4a31-9c6a-32f81309c548" },
  { 
    s3Key: `${EntityType.GALLERY}/3.jpg`,  
  id: "c35fbb86-3b6c-4d17-9c62-7b7f0aaf8f20" },
  { 
    s3Key: `${EntityType.GALLERY}/4.jpg`,  
  id: "7e15cf4b-b812-4df0-a91b-3b2d2a6eac7b" },
  { 
    s3Key: `${EntityType.GALLERY}/5.jpg`,  
  id: "41e6f0c5-59b4-4cf1-8d6c-5a4f33db2c4f" },
  { 
    s3Key: `${EntityType.GALLERY}/6.jpg`,  
  id: "91b2c3a0-5a5e-4fd3-b2f7-43cfbc9fbb65" },
  { 
    s3Key: `${EntityType.GALLERY}/7.jpg`,  
  id: "ab9f6213-324d-4cbe-a6f4-b317eeb07ef2" },
  { 
    s3Key: `${EntityType.GALLERY}/8.jpg`,  
  id: "f27e0d11-676c-43b5-bdb8-9ab2b9d0d183" },
  { 
    s3Key: `${EntityType.GALLERY}/9.jpg`,  
  id: "0f7c4c96-0d8c-4c1a-b6fc-1b56a733b183" },
  { 
    s3Key: `${EntityType.GALLERY}/10.jpg`, 
  id: "6e41d9bb-2efc-4d54-bf45-407e23e3a2ac" },
  { 
    s3Key: `${EntityType.GALLERY}/11.jpg`, 
  id: "2d7fdd62-6c4c-4b9f-86c2-4a91dc1c5b6b" },
  { 
    s3Key: `${EntityType.GALLERY}/12.jpg`, 
  id: "f83a8d6f-0b44-4c72-9322-f2ff8a42d653" },
  { 
    s3Key: `${EntityType.GALLERY}/13.jpg`, 
  id: "b05af7c1-bc15-4f1e-9479-b123ecf0e23f" },
  { 
    s3Key: `${EntityType.GALLERY}/14.jpg`, 
  id: "d6bca6a2-f80f-47fb-9b77-fb3d6f68f7aa" },
  { 
    s3Key: `${EntityType.GALLERY}/15.jpg`, 
  id: "e3c7f0f4-b88d-45e8-92f3-893f6cfc2e72" },
  { 
    s3Key: `${EntityType.GALLERY}/16.jpg`, 
  id: "4a75a1d7-1a69-4cb3-bc3e-2f51c9fd6bda" },
  { 
    s3Key: `${EntityType.GALLERY}/17.jpg`, 
  id: "ecb5278b-ffcf-47e7-8c1e-7d7b5bdbb334" },
  { 
    s3Key: `${EntityType.GALLERY}/18.jpg`, 
  id: "8a640e19-8f4b-4974-8e63-36cb09b68840" },
  { 
    s3Key: `${EntityType.GALLERY}/19.jpg`, 
  id: "53c24468-27b2-43e4-9231-8a073e6f76d4" },
  { 
    s3Key: `${EntityType.GALLERY}/20.jpg`, 
  id: "0e93e9b0-234c-402d-94a1-1344dbd51e5d" },
  { 
    s3Key: `${EntityType.GALLERY}/21.jpg`, 
  id: "7d2cf3d8-82a7-4d93-9c3a-67de8fa163f1" },
  { 
    s3Key: `${EntityType.GALLERY}/22.jpg`, 
  id: "65cce523-74c0-47e2-802f-58c20e123eb6" },
  { 
    s3Key: `${EntityType.GALLERY}/23.jpg`, 
  id: "cf27ac5e-5c2d-4704-a32e-b47f71dbe839" },
  { 
    s3Key: `${EntityType.GALLERY}/24.jpg`, 
  id: "df7d46aa-9d0b-4f32-b4de-4ecac4b3d59b" },
  { 
    s3Key: `${EntityType.GALLERY}/25.jpg`, 
  id: "b870a94d-9268-4de5-9306-aba9dc1e28c3" },
  { 
    s3Key: `${EntityType.GALLERY}/26.jpg`, 
  id: "5e9410b0-19f2-4e30-aed4-ec09f7f4a617" },
  { 
    s3Key: `${EntityType.GALLERY}/27.jpg`, 
  id: "11d01461-8f89-4a67-8cc2-67a2e44b5ff5" },
  { 
    s3Key: `${EntityType.GALLERY}/28.jpg`, 
  id: "e6f2e11b-0dd9-4f21-8e91-b3a9816a6b52" },
  { 
    s3Key: `${EntityType.GALLERY}/29.jpg`, 
  id: "90a3d914-53d2-48d4-967d-90f8b4d5a2b1" },
  { 
    s3Key: `${EntityType.GALLERY}/30.jpg`, 
  id: "c62731a4-cb20-4d06-943a-037373c93055" },
  { 
    s3Key: `${EntityType.GALLERY}/31.jpg`, 
  id: "798a9f46-09b0-4565-8c14-fcb841b49ff0" },
];

type GalleryTag = typeof GalleryTags[keyof typeof GalleryTags];

function getRandomTag(): GalleryTag {
  const values = Object.values(GalleryTags);
  const randomIndex = Math.floor(Math.random() * values.length);
  return values[randomIndex];
}

export const seedGallery = async()=>{

    for (const image of images){

        const galleryInstance = await prisma.gallery.upsert({
            where: {
              id: image.id,
            },
            create: {
              id: image.id,
              tag: getRandomTag(),
            },
            update: {
              tag: getRandomTag(),
            },
          });
    
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