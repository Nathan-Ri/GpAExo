# Groupama

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.0.5.
Il répond à un exercice envoyé par Groupama

Il contient des dépences pour afficher un calendrier, un utilitaire front de composant, et NgRx pour le traitement des évènements du calendrier

## Tester le code

Après avoir cloné le projet :
```bash
npm install  # pour lancer l'installation des dépendences
ng serve # lancer l'application en local
ng test # lancer les tests unitaires
```

## Utilisation de l'application

### Création d'un évènement
Un calendrier s'affiche sur la page d'accueil, il représente l'année en cours, on peut parcourir les mois avec la barre de scrolling.
#
#### Pour ajouter un évènement : 

On peut cliquer gauche et glisser la souris pour selectionner une plage de jours sur laquelle rajouter un event.

On peut cliquer sur un jour pour un seul jour.

Une fenetre s'ouvre pour selectionner le projet (3 projets + vacances) et l'agent à affecter au projet.

En cliquant sur le bouton sauvgarder un évènement est créé.

#
#### Pour modifier un évènement : 

On peut cliquer sur un évènement pour modifier celui-ci, la fenetre s'ouvre pré-remplie avec les informations de l'évènement.

Il faut les modifier et sauvegarder pour mettre à jour l'évènement sur lequel on a cliqué.


