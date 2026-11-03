package postgres

import (
	"time"
	"tynoc_tech/Backend/internal/models"
	"tynoc_tech/Backend/internal/repository"

	"gorm.io/gorm"
)

type submissionRepository struct {
	db *gorm.DB
}


func NewSubmissionRepository(db *gorm.DB)repository.SubmissionRepository{
	return &submissionRepository{
		db: db,
	}
}

func(r *submissionRepository)CreateSubmission(submission *models.Submission,answers []models.Answer)error{
	return r.db.Transaction(func(tx *gorm.DB) error{

		if err:=tx.Create(submission).Error;err!=nil{
			return err
		}

		for i:=range answers{
			answers[i].SubmissionID=submission.ID
		}
		if len(answers)>0{
			if err:=tx.Create(&answers).Error;err!=nil{
				return err
			}
		}
		return nil

	})
}



func(r *submissionRepository)GetSubmissionsByFormID(FormID int64,page int,limit int)([]repository.SubmissionWithAnswers,error){

	type submissionAnswerRow struct {
    SubmissionID int64     `gorm:"column:submission_id"`
    CreatedAt    time.Time `gorm:"column:created_at"`
    AnswerID     *int64    `gorm:"column:answer_id"`
    QuestionID   *int64    `gorm:"column:question_id"`
    Answer       *string   `gorm:"column:answer"`
	}

	var rows []submissionAnswerRow

	offset := (page - 1) * limit

	subquery := r.db.Table("submissions").
		Select("id, created_at").
		Where("form_id = ?", FormID).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset)

	err := r.db.Table("(?) AS paginated_submissions", subquery).
		Select(`
			paginated_submissions.id AS submission_id,
			paginated_submissions.created_at,
			answers.id AS answer_id,
			answers.question_id,
			answers.answer
		`).
		Joins("LEFT JOIN answers ON answers.submission_id = paginated_submissions.id").
		Order("paginated_submissions.created_at DESC").
		Scan(&rows).Error

	if err != nil {
		return nil, err
	}

	submissionsMap := make(map[int64]int)
    submissions := make([]repository.SubmissionWithAnswers, 0)

    for _, row := range rows {
        index, exists := submissionsMap[row.SubmissionID]

        if !exists {
            submissions = append(submissions, repository.SubmissionWithAnswers{
                ID:        row.SubmissionID,
                CreatedAt: row.CreatedAt,
                Answers:   []models.Answer{},
            })

            index = len(submissions) - 1
            submissionsMap[row.SubmissionID] = index
        }

        if row.AnswerID != nil {
            submissions[index].Answers = append(
                submissions[index].Answers,
                models.Answer{
                    ID:           *row.AnswerID,
                    SubmissionID: row.SubmissionID,
                    QuestionID:   *row.QuestionID,
                    Answer:       *row.Answer,
                },
            )
        }
    }

    return submissions, nil
}



