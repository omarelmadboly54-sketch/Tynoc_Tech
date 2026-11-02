package postgres

import (
	"tynoc_tech/Backend/internal/models"
	"tynoc_tech/Backend/internal/repository"

	"gorm.io/gorm"
)

type formRepository struct {
	db *gorm.DB
}

func NewFormRepository(db *gorm.DB)repository.FormRepository{
	return &formRepository{
		db: db,
	}
}

func(r *formRepository)CreateForm(form *models.Form)error{
	return r.db.Create(form).Error
}

func(r *formRepository)GetFormByID(id int64)(*models.Form,error){
	var form models.Form
	result:=r.db.Where("id=?",id).First(&form)
	if result.Error!=nil{
		return nil,result.Error
	}
	return &form,nil
}

func(r *formRepository)GetAll()([]models.Form,error){
	var forms []models.Form
	result:=r.db.Where("is_public",true).Find(&forms)
	if result.Error!=nil{
		return nil,result.Error
	}
	return forms,nil
}


func(r *formRepository)GetFormByUserID(id int64,user_id int64)(*models.Form,error){
	var form models.Form

	result:=r.db.Where("id=? AND created_by=?",id,user_id).First(&form)
	if result.Error!=nil{
		return nil,result.Error
	}
	return &form,nil

}

func(r *formRepository)GetFormsByUserID(user_id int64)([]models.Form,error){
	var forms []models.Form

	result:=r.db.Where("created_by=?",user_id).Find(&forms)

	if result.Error!=nil{
		return nil,result.Error
	}
	return forms,nil
}

func(r *formRepository)DeleteFormByID(id int64,user_id int64)error{
	return r.db.Where("id=? AND created_by=?",id,user_id).Delete(&models.Form{}).Error
}
