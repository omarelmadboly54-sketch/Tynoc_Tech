package service

import (
	"errors"
	"tynoc_tech/Backend/internal/apperrors"
	"tynoc_tech/Backend/internal/models"
	"tynoc_tech/Backend/internal/repository"

	"gorm.io/gorm"
)

type questionService struct {
	QuestionRepository repository.QuestionRepository
	FormRepository     repository.FormRepository
}

type QuestionService interface{
	CreateQuestion(question *models.Question,id int64,user_id int64)error
	GetAll(form_id int64,user_id int64)([]models.Question,error)
	DeleteQuestion(id int64,form_id int64,user_id int64)error

}

func NewQuestionService(Questionrepository repository.QuestionRepository,FormRepository repository.FormRepository)QuestionService{
	return &questionService{
		QuestionRepository: Questionrepository,
		FormRepository: FormRepository,
	}
}


func(s *questionService)CreateQuestion(question *models.Question,id int64,user_id int64)error{
	existing,err:=s.FormRepository.GetFormByUserID(id,user_id)
	if err!=nil{
		if errors.Is(err,gorm.ErrRecordNotFound){
			return apperrors.ErrFormNotFound
		}
		return err
	}
	if existing ==nil{
		return apperrors.ErrFormNotFound
	}

	question.FormID=id

	err=s.QuestionRepository.CreateQuestion(question)
	if err!=nil{
		return err
	}
	return nil

}


func(s *questionService)GetAll(form_id int64,user_id int64)([]models.Question,error){

	form,err:=s.FormRepository.GetFormByUserID(form_id,user_id)
	if err!=nil{
		if errors.Is(err,gorm.ErrRecordNotFound){
			return nil,apperrors.ErrFormNotFound
		}
		return nil,err
	}

	questions,err:=s.QuestionRepository.GetAll(form.ID)
	if err!=nil{
		return nil,err
	}

	return questions,nil
}


func(s *questionService)DeleteQuestion(id int64,form_id int64,user_id int64)error{
	form,err:=s.FormRepository.GetFormByUserID(form_id,user_id)

	if err!=nil{
		if errors.Is(err,gorm.ErrRecordNotFound){
			return apperrors.ErrFormNotFound
		}
		return err
	}

	err=s.QuestionRepository.DeleteQuestion(id,form.ID)
	if err!=nil{
		if errors.Is(err,gorm.ErrRecordNotFound){
			return apperrors.ErrQuestionNotFound
		}
		return err
	}

	return nil
}

