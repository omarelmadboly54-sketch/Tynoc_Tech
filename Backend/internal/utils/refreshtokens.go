package utils

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
)

func GenerateRefreshToken() (string, string, error) {

	
    randomBytes := make([]byte, 32)

    _, err := rand.Read(randomBytes)
    if err != nil {
        return "", "", err
    }

    token := base64.RawURLEncoding.EncodeToString(randomBytes)

    hash := sha256.Sum256([]byte(token))
    tokenHash := hex.EncodeToString(hash[:])

    return token, tokenHash, nil
}

