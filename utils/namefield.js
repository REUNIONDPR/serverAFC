module.exports = {
    /*
        Fonction pour afficher un libellé en clair des filtres dans les exports excel
    */
    namefield: function (name) {

        switch (name) {
            case "individu_national": return "IDE national";
            case "agence_ref" : return "Agence Ref";
            case "n_Article" : return "N° Article";
            case "nb_place" : return "Nb place";
            case "date_entree_demandee" : return "Date entrée de session";
            case "date_DDINT1" : return "Date INT 1";
            case "date_DFINT1" : return "Date Fin INT 1";
            case "date_DDINT2" : return "Date INT 2";
            case "date_DFINT2" : return "Date Fin INT 2";
            case "date_fin" : return "Date fin de session";
            case "heure_centre" : return "Nb heure en centre";
            case "heure_entreprise" : return "Nb heure en entreprise";
            case "heure_max_session" : return "Nb heure max de la session";
            case "nConv" : return "N° conventionnement";
            case "date_etat" : return "Date";
            default: return name[0].toUpperCase() + name.slice(1);
        }
    }
}