package postgres

import (
	"tynoc_tech/Backend/internal/models"
	"tynoc_tech/Backend/internal/repository"

	"gorm.io/gorm"
)

type analyticsRepository struct {
	db *gorm.DB
}

func NewAnalyticsRepository(db *gorm.DB) repository.AnalyticsRepository {
	return &analyticsRepository{db: db}
}

func (r *analyticsRepository) GetSubmissionCount(formID int64) (int64, error) {
	var count int64

	err := r.db.Model(&models.Submission{}).
		Where("form_id = ?", formID).
		Count(&count).Error

	return count, err
}

func (r *analyticsRepository) GetAnswerCounts(formID int64) ([]repository.AnswerCount, error) {
	var counts []repository.AnswerCount

	err := r.db.Table("answers AS a").
		Select("a.question_id, a.answer, COUNT(*) AS count").
		Joins("JOIN submissions AS s ON s.id = a.submission_id").
		Where("s.form_id = ?", formID).
		Group("a.question_id, a.answer").
		Scan(&counts).Error

	return counts, err
}