package service

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"tynoc_tech/Backend/internal/apperrors"
	"tynoc_tech/Backend/internal/models"
	"tynoc_tech/Backend/internal/repository"

	"gorm.io/gorm"
)

type formService struct {
	FormRepository 			repository.FormRepository
}

type FormService interface{
	CreateForm(form *models.Form,user_id int64)error
	GetFormByID(id int64)(form *models.Form,err error)
	GetAll(page int,limit int)([]models.Form,error)
	GetFormByUserID(id int64,user_id int64)(*models.Form,error)
	GetFormsByUserID(user_id int64,page int,limit int)([]models.Form,error)
	DeleteFormByID(id int64,user_id int64)error
	UpdateFormStatus(form_id int64,user_id int64,is_public bool)error
	SetPublicID(FormID int64,userID int64)(string,error)
	GetFormByPublicID(publicID string)(*models.Form,error)
}

func NewFormService(FormRepository repository.FormRepository)FormService{
	return &formService{
		FormRepository: FormRepository,
	}
}

func(s *formService)CreateForm(form *models.Form,user_id int64)error{
	form.CreatedBy=user_id
	return s.FormRepository.CreateForm(form)

}

func(s *formService)GetFormByID(id int64)(form *models.Form,err error){
	form,err=s.FormRepository.GetFormByID(id)
	if err!=nil{
		if errors.Is(err,gorm.ErrRecordNotFound){
			return nil,apperrors.ErrFormNotFound
		}
		return nil,err
	}
	if form.IsPublic==false{
		return nil,apperrors.ErrFormNotFound
	}
	return form,nil
}


func(s *formService)GetAll(page int,limit int)([]models.Form,error){
	return s.FormRepository.GetAll(page,limit)
}


func(s *formService)GetFormByUserID(id int64,user_id int64)(*models.Form,error){
	form,err:=s.FormRepository.GetFormByUserID(id,user_id)
	if err!=nil{
		if errors.Is(err,gorm.ErrRecordNotFound){
			return nil,apperrors.ErrFormNotFound
		}
		return nil,err
	}

	return form,nil
}


func(s *formService)GetFormsByUserID(user_id int64,page int,limit int)([]models.Form,error){
	return s.FormRepository.GetFormsByUserID(user_id,page,limit)
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

func(s *formService)SetPublicID(FormID int64,userID int64)(string,error){
	form,err:=s.FormRepository.GetFormByUserID(FormID,userID)
	if err!=nil{
		if errors.Is(err,gorm.ErrRecordNotFound){
			return "",apperrors.ErrFormNotFound
		}
		return "",err
	}

	if form.PublicID!=""{
		return form.PublicID,nil
	}

	randomBytes:=make([]byte,16)

	if _,err:=rand.Read(randomBytes);err!=nil{
		return "",err
	}

	publicID:=hex.EncodeToString(randomBytes)

	if err:=s.FormRepository.SetPublicID(FormID,publicID);err!=nil{
		return "",err
	}
	return publicID,nil
}


func(s *formService)GetFormByPublicID(publicID string)(*models.Form,error){
	form,err:=s.FormRepository.GetFormByPublicID(publicID)
	if err!=nil{
		if errors.Is(err,gorm.ErrRecordNotFound){
			return nil,apperrors.ErrFormNotFound
		}
		return nil,err
	}

	if !form.IsPublic{
		return nil,apperrors.ErrFormNotFound
	}
	return form,nil
}
