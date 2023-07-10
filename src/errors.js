class Base64DecodingError extends Error {}
class Base64EncodingError extends Error {}
class DecryptionError extends Error {}
class EncryptionError extends Error {}
class HashingError extends Error {}
class RandomStringGenerationError extends Error {}

module.exports = {
  Base64DecodingError,
  Base64EncodingError,
  DecryptionError,
  EncryptionError,
  HashingError,
  RandomStringGenerationError,
}
