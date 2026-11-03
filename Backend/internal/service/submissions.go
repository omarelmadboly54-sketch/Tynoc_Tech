package service

import (
	"fmt"
	"strings"
	"tynoc_tech/Backend/internal/apperrors"
	"tynoc_tech/Backend/internal/models"
	"tynoc_tech/Backend/internal/repository"
	"tynoc_tech/Backend/internal/utils"
)

type submissionService struct {
	SubmissionRepository repository.SubmissionRepository
	FormService          FormService
	QuestionService		 QuestionService
		
}

type SubmissionService interface {
	CreateSubmission(formID int64, answers []models.Answer) error
	GetSubmissionsByFormID(FormID int64,UserID int64,page int,limit int)([]repository.SubmissionWithAnswers,error)
}

func NewSubmissionService(SubmissionRepository repository.SubmissionRepository,FormService FormService,QuestionService QuestionService) SubmissionService {
	return &submissionService{
		SubmissionRepository: SubmissionRepository,
		FormService:          FormService,
		QuestionService: QuestionService,
	}
}

func (s *submissionService) CreateSubmission(form_id int64,answers []models.Answer) error {

    form,err := s.FormService.GetFormByID(form_id)
    if err != nil {
        return err
    }

	questions,err:=s.QuestionService.GetQuestionsByFormID(form.ID)
	if err!=nil{
		return err
	}

    questionsMap := make(map[int64]models.Question, len(questions))
    for _, question := range questions {
        questionsMap[question.ID] = question
    }

    submittedAnswers := make(map[int64]string, len(answers))

    for _, answer := range answers {
        question, exists := questionsMap[answer.QuestionID]
        if !exists {
            return fmt.Errorf(
                "%w: %d",
                apperrors.ErrQuestionFormNotFound,
                answer.QuestionID,
            )
        }

        if _, exists := submittedAnswers[answer.QuestionID]; exists {
            return fmt.Errorf(
                "%w: %d",
                apperrors.ErrDuplicateAnswer,
                answer.QuestionID,
            )
        }

        value := strings.TrimSpace(answer.Answer)

        if value == "" && !question.IsRequired {
            continue
        }

        if value == "" && question.IsRequired {
            return fmt.Errorf(
                "%w: %d",
                apperrors.ErrRequiredQuestion,
                answer.QuestionID,
            )
        }

        if err := utils.ValidateAnswer(question, value); err != nil {
            return fmt.Errorf(
                "%w: question %d: %v",
                apperrors.ErrInvalidAnswer,
                answer.QuestionID,
                err,
            )
        }

        submittedAnswers[answer.QuestionID] = value
    }

    for _, question := range questions {
        if question.IsRequired {
            if _, exists := submittedAnswers[question.ID]; !exists {
                return fmt.Errorf(
                    "%w: %d",
                    apperrors.ErrRequiredQuestion,
                    question.ID,
                )
            }
        }
    }

    validAnswers := make([]models.Answer, 0, len(submittedAnswers))

    for questionID, value := range submittedAnswers {
        validAnswers = append(validAnswers, models.Answer{
            QuestionID: questionID,
            Answer:     value,
        })
    }

    submission := models.Submission{
        FormID: form.ID,
    }

    if err := s.SubmissionRepository.CreateSubmission(&submission,validAnswers); err != nil {
        return err
    }

    return nil
}

func (s *submissionService)GetSubmissionsByFormID(FormID int64,UserID int64,page int,limit int)([]repository.SubmissionWithAnswers,error){
	form,err:=s.FormService.GetFormByUserID(FormID,UserID)
	if err!=nil{
		return nil,err
	}
	
	submissions,err:=s.SubmissionRepository.GetSubmissionsByFormID(form.ID,page,limit)
	if err!=nil{
		return nil,err
	}
	return submissions,nil
}