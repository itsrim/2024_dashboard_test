const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");

const app = express();

// Configuration de Passport
passport.use(
  new LocalStrategy((username, password, done) => {
    // Ici, vous devriez vérifier les informations d'identification dans votre base de données
    // C'est juste un exemple, n'utilisez pas cela en production
    if (username === "utilisateur" && password === "motdepasse") {
      return done(null, { id: 1, username: "utilisateur" });
    } else {
      return done(null, false, {
        message: "Nom d'utilisateur ou mot de passe incorrect",
      });
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // Ici, vous devriez récupérer l'utilisateur de votre base de données
  // C'est juste un exemple, n'utilisez pas cela en production
  done(null, { id: 1, username: "utilisateur" });
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(
  session({ secret: "secret-key", resave: false, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get("/", (req, res) => {
  res.send("Accueil");
});

app.get("/login", (req, res) => {
  res.send("Page de connexion");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// Middleware de vérification de l'authentification
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

app.get("/profil", isAuthenticated, (req, res) => {
  res.send(`Bienvenue, ${req.user.username}!`);
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
