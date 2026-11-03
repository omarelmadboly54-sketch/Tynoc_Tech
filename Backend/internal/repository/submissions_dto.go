package repository

import (
	"time"
	"tynoc_tech/Backend/internal/models"
)

type SubmissionWithAnswers struct {
	ID        			int64 				`json:"id"`
	CreatedAt 			time.Time			`json:"created_at"`
	Answers				[]models.Answer		`json:"answers"`	
}

