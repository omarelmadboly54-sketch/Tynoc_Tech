package presenters

import "tynoc_tech/Backend/internal/models"

type AnswerReq struct {
	QuestionID int64  `json:"question_id" binding:"required"`
	Answer     string `json:"answer"`
}

func (req *CreateSubmissionReq) ToAnswers() []models.Answer {
    answers := make([]models.Answer, 0, len(req.Answers))

    for _, answer := range req.Answers {
        answers = append(answers, models.Answer{
            QuestionID: answer.QuestionID,
            Answer:     answer.Answer,
        })
    }

    return answers
}
