package service

import (
	"encoding/json"
	"tynoc_tech/Backend/internal/models"
	"tynoc_tech/Backend/internal/repository"
	"tynoc_tech/Backend/internal/utils"
)

type analyticsService struct {
	AnalyticsRepository repository.AnalyticsRepository
	FormService         FormService
	QuestionService     QuestionService
}

type AnalyticsService interface {
	GetFormAnalytics(formID int64, userID int64) (*models.FormAnalytics, error)
}


func NewAnalyticsService(analyticsRepository repository.AnalyticsRepository,formService FormService,questionService QuestionService) AnalyticsService {
	return &analyticsService{
		AnalyticsRepository: analyticsRepository,
		FormService:         formService,
		QuestionService:     questionService,
	}
}

func (s *analyticsService) GetFormAnalytics(formID int64,userID int64) (*models.FormAnalytics, error) {

    
    _, err := s.FormService.GetFormByUserID(formID, userID)
    if err != nil {
        return nil, err
    }

    questions, err := s.QuestionService.GetQuestionsByFormID(formID)
    if err != nil {
        return nil, err
    }

    totalSubmissions, err := s.AnalyticsRepository.GetSubmissionCount(formID)
    if err != nil {
        return nil, err
    }

    answerCounts, err := s.AnalyticsRepository.GetAnswerCounts(formID)
    if err != nil {
        return nil, err
    }

    countsByQuestion := make(map[int64]map[string]int64)

    for _, item := range answerCounts {
        if countsByQuestion[item.QuestionID] == nil {
            countsByQuestion[item.QuestionID] = make(map[string]int64)
        }

        countsByQuestion[item.QuestionID][item.Answer] = item.Count
    }

    result := &models.FormAnalytics{
        TotalSubmissions: totalSubmissions,
        Questions:        make([]models.QuestionAnalytics, 0, len(questions)),
    }

    for _, question := range questions {
        questionCounts := countsByQuestion[question.ID]

        questionAnalytics := models.QuestionAnalytics{
            QuestionID:   question.ID,
            QuestionText: question.QuestionText,
            QuestionType: question.QuestionType,
            Breakdown:    []models.AnswerStatistic{},
        }

        switch question.QuestionType {
        case "yes_no":
            questionAnalytics.Breakdown = utils.BuildBreakdown(
                []string{"yes", "no"},
                questionCounts,
            )

        case "multiple_choice":
            var options []string

            if err := json.Unmarshal(question.Options, &options); err != nil {
                return nil, err
            }

            questionAnalytics.Breakdown = utils.BuildBreakdown(options, questionCounts)
        }

        for _, count := range questionCounts {
            questionAnalytics.TotalAnswers += count
        }

        result.Questions = append(result.Questions, questionAnalytics)
    }

    return result, nil
}