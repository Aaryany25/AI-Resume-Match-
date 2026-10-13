import { parseJD } from "../services/jd.service.js";

export const parseJdController = async (req, res, next) => {
  try {
    const { jdText } = req.body;

    if (!jdText) {
      return res.status(400).json({
        success: false,
        message: "Missing 'jdText' in request body",
      });
    }

    const data = await parseJD(jdText);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
