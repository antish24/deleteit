const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
exports.NewAward = async (req, res) => {
  const { type, companyName, attachment } = req.body;

  try {
    const newAward= await prisma.award.create({
      data: {
        type,
        companyName,
        attachment,
      },
    });

    return res.status(201).json({ message: 'Award Created', award: newAward });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something Went Wrong' });
  }
};

exports.AllAward = async (req, res) => {
  try {
    const allAwards = await prisma.award.findMany({
      orderBy: {
        createdAt: 'desc', 
      },
    });

    return res.status(200).json({ all: allAwards });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something Went Wrong' });
  }
};

exports.UpdateAward = async (req, res) => {
  const { id,attachment, type, companyName } = req.body;

  try {
    const updatedAward = await prisma.award.update({
      where: {
        id: Number(id), // Convert ID to number if it's a string
      },
      data: {
        attachment,
        type,
        companyName,
      },
    });

    if (!updatedAward) {
      return res.status(404).json({ message: 'Award not found' });
    }

    return res.status(200).json({ message: 'Award Updated', award: updatedAward });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something Went Wrong' });
  }
};

exports.DeleteAward = async (req, res) => {
    const { id } = req.query;
    // Assuming you're getting ID from URL params

  try {
    const deletedAward = await prisma.award.delete({
      where: {
        id: Number(id), // Convert ID to number if it's a string
      },
    });

    if (!deletedAward) {
      return res.status(404).json({ message: 'Award not found' });
    }

    return res.status(200).json({ message: 'Award Deleted Successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something Went Wrong' });
  }
};