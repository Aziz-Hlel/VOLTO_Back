import { INestApplication } from '@nestjs/common';
import path from 'path';
import * as fs from 'fs';
import axios from 'axios';
// import img from './img.jpg'; // Removed because TypeScript cannot import image files without proper configuration

type IuploadFile = {
  presignedUrl: string;
};

const uploadFile = async ({ presignedUrl }: IuploadFile) => {
  const filePath = path.join(__dirname, 'assets', 'img.jpg');
  const fileData = fs.readFileSync(filePath);

  const uploadRes = await axios.put(presignedUrl, fileData, {
    headers: {
      'Content-Type': 'image/png',
      'Content-Length': fileData.length,
    },
  });

  expect(uploadRes.status).toBe(200);
};

export default uploadFile;
