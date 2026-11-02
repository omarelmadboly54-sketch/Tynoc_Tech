package presenters

import (
	"tynoc_tech/Backend/internal/models"

	"gorm.io/datatypes"
)

type CreateQuestionReq struct {
	QuestionText 		string 				`json:"question_text" binding:"required"`
	QuestionType 		string 				`json:"question_type" binding:"required,oneof=text email multiple_choice yes_no"`
	Options      		datatypes.JSON		`json:"options"`
	Position            int					`json:"position" binding:"required"`
	IsRequired	        bool				`json:"is_required"`	
}


func(c *CreateQuestionReq)ToQuestion()models.Question{
	return models.Question{
		QuestionText: c.QuestionText,
		QuestionType: c.QuestionType,
		Options: c.Options,
		Position: c.Position,
		IsRequired: c.IsRequired,
	}
}
