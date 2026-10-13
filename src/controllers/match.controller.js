import {
  matchStructured,
  matchCandidateAndJob,
} from "../services/match.service.js";

export const matchController = async (req, res, next) => {
  try {
    const jdText = req.body?.jdText;
    const resumeText = req.body?.resumeText;
    const jdData = req.body?.jdData;
    const resumeData = req.body?.resumeData;
    const resumeFile = req.file;

    // Case 1: Pre-parsed structured data matching
    if (jdData && resumeData) {
      const match = await matchStructured(jdData, resumeData);
      return res.status(200).json({
        success: true,
        data: {
          jd: jdData,
          resume: resumeData,
          match,
        },
      });
    }

    // Case 2: Raw JD text + PDF file or raw resume text
    if (!jdText) {
      return res.status(400).json({
        success: false,
        message: "Missing 'jdText' (or both 'jdData' and 'resumeData') in request",
      });
    }

    if (!resumeFile && !resumeText) {
      return res.status(400).json({
        success: false,
        message: "Missing candidate resume. Upload a PDF resume file or provide 'resumeText'",
      });
    }

    const result = await matchCandidateAndJob({
      jdText,
      resumeBuffer: resumeFile?.buffer,
      resumeText,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
