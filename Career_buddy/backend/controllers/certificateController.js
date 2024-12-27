import Certificate from '../models/Certificate.js';

export const uploadCertificate = async (req, res) => {
  try {
    const { userId, description } = req.body;
    const newCertificate = new Certificate({
      filename: req.file.filename,
      path: req.file.path,
      originalName: req.file.originalname,
      userId,
      description
    });

    await newCertificate.save();
    res.status(201).json(newCertificate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
