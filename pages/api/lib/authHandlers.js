// api/lib/authHandlers.js
import prisma from './prismaClient.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function registerUser({ email, password }) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  // adjust to match your prisma schema
  const user = await prisma.user.create({
    data: { email, password: hash }
  });
  return user;
}

export async function checkCredentials({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.password);
  return ok ? user : null;
}

// Add other helpers you need...
