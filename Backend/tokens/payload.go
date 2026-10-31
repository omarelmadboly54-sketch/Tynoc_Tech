package tokens

import (
	"errors"
	"time"
)

var (
	ErrInvalidToken = errors.New("token is invalid")
	ErrExpiredToken=errors.New("token is expired")
)

type Payload struct {
	Email 		string		`json:"email"`
	UserID		int64		`json:"user_id"`
	IssuedAt	time.Time	`json:"issued_at"`
	ExpiredAt	time.Time	`json:"expired_at"`
}

func NewPayloadToken(email string,user_id int64,duration time.Duration)(*Payload,error){
	Payload:=&Payload{
		Email: email,
		UserID: user_id,
		IssuedAt: time.Now(),
		ExpiredAt: time.Now().Add(duration),
	}
	return Payload,nil
}

func(p *Payload)Valid()error{
	if time.Now().After(p.ExpiredAt){
		return ErrExpiredToken
	}
	return nil
}

