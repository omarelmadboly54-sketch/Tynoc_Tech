package repository

type AnalyticsRepository interface {
    GetSubmissionCount(formID int64) (int64, error)
    GetAnswerCounts(formID int64) ([]AnswerCount, error)
}

