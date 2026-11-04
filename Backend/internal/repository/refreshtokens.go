package repository

import "tynoc_tech/Backend/internal/models"

type RefreshTokenRepository interface {
	Create(refreshToken *models.RefreshToken) error
	GetByTokenHash(tokenHash string) (*models.RefreshToken, error)
	Revoke(id int64) error
}
