package apperrors

import "errors"

var (
	//Users
	ErrUserAlreadyExists = errors.New("user already exist")
	ErrInvalidCredentials=errors.New("invalid credentials")
	//Forms:
	ErrFormNotFound=errors.New("form not found")
	ErrFormNotPublic      = errors.New("form is not public")
    ErrQuestionFormNotFound   = errors.New("question does not belong to this form")
    ErrDuplicateAnswer    = errors.New("duplicate answer for question")
    ErrRequiredQuestion   = errors.New("required question is missing")
    ErrInvalidAnswer      = errors.New("invalid answer")
	//Questions:
	ErrQuestionNotFound=errors.New("Question not found")
	ErrInvalidPosition=errors.New("position must be sequential")
)
