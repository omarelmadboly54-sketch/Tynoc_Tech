package repository


type AnswerCount struct {
    QuestionID int64  `gorm:"column:question_id"`
    Answer     string `gorm:"column:answer"`
    Count      int64  `gorm:"column:count"`
}