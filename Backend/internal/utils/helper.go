package utils

import (
	"encoding/json"
	"fmt"
	"math"
	"net/mail"
	"strings"
	"tynoc_tech/Backend/internal/models"
	"tynoc_tech/Backend/internal/presenters"
)

func NewFormResponse(form *models.Form, questions []models.Question) presenters.FormResponse {
	response := presenters.FormResponse{
		ID:          form.ID,
		Title:       form.Title,
		Description: form.Description,
		Questions:   make([]presenters.QuestionResponse, 0, len(questions)),
	}

	for _, question := range questions {
		response.Questions = append(response.Questions, presenters.QuestionResponse{
			ID:           question.ID,
			QuestionText: question.QuestionText,
			QuestionType: question.QuestionType,
			Options:      question.Options,
			Position:     question.Position,
			IsRequired:   question.IsRequired,
		})
	}

	return response
}

func NewOwnerFormResponse(form *models.Form, questions []models.Question) presenters.OwnerFormResponse {
    response := presenters.OwnerFormResponse{
        ID:          form.ID,
        Title:       form.Title,
        Description: form.Description,
        IsPublic:    form.IsPublic,
        Questions:   make([]presenters.QuestionResponse, 0, len(questions)),
    }

    for _, question := range questions {
        response.Questions = append(response.Questions, presenters.QuestionResponse{
            ID:           question.ID,
            QuestionText: question.QuestionText,
            QuestionType: question.QuestionType,
            Options:      question.Options,
            Position:     question.Position,
            IsRequired:   question.IsRequired,
        })
    }

    return response
}



func ValidateAnswer(question models.Question, answer string) error {

    switch question.QuestionType {

    case "text":
        return nil

    case "email":
        parsed, err := mail.ParseAddress(answer)

        if err != nil || parsed.Address != answer {
            return fmt.Errorf(
                "invalid email for question %d",
                question.ID,
            )
        }

        return nil

    case "yes_no":
        if !strings.EqualFold(answer, "yes") &&
            !strings.EqualFold(answer, "no") {

            return fmt.Errorf(
                "invalid yes/no answer for question %d",
                question.ID,
            )
        }

        return nil

    case "multiple_choice":
        var options []string

        if err := json.Unmarshal(question.Options, &options); err != nil {
            return fmt.Errorf(
                "invalid options for question %d",
                question.ID,
            )
        }

        for _, option := range options {
            if answer == option {
                return nil
            }
        }

        return fmt.Errorf(
            "invalid option for question %d",
            question.ID,
        )

    default:
        return fmt.Errorf("unsupported question type")
    }
}



func BuildBreakdown(options []string,counts map[string]int64) []models.AnswerStatistic {

    var total int64

    for _, count := range counts {
        total += count
    }

    breakdown := make([]models.AnswerStatistic, 0, len(options))

    for _, option := range options {
        count := counts[option]

        var percentage float64

        if total > 0 {
            percentage = math.Round(
                float64(count) / float64(total) * 10000,
            ) / 100
        }

        breakdown = append(breakdown, models.AnswerStatistic{
            Answer:     option,
            Count:      count,
            Percentage: percentage,
        })
    }

    return breakdown
}