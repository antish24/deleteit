const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.NewNews = async (req, res) => {
  const { attachment, title, description } = req.body;

  try {
    const newNews = await prisma.news.create({
      data: {
        attachment,
        title,
        description,
      },
    });

    return res.status(201).json({ message: 'News Created', news: newNews });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something Went Wrong' });
  }
};

exports.AllNews = async (req, res) => {
  try {
    const allNews = await prisma.news.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json({ all: allNews });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something Went Wrong' });
  }
};

exports.UpdateNews = async (req, res) => {
  const { id,attachment, title, description } = req.body;

  try {
    const updatedNews = await prisma.news.update({
      where: {
        id: Number(id), // Convert ID to number if it's a string
      },
      data: {
        attachment,
        title,
        description,
      },
    });

    if (!updatedNews) {
      return res.status(404).json({ message: 'News not found' });
    }

    return res.status(200).json({ message: 'News Updated', news: updatedNews });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something Went Wrong' });
  }
};

exports.DeleteNews = async (req, res) => {
  const { id } = req.query; // Assuming you're getting ID from URL params

  try {
    const deletedNews = await prisma.news.delete({
      where: {
        id: Number(id), // Convert ID to number if it's a string
      },
    });

    if (!deletedNews) {
      return res.status(404).json({ message: 'News not found' });
    }

    return res.status(200).json({ message: 'News Deleted Successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something Went Wrong' });
  }
};