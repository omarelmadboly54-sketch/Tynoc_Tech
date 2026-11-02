package presenters

import "tynoc_tech/Backend/internal/models"

type CreateFormReq struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description" binding:"required"`
	IsPublic    bool   `json:"is_public"`
}

func (c *CreateFormReq) ToForm() models.Form{
	return models.Form{
		Title: c.Title,
		Description: c.Description,
		IsPublic: c.IsPublic,
	}
}
