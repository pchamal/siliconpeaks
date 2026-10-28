export function failure(code, message, status) {
    return { data: null, error: { code, message, ...(status === undefined ? {} : { status }) } };
}
export function timeout(value) {
    if (!Number.isInteger(value) || value < 1 || value > 30_000) {
        throw new Error("Heedeo timeoutMs must be an integer between 1 and 30000.");
    }
    return value;
}
export function pathPrefix(value) {
    if (!/^\/[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*$/.test(value)) {
        throw new Error("Heedeo path must be a local prefix such as /hd.");
    }
    return value;
}
export function isIdentification(value) {
    if (!value || typeof value !== "object")
        return false;
    const id = value;
    return (typeof id.token === "string" &&
        id.token.length > 0 &&
        typeof id.visitor_id === "string" &&
        typeof id.confidence === "number");
}
