// backend/src/index.ts
import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Интерфейсы
interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

interface RegisterRequestBody {
  email: string;
  password: string;
  username: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Middleware для проверки JWT
const authenticateToken: RequestHandler = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err: any, user: any) => {
    if (err) {
      res.status(403).json({ error: 'Invalid token' });
      return;
    }
    req.user = user;
    next();
  });
};

// Регистрация
const registerHandler: RequestHandler = async (
  req: Request<{}, {}, RegisterRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const { email, password, username } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      res.status(400).json({ 
        error: 'User with this email or username already exists' 
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        username: true,
      }
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
};

// Авторизация
const loginHandler: RequestHandler = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Error during login' });
  }
};

// Проверка авторизации
const checkAuthHandler: RequestHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        username: true
      }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error checking auth status' });
  }
};

// Регистрация маршрутов
app.post('/register', registerHandler);
app.post('/login', loginHandler);
app.get('/check-auth', authenticateToken, checkAuthHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});