import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Interfaces
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

interface MonobankDirectRequest {
  token: string;
  accountId?: string;
}

interface UpdateProfileRequestBody {
  username?: string;
}

interface ChangePasswordRequestBody {
  currentPassword: string;
  newPassword: string;
}

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// JWT Authentication Middleware
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

// Register
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

// Login
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

// Auth Check
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

// Update Profile (Username)
const updateProfileHandler: RequestHandler = async (
  req: AuthRequest & Request<{}, {}, UpdateProfileRequestBody>,
  res: Response
): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { username } = req.body;

    if (!username || username.trim().length === 0) {
      res.status(400).json({ error: 'Username is required' });
      return;
    }

    // Check if username is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        username: username.trim(),
        NOT: {
          id: req.user.id
        }
      }
    });

    if (existingUser) {
      res.status(400).json({ error: 'Username is already taken' });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { username: username.trim() },
      select: {
        id: true,
        email: true,
        username: true
      }
    });

    res.json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Error updating profile' });
  }
};

// Change Password
const changePasswordHandler: RequestHandler = async (
  req: AuthRequest & Request<{}, {}, ChangePasswordRequestBody>,
  res: Response
): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: 'Current password and new password are required' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ error: 'New password must be at least 6 characters long' });
      return;
    }

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Verify current password
    const validCurrentPassword = await bcrypt.compare(currentPassword, user.password);

    if (!validCurrentPassword) {
      res.status(400).json({ error: 'Current password is incorrect' });
      return;
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedNewPassword }
    });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Error changing password' });
  }
};

// Get Monobank Client Info directly with token
const getMonobankClientInfoHandler: RequestHandler = async (
  req: Request<{}, {}, MonobankDirectRequest>,
  res: Response
): Promise<void> => {
  try {
    const { token } = req.body;
    
    if (!token || token.trim() === '') {
      res.status(400).json({ error: 'Monobank token is required' });
      return;
    }

    try {
      const response = await axios.get('https://api.monobank.ua/personal/client-info', {
        headers: {
          'X-Token': token.trim()
        }
      });

      res.json({
        success: true,
        clientInfo: response.data
      });
    } catch (apiError: any) {
      console.error('Monobank API error:', apiError.response?.data || apiError.message);
      console.error('Status code:', apiError.response?.status);
      
      res.status(apiError.response?.status || 400).json({ 
        error: 'Failed to fetch Monobank client info',
        details: apiError.response?.data || apiError.message
      });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Error fetching Monobank client info' });
  }
};

// Get Monobank Transactions directly with token
const getMonobankTransactionsDirectHandler: RequestHandler = async (
  req: Request<{}, {}, MonobankDirectRequest>,
  res: Response
): Promise<void> => {
  try {
    const { token, accountId } = req.body;
    
    if (!token || token.trim() === '') {
      res.status(400).json({ error: 'Monobank token is required' });
      return;
    }
    
    if (!accountId || accountId.trim() === '') {
      res.status(400).json({ error: 'Account ID is required' });
      return;
    }
    
    // Calculate timestamp for one month ago (Unix timestamp in seconds)
    const from = Math.floor((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000);
    const to = Math.floor(Date.now() / 1000);

    try {
      const response = await axios.get(`https://api.monobank.ua/personal/statement/${accountId.trim()}/${from}/${to}`, {
        headers: {
          'X-Token': token.trim()
        },
        timeout: 15000
      });

      res.json({
        success: true,
        transactions: response.data
      });
    } catch (apiError: any) {
      console.error('Monobank API error:', apiError.response?.data || apiError.message);
      console.error('Status code:', apiError.response?.status);
      
      res.status(apiError.response?.status || 400).json({ 
        error: 'Failed to fetch Monobank transactions',
        details: apiError.response?.data || apiError.message
      });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Error fetching Monobank transactions' });
  }
};

// Register routes
app.post('/register', registerHandler);
app.post('/login', loginHandler);
app.get('/check-auth', authenticateToken, checkAuthHandler);
app.put('/update-profile', authenticateToken, updateProfileHandler);
app.put('/change-password', authenticateToken, changePasswordHandler);
app.post('/monobank-info', getMonobankClientInfoHandler);
app.post('/monobank-transactions-direct', getMonobankTransactionsDirectHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});