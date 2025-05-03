import express, { Request, Response, Router } from 'express';
import {User} from '../types/User';
import { PrismaClient } from '../generated/prisma';

const router: Router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findMany();
    res.json({ user });
  } catch (error) {
    console.error('Error fetching podcasts:', error);
    res.status(500).json({ error: 'Failed to retrieve podcasts' });
  }
});


router.post('/', async (req: Request, res: Response): Promise<void> => {
  const {email, password} = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are Required' });
    return;
  }

  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        password
      },
    });

    res.status(201).json({ user: newUser });
  } catch (error) {
    console.error('Error creating new user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;

  try {
    const deletedUser = await prisma.user.delete({
      where: {
        id: id,
      },
    });

    res.json({ message: 'User deleted', deletedUser });
  } catch (error) {
    console.error('Error deleting User:', error);
    res
      .status(404)
      .json({ error: 'User not found or could not be deleted' });
  }
});

export default router;