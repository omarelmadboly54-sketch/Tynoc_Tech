package models

type FormAnalytics struct {
    TotalSubmissions int64               `json:"total_submissions"`
    Questions        []QuestionAnalytics `json:"questions"`
}

type QuestionAnalytics struct {
    QuestionID   int64             `json:"question_id"`
    QuestionText string            `json:"question_text"`
    QuestionType string            `json:"question_type"`
    TotalAnswers int64             `json:"total_answers"`
    Breakdown    []AnswerStatistic `json:"breakdown"`
}

type AnswerStatistic struct {
    Answer     string  `json:"answer"`
    Count      int64   `json:"count"`
    Percentage float64 `json:"percentage"`
}