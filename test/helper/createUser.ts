import { PrismaService } from 'src/prisma/prisma.service';
import bcrypt from 'bcrypt';
import { IregisterTestUser, registerTestUser } from '../vars/testUser';

type TcreateUser = {
  prisma: PrismaService;
  user?: IregisterTestUser;
};

const createUser = async ({ prisma, user = registerTestUser }: TcreateUser) => {
  const payload = await prisma.user.create({
    data: {
      email: user.email,
      username: user.username,
      password: await bcrypt.hash(user.password, 10),
    },
  });

  return payload;
};

export default createUser;
