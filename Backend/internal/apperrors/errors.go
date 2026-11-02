package apperrors

import "errors"

var (
	//users
	ErrUserAlreadyExists = errors.New("user already exist")
	ErrInvalidCredentials=errors.New("invalid credentials")
	//forms:
	ErrFormNotFound=errors.New("form not found")
)