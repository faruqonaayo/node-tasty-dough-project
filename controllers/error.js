export function notFound(req, res, next) {
  res.status(404).render("error-views/404", { auth: req.isAuthenticated() });
}
