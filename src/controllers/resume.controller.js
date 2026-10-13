import {
  parseResumeFromText,
  parseResumeFromPdfBuffer,
} from "../services/resume.service.js";

export const parseResumeController = async (req, res, next) => {
  try {
    // If a PDF file was uploaded via multer
    if (req.file) {
      const result = await parseResumeFromPdfBuffer(req.file.buffer);
      return res.status(200).json({
        success: true,
        fileName: req.file.originalname,
        data: result.data,
      });
    }

    // Otherwise check for raw resumeText in JSON body
    const { resumeText } = req.body;
    if (resumeText) {
      const data = await parseResumeFromText(resumeText);
      return res.status(200).json({
        success: true,
        data,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Please upload a PDF resume file or provide 'resumeText' in the body",
    });
  } catch (error) {
    next(error);
  }
};
