package postgres

import (
	"errors"
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

func (r *questionRepository) CountQuestionsByFormID(formID int64) (int64, error) {
    var count int64
    err := r.db.Model(&models.Question{}).Where("form_id = ?", formID).Count(&count).Error
    return count, err
}


func (r *questionRepository) DeleteQuestion(id int64, form_id int64) error {
    return r.db.Transaction(func(tx *gorm.DB) error {
    
        var question models.Question
        if err := tx.Where("id = ? AND form_id = ?", id, form_id).First(&question).Error; err != nil {
            if errors.Is(err, gorm.ErrRecordNotFound) {
                return gorm.ErrRecordNotFound
            }
            return err
        }

        
        if err := tx.Delete(&question).Error; err != nil {
            return err
        }

        
        if err := tx.Model(&models.Question{}).
            Where("form_id = ? AND position > ?", form_id, question.Position).
            Update("position", gorm.Expr("position - 1")).Error; err != nil {
            return err
        }

        return nil
    })
}

