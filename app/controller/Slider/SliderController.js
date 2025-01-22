const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
exports.NewSlider = async (req, res) => {
  const { attachment, description } = req.body;

  try {
    const newSlider = await prisma.slider.create({
      data: {
        attachment,
        description,
      },
    });

    return res.status(201).json({ message: 'Slider Created', slider: newSlider }); 
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something Went Wrong' });
  }
};

exports.AllSlider = async (req, res) => {
  try {
    const allSliders = await prisma.slider.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json({ all: allSliders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something Went Wrong' });
  }
};

exports.UpdateSlider = async (req, res) => {
  const {id, attachment, description } = req.body;

  try {
    const updatedSlider = await prisma.slider.update({
      where: {
        id: Number(id), 
      },
      data: {
        attachment,
        description,
      },
    });

    if (!updatedSlider) {
      return res.status(404).json({ message: 'Slider not found' });
    }

    return res.status(200).json({ message: 'Slider Updated', slider: updatedSlider });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something Went Wrong' });
  }
};

exports.DeleteSlider = async (req, res) => {
  const { id } = req.query; 

  try {
    const deletedSlider = await prisma.slider.delete({
      where: {
        id: Number(id), 
      },
    });

    if (!deletedSlider) {
      return res.status(404).json({ message: 'Slider not found' });
    }

    return res.status(200).json({ message: 'Slider Deleted Successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something Went Wrong' });
  }
};