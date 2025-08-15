export function requireAuth(_req, _res, next) {
    // TODO: validate Supabase JWT and attach user to request
    next();
}
