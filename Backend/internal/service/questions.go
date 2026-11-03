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
	FormService     FormService
}

type QuestionService interface{
	CreateQuestion(question *models.Question,FormID int64,user_id int64)error
	GetAll(form_id int64,user_id int64)([]models.Question,error)
	GetQuestionsByFormID(formID int64) ([]models.Question, error)
	DeleteQuestion(id int64,form_id int64,user_id int64)error
}

func NewQuestionService(Questionrepository repository.QuestionRepository,FormService FormService)QuestionService{
	return &questionService{
		QuestionRepository: Questionrepository,
		FormService: FormService,
	}
}


func(s *questionService)CreateQuestion(question *models.Question,FormID int64,user_id int64)error{
	existing,err:=s.FormService.GetFormByUserID(FormID,user_id)
	if err!=nil{
		return err
	}
	if existing ==nil{
		return apperrors.ErrFormNotFound
	}

	question.FormID=existing.ID

	return s.QuestionRepository.CreateQuestion(question)

}


func(s *questionService)GetAll(form_id int64,user_id int64)([]models.Question,error){

	form,err:=s.FormService.GetFormByUserID(form_id,user_id)
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

func (s *questionService) GetQuestionsByFormID(formID int64) ([]models.Question, error) {
    return s.QuestionRepository.GetAll(formID)
}


func(s *questionService)DeleteQuestion(id int64,form_id int64,user_id int64)error{
	form,err:=s.FormService.GetFormByUserID(form_id,user_id)

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

