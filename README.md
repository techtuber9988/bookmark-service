# Bookmark Service

An HTTP service for saving bookmarks with proper validation at the boundary.

## Setup

```bash
npm install
npm start
```

The service runs on port 3000 by default. Set the `PORT` environment variable to change it.

## Endpoints

### POST /bookmarks

Create a new bookmark.

**Request body:**
```json
{
  "url": "https://example.com",
  "title": "Example Site",
  "description": "An example bookmark"
}
```

**Required fields:**
- `url` - Must be a valid URL with http or https protocol

**Optional fields:**
- `title` - Maximum 255 characters
- `description` - Maximum 1000 characters

**Responses:**
- `201 Created` - Bookmark created successfully
- `200 OK` - Bookmark already exists (returns existing bookmark)
- `400 Bad Request` - Validation failed

### GET /bookmarks

List all bookmarks.

**Response:** Array of bookmark objects

### GET /bookmarks/:id

Get a single bookmark by ID.

**Responses:**
- `200 OK` - Bookmark found
- `400 Bad Request` - Invalid ID format
- `404 Not Found` - Bookmark not found

### DELETE /bookmarks/:id

Delete a bookmark by ID.

**Responses:**
- `204 No Content` - Bookmark deleted
- `400 Bad Request` - Invalid ID format
- `404 Not Found` - Bookmark not found

## Validation

All validation errors return `400 Bad Request` with a structured response:

```json
{
  "error": "validation_failed",
  "fields": {
    "url": "must be a valid URL with http or https protocol",
    "title": "must be a string"
  }
}
```

### Validation rules:
- Request body must be a JSON object
- Unknown fields are rejected
- URL is required and must be valid
- Title and description are optional strings with length limits
- All failures are reported at once

## Duplicate Detection

**How repeats are recognized:** The service uses the URL as the unique identifier for bookmarks. When a create request arrives with a URL that already exists in the database, the service returns `200 OK` with the existing bookmark instead of creating a duplicate.

**Why this approach:** The URL is the natural unique identifier for a bookmark. Two bookmarks with the same URL are semantically the same resource, regardless of differences in title or description. This design:
1. Prevents data duplication
2. Makes the API idempotent - sending the same request twice produces the same result
3. Uses a database UNIQUE constraint as a safety net

## Error Handling

- All validation errors return 400 with field-specific messages
- Never returns 500 for malformed input
- Unhandled errors are caught and return a generic 500 response
- Request body size is limited to 10KB
