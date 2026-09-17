const URL_MAX_LENGTH = 2048;
const TITLE_MAX_LENGTH = 255;
const DESCRIPTION_MAX_LENGTH = 1000;

const isValidUrl = (string) => {
  try {
    const url = new URL(string);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
};

export const validateBookmark = (req, res, next) => {
  const errors = {};
  const body = req.body;

  if (!body || typeof body !== 'object') {
    return res.status(400).json({
      error: 'validation_failed',
      fields: { body: 'must be a JSON object' }
    });
  }

  const allowedFields = ['url', 'title', 'description'];
  const unknownFields = Object.keys(body).filter(key => !allowedFields.includes(key));
  if (unknownFields.length > 0) {
    unknownFields.forEach(field => {
      errors[field] = 'unknown field';
    });
  }

  if (!('url' in body)) {
    errors.url = 'required';
  } else if (typeof body.url !== 'string') {
    errors.url = 'must be a string';
  } else if (body.url.trim().length === 0) {
    errors.url = 'must not be empty';
  } else if (body.url.length > URL_MAX_LENGTH) {
    errors.url = `must be at most ${URL_MAX_LENGTH} characters`;
  } else if (!isValidUrl(body.url)) {
    errors.url = 'must be a valid URL with http or https protocol';
  }

  if ('title' in body) {
    if (typeof body.title !== 'string') {
      errors.title = 'must be a string';
    } else if (body.title.length > TITLE_MAX_LENGTH) {
      errors.title = `must be at most ${TITLE_MAX_LENGTH} characters`;
    }
  }

  if ('description' in body) {
    if (typeof body.description !== 'string') {
      errors.description = 'must be a string';
    } else if (body.description.length > DESCRIPTION_MAX_LENGTH) {
      errors.description = `must be at most ${DESCRIPTION_MAX_LENGTH} characters`;
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      error: 'validation_failed',
      fields: errors
    });
  }

  req.validatedBody = {
    url: body.url.trim(),
    title: body.title?.trim() || null,
    description: body.description?.trim() || null
  };

  next();
};

export const validateId = (req, res, next) => {
  const { id } = req.params;

  if (!/^\d+$/.test(id)) {
    return res.status(400).json({
      error: 'validation_failed',
      fields: { id: 'must be a positive integer' }
    });
  }

  req.validatedId = parseInt(id, 10);
  next();
};
