package repository

import "tynoc_tech/Backend/internal/models"

type QuestionRepository interface {
	CreateQuestion(question *models.Question)error
	GetAll(form_id int64)([]models.Question,error)
	DeleteQuestion(id int64,form_id int64)error
}

