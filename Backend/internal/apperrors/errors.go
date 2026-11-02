package apperrors

import "errors"

var (
	//Users
	ErrUserAlreadyExists = errors.New("user already exist")
	ErrInvalidCredentials=errors.New("invalid credentials")
	//Forms:
	ErrFormNotFound=errors.New("form not found")
	//Questions:
	ErrQuestionNotFound=errors.New("Question not found")
)
