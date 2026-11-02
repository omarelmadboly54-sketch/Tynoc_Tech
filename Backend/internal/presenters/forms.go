package presenters

import "tynoc_tech/Backend/internal/models"

type CreateFormReq struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description" binding:"required"`
	IsPublic    bool   `json:"is_public"`
}

type UpdateFormStatus struct{
	IsPublic		*bool		`json:"is_public" binding:"required"`
}


type FormResponse struct {
    ID          int64             `json:"id"`
    Title       string            `json:"title"`
    Description string            `json:"description"`
    Questions   []QuestionResponse `json:"questions"`
}

type OwnerFormResponse struct {
    ID          int64              `json:"id"`
    Title       string             `json:"title"`
    Description string             `json:"description"`
    IsPublic    bool               `json:"is_public"`
    Questions   []QuestionResponse `json:"questions"`
}

func (c *CreateFormReq) ToForm() models.Form{
	return models.Form{
		Title: c.Title,
		Description: c.Description,
		IsPublic: c.IsPublic,
	}
}
