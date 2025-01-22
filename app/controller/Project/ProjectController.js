const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
exports.NewProject = async (req, res) => {
  const { attachment, type, description, companyName } = req.body;
console.log(attachment)
  try {
    const newProject = await prisma.project.create({
      data: {
        attachment:{
          create: attachment.map (file => ({
            attachment: file.toString (),
          })),
        },
        type,
        description,
        companyName,
      },
    });

    return res.status(201).json({ message: 'Project Created', project: newProject });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something Went Wrong' });
  }
};

exports.AllProject = async (req, res) => {
  try {
    const allProjects = await prisma.project.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include:{attachment:true}
    });
    return res.status(200).json({ all: allProjects });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something Went Wrong' });
  }
};

exports.UpdateProject = async (req, res) => {
  const {id, attachment, type, description, companyName } = req.body;

  try {
    const updatedProject = await prisma.project.update({
      where: {
        id: Number(id), // Convert ID to number if it's a string
      },
      data: {
        attachment,
        type,
        description,
        companyName,
      },
    });

    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    return res.status(200).json({ message: 'Project Updated', project: updatedProject });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something Went Wrong' });
  }
};

exports.DeleteProject = async (req, res) => {
  const { id } = req.query; // Assuming you're getting ID from URL params

  try {
    const deletedProjectAttachment = await prisma.projectattachment.deleteMany({
      where: {
        projectId: Number(id), // Convert ID to number if it's a string
      },
    });

    const deletedProject = await prisma.project.delete({
      where: {
        id: Number(id), // Convert ID to number if it's a string
      },
    });

    

    if (!deletedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }
    if (!deletedProjectAttachment) {
      return res.status(404).json({ message: 'Projectattachment not found' });
    }

    return res.status(200).json({ message: 'Project Deleted Successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something Went Wrong' });
  }
};