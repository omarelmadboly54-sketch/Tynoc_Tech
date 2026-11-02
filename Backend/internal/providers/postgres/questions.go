package postgres

import (
	"tynoc_tech/Backend/internal/models"
	"tynoc_tech/Backend/internal/repository"

	"gorm.io/gorm"
)

type questionRepository struct {
	db *gorm.DB
}


func NewQuestionRepository(db *gorm.DB)repository.QuestionRepository{
	return &questionRepository{
		db: db,
	}
}

func(r *questionRepository)CreateQuestion(question *models.Question)error{
	return r.db.Create(question).Error
}

func(r *questionRepository)GetAll(form_id int64)([]models.Question,error){
	var questions []models.Question

	result:=r.db.Where("form_id=?",form_id).Order("position ASC").Find(&questions)
	
	if result.Error!=nil{
		return nil,result.Error
	}
	return questions,nil

}


func(r *questionRepository)DeleteQuestion(id int64,form_id int64)error{
	result:= r.db.Where("id=? AND form_id=?",id,form_id).Delete(&models.Question{})
	if result.Error!=nil{
		return result.Error
	}

	if result.RowsAffected==0{
		return gorm.ErrRecordNotFound
	}
	return nil
}

