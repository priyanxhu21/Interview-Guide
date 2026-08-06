const pdfParse = require("pdf-parse")
const mongoose = require("mongoose")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")




/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    try {
        const { selfDescription, jobDescription } = req.body
        const trimmedJobDescription = jobDescription?.trim()
        const trimmedSelfDescription = selfDescription?.trim()

        if (!trimmedJobDescription) {
            return res.status(400).json({
                message: "Job description is required."
            })
        }

        if (!req.file && !trimmedSelfDescription) {
            return res.status(400).json({
                message: "Provide either a resume PDF or a self description."
            })
        }

        let resumeText = ""

        if (req.file) {
            const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
            resumeText = resumeContent.text
        }

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription: trimmedSelfDescription || "",
            jobDescription: trimmedJobDescription
        })

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription: trimmedSelfDescription || "",
            jobDescription: trimmedJobDescription,
            ...interViewReportByAi
        })

        return res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        })
    } catch (error) {
        console.error('generateInterViewReportController error:', error)
        return res.status(error.statusCode || 500).json({
            message: error.message || 'Failed to generate interview report.',
        })
    }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params

        if (!mongoose.Types.ObjectId.isValid(interviewId)) {
            return res.status(400).json({
                message: "Invalid interview report id."
            })
        }

        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        return res.status(200).json({
            message: "Interview report fetched successfully.",
            interviewReport
        })
    } catch (error) {
        console.error("getInterviewReportByIdController error:", error)
        return res.status(500).json({
            message: "Failed to fetch interview report.",
        })
    }
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params

        if (!mongoose.Types.ObjectId.isValid(interviewReportId)) {
            return res.status(400).json({
                message: "Invalid interview report id."
            })
        }

        const interviewReport = await interviewReportModel.findOne({
            _id: interviewReportId,
            user: req.user.id
        })

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        const { resume, jobDescription, selfDescription } = interviewReport

        const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
        })

        return res.send(pdfBuffer)
    } catch (error) {
        console.error('generateResumePdfController error:', error)
        return res.status(error.statusCode || 500).json({
            message: error.message || 'Failed to generate resume PDF.',
        })
    }
}

module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }
