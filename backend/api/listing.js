import { prisma } from '../lib/prisma.js'

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const listings = await prisma.listing.findMany({
        include: { owner: { select: { id: true, fullName: true, email: true } } },
        orderBy: { createdAt: 'desc' }
      })
      return res.status(200).json(listings)
    }

    if (req.method === 'POST') {
      const { title, description, type, category, ownerId, images } = req.body
      const item = await prisma.listing.create({
        data: { title, description, type, category, ownerId: Number(ownerId), images: images || [] }
      })
      return res.status(201).json(item)
    }

    res.setHeader('Allow', ['GET', 'POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
}
