// Importer les bibliothèques nécessaires
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const todo = require('./models/todo'); // Import du modèle Todo depuis ./models/todo
const bodyParser = require('body-parser');
const cors = require('cors');
const { log } = require('console');
const server = express();

// Utilisation de CORS pour permettre les requêtes cross-origin
server.use(cors());

// Utilisation de body-parser pour analyser les corps de requête JSON
server.use(bodyParser.json());

// Charger les variables d'environnement depuis le fichier .env dans le dossier config
dotenv.config({ path: path.join(__dirname, 'config', '.env') });

// Stocker le port du serveur dans une variable
const port = process.env.PORT;

// Stocker l'URI de la base de données MongoDB Atlas dans une variable
const urlDatabase = process.env.MONGO_URI;

// Se connecter à la base de données en utilisant mongoose
mongoose.connect(urlDatabase)
    .then(() => {
        console.log('La base de données a été connectée avec succès.');

        // Démarrer le serveur express
        server.listen(port, () => {
            console.log(`Le serveur est en cours d'exécution sur le port ${port}`);
        });        
    })
    .catch((err) => {
        console.error(`Erreur lors de la connexion à la base de données : ${err}`);
});

// Route GET pour récupérer la liste des todos
server.get('/', async (req, res) => {
    try {
        const listTodos = await todo.find(); // Recherche tous les todos dans la base de données
        res.json(listTodos); // Envoyer la liste des todos au client au format JSON
    } catch (error) {
        res.status(500).json({ message: error.message }); // Gérer les erreurs
    }
});

// Route POST pour ajouter un nouvel todo
server.post('/todo/add', async (req, res) => {
    try {
        const addTodoData = new todo(req.body); // Créer une nouvelle instance de Todo avec les données reçues
        const addTodo = await addTodoData.save(); // Enregistrer le nouvel todo dans la base de données
        console.log('Todo enregistré avec succès :', addTodo); // Afficher un message de succès dans la console
        res.status(201).json(addTodo); // Répondre au client avec le nouvel todo créé au format JSON
    } catch (error) {
        res.status(500).json({ message: error.message }); // Gérer les erreurs
    }
});

// Route PUT pour modifier les données d'un todo
server.put('/todo/edit/:id', async (req, res) => {
    try {
        const id = req.params.id; // Récupérer l'ID du todo à modifier depuis les paramètres de la requête
        const updatedData = req.body; // Récupérer les données mises à jour depuis le corps de la requête
        const editedTodo = await todo.findByIdAndUpdate(id, updatedData, { new: true }); // Trouver et mettre à jour le todo dans la base de données
        console.log('Todo modifié avec succès :', editedTodo); // Afficher un message de succès dans la console
        res.status(200).json(editedTodo); // Répondre au client avec le todo mis à jour au format JSON
    } catch (error) {
        res.status(500).json({ message: error.message }); // Gérer les erreurs
    }
});

// Route DELETE pour supprimer un todo
server.delete('/todo/delete/:id', async (req, res) => {
    try {
        const id = req.params.id; // Récupérer l'ID du todo à supprimer depuis les paramètres de la requête
        const deletedTodo = await todo.findByIdAndDelete(id); // Trouver et supprimer le todo dans la base de données
        console.log('Todo supprimé avec succès :', deletedTodo); // Afficher un message de succès dans la console
        res.status(200).json(deletedTodo); // Répondre au client avec le todo supprimé au format JSON
    } catch (error) {
        res.status(500).json({ message: error.message }); // Gérer les erreurs
    }
});
