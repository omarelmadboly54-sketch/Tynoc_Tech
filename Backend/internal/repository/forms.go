package repository

import "tynoc_tech/Backend/internal/models"

type FormRepository interface {
	CreateForm(form *models.Form) error
	GetFormByID(id int64)(*models.Form,error)
	GetAll(page int,limit int)([]models.Form,error)
	GetFormByUserID(id int64,user_id int64)(*models.Form,error)
	GetFormsByUserID(user_id int64,page int,limit int)([]models.Form,error)
	DeleteFormByID(id int64,user_id int64)error
	UpdateFormStatus(form_id int64,user_id int64,is_public bool)error
	SetPublicID(FormID int64,publicID string)error
	GetFormByPublicID(publicID string)(*models.Form,error)
}


