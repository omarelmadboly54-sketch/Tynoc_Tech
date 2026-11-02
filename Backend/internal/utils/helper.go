package utils

import (
	"tynoc_tech/Backend/internal/models"
	"tynoc_tech/Backend/internal/presenters"
)

func NewFormResponse(form *models.Form, questions []models.Question) presenters.FormResponse {
	response := presenters.FormResponse{
		ID:          form.ID,
		Title:       form.Title,
		Description: form.Description,
		Questions:   make([]presenters.QuestionResponse, 0, len(questions)),
	}

	for _, question := range questions {
		response.Questions = append(response.Questions, presenters.QuestionResponse{
			ID:           question.ID,
			QuestionText: question.QuestionText,
			QuestionType: question.QuestionType,
			Options:      question.Options,
			Position:     question.Position,
			IsRequired:   question.IsRequired,
		})
	}

	return response
}

func NewOwnerFormResponse(form *models.Form, questions []models.Question) presenters.OwnerFormResponse {
    response := presenters.OwnerFormResponse{
        ID:          form.ID,
        Title:       form.Title,
        Description: form.Description,
        IsPublic:    form.IsPublic,
        Questions:   make([]presenters.QuestionResponse, 0, len(questions)),
    }

    for _, question := range questions {
        response.Questions = append(response.Questions, presenters.QuestionResponse{
            ID:           question.ID,
            QuestionText: question.QuestionText,
            QuestionType: question.QuestionType,
            Options:      question.Options,
            Position:     question.Position,
            IsRequired:   question.IsRequired,
        })
    }

    return response
}
