package service

import (
	"errors"
	"tynoc_tech/Backend/internal/apperrors"
	"tynoc_tech/Backend/internal/models"
	"tynoc_tech/Backend/internal/repository"

	"gorm.io/gorm"
)

type formService struct {
	FormRepository 		repository.FormRepository
	QuestionRepository 	repository.QuestionRepository
}

type FormService interface{
	CreateForm(form *models.Form,user_id int64)error
	GetFormByID(id int64)(form *models.Form,questions []models.Question,err error)
	GetAll()([]models.Form,error)
	GetFormByUserID(id int64,user_id int64)(*models.Form,[]models.Question,error)
	GetFormsByUserID(user_id int64)([]models.Form,error)
	DeleteFormByID(id int64,user_id int64)error
	UpdateFormStatus(form_id int64,user_id int64,is_public bool)error
}

func NewFormService(FormRepository repository.FormRepository,QuestionRepository repository.QuestionRepository)FormService{
	return &formService{
		FormRepository: FormRepository,
		QuestionRepository: QuestionRepository,
	}
}

func(s *formService)CreateForm(form *models.Form,user_id int64)error{
	form.CreatedBy=user_id
	return s.FormRepository.CreateForm(form)

}

func(s *formService)GetFormByID(id int64)(form *models.Form,questions []models.Question,err error){
	form,err=s.FormRepository.GetFormByID(id)
	if err!=nil{
		if errors.Is(err,gorm.ErrRecordNotFound){
			return nil,nil,apperrors.ErrFormNotFound
		}
		return nil,nil,err
	}
	if form.IsPublic==false{
		return nil,nil,apperrors.ErrFormNotFound
	}
	questions,err=s.QuestionRepository.GetAll(form.ID)
	if err!=nil{
		return nil,nil,err
	}
	return form,questions,nil
}



func(s *formService)GetAll()([]models.Form,error){
	return s.FormRepository.GetAll()
}

func(s *formService)GetFormByUserID(id int64,user_id int64)(*models.Form,[]models.Question,error){
	form,err:=s.FormRepository.GetFormByUserID(id,user_id)
	if err!=nil{
		if errors.Is(err,gorm.ErrRecordNotFound){
			return nil,nil,apperrors.ErrFormNotFound
		}
		return nil,nil,err
	}
	questions,err:=s.QuestionRepository.GetAll(form.ID)
	if err!=nil{
		return nil,nil,err
	}
	return form,questions,nil
}


func(s *formService)GetFormsByUserID(user_id int64)([]models.Form,error){
	return s.FormRepository.GetFormsByUserID(user_id)
}


func(s *formService)DeleteFormByID(id int64,user_id int64)error{
	form,err:=s.FormRepository.GetFormByUserID(id,user_id)
	if err!=nil{
		if errors.Is(err,gorm.ErrRecordNotFound){
			return apperrors.ErrFormNotFound
		}
		return err
	}
	if err=s.FormRepository.DeleteFormByID(form.ID,user_id);err!=nil{
		return err
	}
	return nil
}



func(s *formService)UpdateFormStatus(form_id int64,user_id int64,is_public bool)error{
	
	err:=s.FormRepository.UpdateFormStatus(form_id,user_id,is_public)
	if err!=nil{
		if errors.Is(err,gorm.ErrRecordNotFound){
			return apperrors.ErrFormNotFound
		}
		return err
	}

	return nil
}
