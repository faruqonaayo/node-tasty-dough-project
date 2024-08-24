export function notFound(req, res, next) {
  res.status(404).render("error-views/404", { auth: req.isAuthenticated() });
}

export function serverError(error, req, res, next) {
  console.log(error);
  res.status(500).render("error-views/500", { auth: req.isAuthenticated() });
}
