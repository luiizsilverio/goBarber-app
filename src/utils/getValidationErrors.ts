import { ValidationError } from 'yup';

interface Errors {
    [key: string]: string;
}

export default function getValidationErrors(err: ValidationError) {
    const errors: Errors = {};

    err.inner.forEach(error => {
        errors[error.path] = error.message;
    });

    return errors;
}
