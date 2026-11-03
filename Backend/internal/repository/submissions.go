package repository

import "tynoc_tech/Backend/internal/models"

type SubmissionRepository interface {
	CreateSubmission(submission *models.Submission,answers []models.Answer)error
	GetSubmissionsByFormID(FormID int64,page int,limit int)([]SubmissionWithAnswers,error)
}