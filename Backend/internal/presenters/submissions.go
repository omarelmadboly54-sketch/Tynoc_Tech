package presenters


type CreateSubmissionReq struct{
	Answers				[]AnswerReq			`json:"answers" binding:"required"`
}
