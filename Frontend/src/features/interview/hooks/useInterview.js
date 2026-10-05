import {
    getAllInterviewReports as getAllInterviewReportsRequest,
    generateInterviewReport as generateInterviewReportRequest,
    getInterviewReportById as getInterviewReportByIdRequest,
    generateResumePdf as generateResumePdfRequest
} from "../services/interview.api"
import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context.js"
import { useParams } from "react-router"
import { getErrorMessage } from "../../../lib/api"


export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports, error, setError } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        setError("")
        try {
            const response = await generateInterviewReportRequest({ jobDescription, selfDescription, resumeFile })
            setReport(response.interviewReport)
            return response.interviewReport
        } catch (error) {
            setError(getErrorMessage(error, "Failed to generate interview report."))
            return null
        } finally {
            setLoading(false)
        }
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        setError("")
        try {
            const response = await getInterviewReportByIdRequest(interviewId)
            setReport(response.interviewReport)
            return response.interviewReport
        } catch (error) {
            setReport(null)
            setError(getErrorMessage(error, "Failed to load interview report."))
            return null
        } finally {
            setLoading(false)
        }
    }

    const getReports = async () => {
        setLoading(true)
        setError("")
        try {
            const response = await getAllInterviewReportsRequest()
            setReports(response.interviewReports)
            return response.interviewReports
        } catch (error) {
            setReports([])
            setError(getErrorMessage(error, "Failed to load interview reports."))
            return []
        } finally {
            setLoading(false)
        }
    }

    const getResumePdf = async (interviewReportId) => {
        setLoading(true)
        setError("")
        try {
            const response = await generateResumePdfRequest({ interviewReportId })
            const url = window.URL.createObjectURL(new Blob([ response ], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
            return true
        }
        catch (error) {
            setError(getErrorMessage(error, "Failed to download resume PDF."))
            return false
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        let isMounted = true

        const loadData = async () => {
            setLoading(true)
            setError("")

            try {
                if (interviewId) {
                    const response = await getInterviewReportByIdRequest(interviewId)

                    if (isMounted) {
                        setReport(response.interviewReport)
                    }
                } else {
                    const response = await getAllInterviewReportsRequest()

                    if (isMounted) {
                        setReports(response.interviewReports)
                    }
                }
            } catch (error) {
                if (!isMounted) {
                    return
                }

                if (interviewId) {
                    setReport(null)
                    setError(getErrorMessage(error, "Failed to load interview report."))
                } else {
                    setReports([])
                    setError(getErrorMessage(error, "Failed to load interview reports."))
                }
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        loadData()

        return () => {
            isMounted = false
        }
    }, [ interviewId, setError, setLoading, setReport, setReports ])

    return { loading, report, reports, error, generateReport, getReportById, getReports, getResumePdf }

}
