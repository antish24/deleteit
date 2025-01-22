
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file)
      return res.status (401).json ({message: 'Please Upload Photo'});
    else
      return res
        .status (200)
        .json ({name: req.file, message: 'Photo Upload Success'});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Sth Went Wrong'});
  }
};
const {PrismaClient} = require ('@prisma/client');
const prisma = new PrismaClient ();
const xlsx = require ('xlsx');
const fs = require ('fs').promises;
const path = require ('path');
const fss = require ('fs');

exports.UploadPhoto = async (req, res) => {
  try {
    if (!req.file)
      return res.status (401).json ({message: 'Please Upload Photo'});
    else
      return res
        .status (200)
        .json ({name: req.file, message: 'Photo Upload Success'});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Sth Went Wrong'});
  }
};

exports.UploadVideo = async (req, res) => {
  try {
    if (!req.file)
      return res.status (401).json ({message: 'Please Upload Video'});
    else
      return res
        .status (200)
        .json ({name: req.file, message: 'Video Upload Success'});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Sth Went Wrong'});
  }
};

exports.UploadPhotos = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status (400)
        .json ({message: 'Please upload at least one photo.'});
    }

    const uploadedFiles = req.files.map (file => ({
      name: file.filename,
    }));

    return res.status (200).json ({
      message: 'Photos uploaded successfully.',
      names: uploadedFiles,
    });
  } catch (error) {
    console.error ('Error uploading photos:', error);
    return res
      .status (500)
      .json ({message: 'Something went wrong while uploading photos.'});
  }
};

exports.UploadVideos = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status (400)
        .json ({message: 'Please upload at least one video.'});
    }

    const uploadedFiles = req.files.map (file => ({
      name: file.filename,
      path: file.path,
    }));

    return res.status (200).json ({
      message: 'Videos uploaded successfully.',
      names: uploadedFiles,
    });
  } catch (error) {
    console.error ('Error uploading videos:', error);
    return res
      .status (500)
      .json ({message: 'Something went wrong while uploading videos.'});
  }
};

exports.uploadMixedFiles = async (req, res) => {
  try {
    const files = req.files['files'] || [];

    if (!files.length) {
      return res.status (400).json ({message: 'No files uploaded.'});
    }

    const filesName = files.map (file => file.filename);

    console.log(files)
    return res.status (200).json ({
      message: 'Files uploaded successfully.',
      files: filesName,
    });
  } catch (error) {
    console.error (error);
    return res.status (500).json ({message: 'Something went wrong.'});
  }
};

const logFilePath = path.join (__dirname, 'systemlog.txt');

function logError (business, errorMessage) {
  const logEntry = {
    business: business + 2,
    error: errorMessage,
    timestamp: new Date ().toISOString (),
  };

  const logString = JSON.stringify (logEntry) + '\n';

  fs.appendFile (logFilePath, logString, err => {
    if (err) {
      console.error ('Error writing to log file:', err);
    } else {
      console.log ('Log entry added successfully.');
    }
  });
}

let processedCount = 0;
let processedErrorCount = 0;
let totalBusiness = 0;
const errors = [];

async function isDuplicateBusiness (businessName) {
  const existingBusiness = await prisma.business.findFirst ({
    where: {name: businessName},
  });
  return !!existingBusiness;
}

async function prepareEntries (items, model) {
  return Promise.all (
    items.map (async item => {
      let entry = await prisma[model].findFirst ({where: {name: item}});
      if (!entry) {
        entry = await prisma[model].create ({data: {name: item}});
      }
      return {id: entry.id};
    })
  );
}

async function findOrCreateSubCategory (categoryName, subCategoryName) {
  // Find the category
  let category = await prisma.category.findFirst ({
    where: {name: categoryName},
  });

  // If the category does not exist, create it
  if (!category) {
    category = await prisma.category.create ({
      data: {name: categoryName, description: ''},
    });
  }

  // Find the subcategory under the given category
  let subCategory = await prisma.subCategory.findFirst ({
    where: {name: subCategoryName, categoryId: category.id},
  });

  // If the subcategory does not exist, create it
  if (!subCategory) {
    subCategory = await prisma.subCategory.create ({
      data: {name: subCategoryName, categoryId: category.id, description: ''},
    });
  }

  return subCategory.id; // Return the subCategoryId
}

exports.ImportBusinessCSV = async (req, res) => {
  const filePath = path.join (__dirname, '../../../', req.file.path);
  errors.length = 0;
  totalBusiness = 0;
  processedCount = 0;
  processedErrorCount = 0;

  try {
    const workbook = xlsx.readFile (filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const businesses = xlsx.utils.sheet_to_json (sheet);
    totalBusiness = businesses.length;

    res.status (200).json ({totalBusiness});

    for (const business of businesses) {
      try {
        if (await isDuplicateBusiness (business.name)) {
          errors.push ({
            business: processedCount,
            error: 'Duplicate Business found.',
          });
          processedCount++;
          continue;
        }

        // Handle category and subcategory
        const subCategoryId = await findOrCreateSubCategory (
          business.category, // Assuming the category column in the CSV is named 'category'
          business.subCategory // Assuming the subcategory column in the CSV is named 'subCategory'
        );

        // Process keywords, services, and access (comma-separated strings)
        const keywords = business.keywords
          ? business.keywords.split (',').map (k => k.trim ())
          : [];
        const services = business.services
          ? business.services.split (',').map (s => s.trim ())
          : [];
        const access = business.access
          ? business.access.split (',').map (a => a.trim ())
          : [];

        const preparedKeywords = await prepareEntries (
          keywords,
          'businessKeyworks'
        );
        const preparedServices = await prepareEntries (
          services,
          'businessServices'
        );
        const preparedAccess = await prepareEntries (access, 'businessAccess');

        // Handle gallery items
        const galleryItems = [
          ...(business.photos
            ? business.photos.split (',').map (p => ({name: p.trim ()}))
            : []),
          ...(business.videos
            ? business.videos.split (',').map (v => ({name: v.trim ()}))
            : []),
        ];

        await prisma.business.create ({
          data: {
            name: business.name,
            description: business.description || '',
            logo: business.logo || '',
            subCategoryId: subCategoryId, // Use the subCategoryId obtained
            keywords: {connect: preparedKeywords},
            services: {connect: preparedServices},
            access: {connect: preparedAccess},
            rating: {create: {rate: 0}},
            address: {
              create: {
                email: business.email || '',
                website: business.website || '',
                phone: business.phone || '',
                otherPhone: business.otherPhone || '',
                mapUrl: business.mapUrl || '',
                location: business.location || '',
                city: business.city || '',
                subCity: business.subCity || '',
              },
            },
            gallery: {
              create: galleryItems.map (item => ({
                name: item.name,
              })),
            },
            workingHour: {
              create: business.workingHour
                ? business.workingHour
                    .split (',')
                    .map (wh => wh.trim ())
                    .map (item => ({
                      description: item,
                    }))
                : [],
            },
          },
        });

        processedCount++;
      } catch (error) {
        errors.push ({business: processedCount, error: error.message});
        logError (processedCount, error.message);
        processedCount++;
        processedErrorCount++;
      }
    }

    await fs.unlink (filePath);
  } catch (error) {
    console.error ('Error importing businesses:', error);
    res
      .status (500)
      .json ({message: 'Error importing businesses', error: error.message});
  }
};

exports.getProgress = (req, res) => {
  res
    .status (200)
    .json ({processedCount, processedErrorCount, totalBusiness, errors});
};

exports.LogsD = async (req, res) => {
  const logFilePath = path.join (__dirname, 'systemlog.txt');
  try {
    await fss.promises.writeFile (logFilePath, '');
    return res.status (200).json ({message: 'Log file Empty'});
  } catch (error) {
    return res.status (404).json ({message: 'Log file not found'});
  }
};
exports.Logs = async (req, res) => {
  try {
    // Define the path to the log file
    const logFilePath = path.join (__dirname, 'systemlog.txt');

    // Check if the file exists using fs.promises.access
    try {
      await fss.promises.access (logFilePath, fs.constants.F_OK);
    } catch (err) {
      return res.status (404).json ({message: 'Log file not found'});
    }

    // Send the log file as a download
    return res.download (logFilePath, 'systemlog.txt', err => {
      if (err) {
        console.error ('Error sending the file:', err);
        return res
          .status (500)
          .json ({message: 'Error downloading the log file'});
      }
    });
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Something went wrong'});
  }
};
