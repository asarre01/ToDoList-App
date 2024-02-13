// Importer le module mongoose qui permet d'interagir avec MongoDB
const mongoose = require('mongoose');

// Destructuration pour extraire les objets Schema et model de mongoose
const { Schema, model } = mongoose;

// Définir le schéma (structure) d'un todo
const todoSchema = new Schema({
    // Champ "description" du todo
    description: {
        type: String, // Type de données : chaîne de caractères
        required: true, // Champ obligatoire
        default: "Non spécifié" // Valeur par défaut si non spécifié
    },
    
    // Champ "isCompleted" du todo
    isCompleted: {
        type: Boolean, // Type de données : booléen
        required: true, // Champ obligatoire
        default: false // Valeur par défaut si non spécifié
    }
});

// Création d'un modèle "todo" basé sur le schéma défini
const todo = model('todo', todoSchema);

// Exporter le modèle pour qu'il puisse être utilisé dans d'autres fichiers
module.exports = todo;
