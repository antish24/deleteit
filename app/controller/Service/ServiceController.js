const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
exports.NewService = async (req, res) => {
  const { attachment, description, title } = req.body;

  try {
    const newService = await prisma.service.create({
      data: {
        attachment,
        description,
        title,
      },
    });

    return res.status(201).json({ message: 'Service Created', service: newService });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something Went Wrong' });
  }
};

exports.AllService = async (req, res) => {
  try {
    const allServices = await prisma.service.findMany({
      orderBy: {
        createdAt: 'desc', 
      },
    });

    return res.status(200).json({ all: allServices });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something Went Wrong' });
  }
};

exports.UpdateService = async (req, res) => {
  const {id, attachment, description, title } = req.body;

  try {
    const updatedService = await prisma.service.update({
      where: {
        id: Number(id), 
      },
      data: {
        attachment,
        description,
        title,
      },
    });

    if (!updatedService) {
      return res.status(404).json({ message: 'Service not found' });
    }

    return res.status(200).json({ message: 'Service Updated', service: updatedService });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something Went Wrong' });
  }
};

exports.DeleteService = async (req, res) => {
  const { id } = req.query; 

  try {
    const deletedService = await prisma.service.delete({
      where: {
        id: Number(id), 
      },
    });

    if (!deletedService) {
      return res.status(404).json({ message: 'Service not found' });
    }

    return res.status(200).json({ message: 'Service Deleted Successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something Went Wrong' });
  }
};