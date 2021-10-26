-- phpMyAdmin SQL Dump
-- version 4.6.0
-- http://www.phpmyadmin.net
--
-- Client :  localhost:3306
-- Généré le :  Mar 26 Octobre 2021 à 07:09
-- Version du serveur :  5.6.50
-- Version de PHP :  5.6.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `testreact`
--

-- --------------------------------------------------------

--
-- Structure de la table `adresse`
--

CREATE TABLE `adresse` (
  `id` int(11) NOT NULL,
  `commune` int(11) NOT NULL,
  `adresse` varchar(255) NOT NULL,
  `actif` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `ape`
--

CREATE TABLE `ape` (
  `id` int(11) NOT NULL,
  `libelle_ape` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `dt` varchar(10) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `attributaire`
--

CREATE TABLE `attributaire` (
  `id` int(11) NOT NULL,
  `libelle` varchar(255) NOT NULL,
  `siret` bigint(20) NOT NULL,
  `status` varchar(255) DEFAULT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `representant` varchar(255) DEFAULT NULL,
  `representantMail` varchar(255) DEFAULT NULL,
  `destinataire` varchar(255) NOT NULL,
  `destinataireMail` varchar(255) NOT NULL,
  `telephone` varchar(80) DEFAULT NULL,
  `telephone2` varchar(80) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `brs`
--

CREATE TABLE `brs` (
  `id` int(11) NOT NULL,
  `n_brs` varchar(255) NOT NULL,
  `n_conv` tinyint(1) NOT NULL,
  `filename` varchar(255) NOT NULL,
  `id_lot` int(11) DEFAULT NULL,
  `id_attributaire` int(11) NOT NULL,
  `modifie_brs` int(11) NOT NULL DEFAULT '0',
  `nouveauBRS` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `brs_compteur`
--

CREATE TABLE `brs_compteur` (
  `id` int(11) NOT NULL,
  `id_lot` int(11) NOT NULL,
  `nb` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `brs_etat`
--

CREATE TABLE `brs_etat` (
  `id` int(11) NOT NULL,
  `etat` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `brs_historique`
--

CREATE TABLE `brs_historique` (
  `id` int(11) NOT NULL,
  `id_brs` int(11) NOT NULL,
  `id_etat` int(11) NOT NULL,
  `date_etat` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `brs_modifie`
--

CREATE TABLE `brs_modifie` (
  `id` int(11) NOT NULL,
  `id_brs` int(11) NOT NULL,
  `id_sol` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `brs_sollicitation`
--

CREATE TABLE `brs_sollicitation` (
  `id_brs` int(11) NOT NULL,
  `id_sol` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `catalogue`
--

CREATE TABLE `catalogue` (
  `id` int(11) NOT NULL,
  `id_lot` int(11) NOT NULL,
  `n_Article` varchar(10) NOT NULL,
  `intitule_form_marche` varchar(255) NOT NULL,
  `intitule_form_base_article` varchar(255) NOT NULL,
  `formacode` varchar(255) NOT NULL,
  `niveau_form` int(11) DEFAULT NULL,
  `objectif_form` int(11) DEFAULT NULL,
  `nb_heure_socle` int(11) NOT NULL,
  `nb_heure_ent` varchar(5) DEFAULT NULL,
  `nb_heure_appui` int(11) NOT NULL DEFAULT '0',
  `nb_heure_soutien` varchar(5) NOT NULL DEFAULT '16,66',
  `prixTrancheA` float DEFAULT NULL,
  `prixTrancheB` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `catalogue_attributaire`
--

CREATE TABLE `catalogue_attributaire` (
  `id` int(11) NOT NULL,
  `id_cata` int(11) NOT NULL,
  `id_attributaire` int(11) NOT NULL,
  `priorite` int(11) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `catalogue_attributaire_commune`
--

CREATE TABLE `catalogue_attributaire_commune` (
  `id` int(11) NOT NULL,
  `id_cata_attr` int(11) NOT NULL,
  `id_commune` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `catalogue_attributaire_commune_adresse`
--

CREATE TABLE `catalogue_attributaire_commune_adresse` (
  `id` int(11) NOT NULL,
  `id_catalogue_attributaire_commune` int(11) NOT NULL,
  `id_adresse` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `catalogue_compteur`
--

CREATE TABLE `catalogue_compteur` (
  `id_cata` int(11) NOT NULL,
  `nb` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `commune`
--

CREATE TABLE `commune` (
  `id` int(11) NOT NULL,
  `libelle` varchar(80) NOT NULL,
  `cp` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `dispositif`
--

CREATE TABLE `dispositif` (
  `id` int(11) NOT NULL,
  `libelle` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `fonction`
--

CREATE TABLE `fonction` (
  `id` int(11) NOT NULL,
  `fonction` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `formation`
--

CREATE TABLE `formation` (
  `id` int(11) NOT NULL,
  `id_cata` int(11) NOT NULL,
  `idgasi` varchar(8) DEFAULT NULL,
  `agence_ref` int(11) DEFAULT NULL,
  `dispositif` int(11) DEFAULT '1',
  `n_Article` varchar(25) NOT NULL,
  `etat` int(11) NOT NULL,
  `nb_place` int(11) NOT NULL,
  `vague` int(11) NOT NULL,
  `adresse` int(11) DEFAULT NULL,
  `id_commune` int(11) NOT NULL,
  `date_creation` date NOT NULL,
  `date_entree_demandee` date NOT NULL,
  `date_entree_fixe` date NOT NULL,
  `date_DDINT1` date DEFAULT NULL,
  `date_DFINT1` date DEFAULT NULL,
  `date_DDINT2` date DEFAULT NULL,
  `date_DFINT2` date DEFAULT NULL,
  `date_fin` date NOT NULL,
  `heure_centre` int(11) NOT NULL,
  `heure_entreprise` int(11) NOT NULL,
  `heure_max_session` int(11) DEFAULT NULL,
  `nConv` varchar(80) DEFAULT NULL,
  `date_nConv` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `formation_commentaire`
--

CREATE TABLE `formation_commentaire` (
  `id` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `n_Article` varchar(25) COLLATE latin1_general_ci DEFAULT NULL,
  `idgasi` varchar(8) CHARACTER SET latin1 DEFAULT NULL,
  `commentaire` varchar(255) COLLATE latin1_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `formation_etat`
--

CREATE TABLE `formation_etat` (
  `id` int(11) NOT NULL,
  `libelle` varchar(100) NOT NULL,
  `tooltip` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `formation_historique_old`
--

CREATE TABLE `formation_historique_old` (
  `id` int(11) NOT NULL,
  `id_formation` int(11) NOT NULL,
  `id_etat` int(11) NOT NULL,
  `date_etat` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `information` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `lot`
--

CREATE TABLE `lot` (
  `id` int(11) NOT NULL,
  `libelle` varchar(255) NOT NULL,
  `n_marche` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `lot_bassin`
--

CREATE TABLE `lot_bassin` (
  `id` int(11) NOT NULL,
  `id_lot` int(11) NOT NULL,
  `bassin` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `lot_bassin_catalogue`
--

CREATE TABLE `lot_bassin_catalogue` (
  `id` int(11) NOT NULL,
  `id_lot_bassin` int(11) NOT NULL,
  `id_cata` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `niveau`
--

CREATE TABLE `niveau` (
  `id` int(11) NOT NULL,
  `libelle` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `objectif`
--

CREATE TABLE `objectif` (
  `id` int(11) NOT NULL,
  `libelle` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `sollicitation`
--

CREATE TABLE `sollicitation` (
  `id` int(11) NOT NULL,
  `id_formation` int(11) NOT NULL,
  `attributaire` int(11) NOT NULL,
  `dateMailOF` datetime NOT NULL,
  `dateRespOF` datetime DEFAULT NULL,
  `lieu_execution` int(11) DEFAULT NULL,
  `id_dateIcop` int(11) DEFAULT NULL,
  `date_ValidationDT` datetime DEFAULT NULL,
  `date_ValidationDDO` datetime DEFAULT NULL,
  `date_EditBRS` datetime DEFAULT NULL,
  `date_nConv` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `sollicitation_dateicop`
--

CREATE TABLE `sollicitation_dateicop` (
  `id` int(11) NOT NULL,
  `id_sol` int(11) NOT NULL,
  `dateIcop` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `sollicitation_etat`
--

CREATE TABLE `sollicitation_etat` (
  `id` int(11) NOT NULL,
  `etat` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `tooltip` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `sollicitation_historique`
--

CREATE TABLE `sollicitation_historique` (
  `id` int(11) NOT NULL,
  `id_sol` int(11) NOT NULL DEFAULT '0',
  `etat` int(11) NOT NULL,
  `date_etat` datetime DEFAULT NULL,
  `information` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `id` varchar(8) NOT NULL,
  `password` varchar(255) NOT NULL,
  `libelle` varchar(255) NOT NULL,
  `mail` varchar(255) NOT NULL,
  `fonction` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `ville`
--

CREATE TABLE `ville` (
  `id` int(11) NOT NULL,
  `libelle` varchar(255) NOT NULL,
  `codePostal` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Index pour les tables exportées
--

--
-- Index pour la table `adresse`
--
ALTER TABLE `adresse`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_commune` (`commune`),
  ADD KEY `adresse` (`adresse`) USING BTREE;

--
-- Index pour la table `ape`
--
ALTER TABLE `ape`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `attributaire`
--
ALTER TABLE `attributaire`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Index pour la table `brs`
--
ALTER TABLE `brs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `numBRS` (`n_brs`),
  ADD KEY `Lot` (`id_lot`),
  ADD KEY `id_attributaire` (`id_attributaire`),
  ADD KEY `nouveauBRS` (`nouveauBRS`);

--
-- Index pour la table `brs_compteur`
--
ALTER TABLE `brs_compteur`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_lot_2` (`id_lot`),
  ADD KEY `id_lot` (`id_lot`);

--
-- Index pour la table `brs_etat`
--
ALTER TABLE `brs_etat`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `brs_historique`
--
ALTER TABLE `brs_historique`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_brs` (`id_brs`),
  ADD KEY `id_etat` (`id_etat`);

--
-- Index pour la table `brs_modifie`
--
ALTER TABLE `brs_modifie`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idBRS_2` (`id_brs`,`id_sol`),
  ADD KEY `idBRS` (`id_brs`),
  ADD KEY `id_elmt` (`id_sol`);

--
-- Index pour la table `brs_sollicitation`
--
ALTER TABLE `brs_sollicitation`
  ADD UNIQUE KEY `numBRS_idElmt` (`id_brs`,`id_sol`) USING BTREE,
  ADD KEY `fk_idElmt` (`id_sol`);

--
-- Index pour la table `catalogue`
--
ALTER TABLE `catalogue`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_cata_niveau` (`niveau_form`),
  ADD KEY `fk_cata_objectif` (`objectif_form`),
  ADD KEY `n_Article` (`n_Article`),
  ADD KEY `lot` (`id_lot`);

--
-- Index pour la table `catalogue_attributaire`
--
ALTER TABLE `catalogue_attributaire`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_cata` (`id_cata`),
  ADD KEY `id_attributaire` (`id_attributaire`);

--
-- Index pour la table `catalogue_attributaire_commune`
--
ALTER TABLE `catalogue_attributaire_commune`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_cata_attr` (`id_cata_attr`),
  ADD KEY `id_commune` (`id_commune`);

--
-- Index pour la table `catalogue_attributaire_commune_adresse`
--
ALTER TABLE `catalogue_attributaire_commune_adresse`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_adresse` (`id_adresse`),
  ADD KEY `id_catalogue_attributaire` (`id_catalogue_attributaire_commune`);

--
-- Index pour la table `catalogue_compteur`
--
ALTER TABLE `catalogue_compteur`
  ADD PRIMARY KEY (`id_cata`),
  ADD KEY `id_cata` (`id_cata`);

--
-- Index pour la table `commune`
--
ALTER TABLE `commune`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `dispositif`
--
ALTER TABLE `dispositif`
  ADD PRIMARY KEY (`id`),
  ADD KEY `dispositif` (`libelle`);

--
-- Index pour la table `fonction`
--
ALTER TABLE `fonction`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `formation`
--
ALTER TABLE `formation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_solElmt_nArticle` (`id_cata`),
  ADD KEY `fk_solElmt_adresse` (`adresse`),
  ADD KEY `fk_solElmt_user` (`idgasi`),
  ADD KEY `fk_solElmt_dispositif` (`dispositif`),
  ADD KEY `agence_referente` (`agence_ref`),
  ADD KEY `id_commune` (`id_commune`),
  ADD KEY `id_etat` (`etat`),
  ADD KEY `n_Article` (`n_Article`);

--
-- Index pour la table `formation_commentaire`
--
ALTER TABLE `formation_commentaire`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`idgasi`) USING BTREE,
  ADD KEY `id_elmt` (`n_Article`) USING BTREE;

--
-- Index pour la table `formation_etat`
--
ALTER TABLE `formation_etat`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `formation_historique_old`
--
ALTER TABLE `formation_historique_old`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_etat` (`id_etat`),
  ADD KEY `id_formation` (`id_formation`);

--
-- Index pour la table `lot`
--
ALTER TABLE `lot`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `lot_bassin`
--
ALTER TABLE `lot_bassin`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `lot_bassin_catalogue`
--
ALTER TABLE `lot_bassin_catalogue`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `niveau`
--
ALTER TABLE `niveau`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `objectif`
--
ALTER TABLE `objectif`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `sollicitation`
--
ALTER TABLE `sollicitation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_dateIcop` (`id_dateIcop`),
  ADD KEY `id_formation` (`id_formation`);

--
-- Index pour la table `sollicitation_dateicop`
--
ALTER TABLE `sollicitation_dateicop`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idsol` (`id_sol`) USING BTREE;

--
-- Index pour la table `sollicitation_etat`
--
ALTER TABLE `sollicitation_etat`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `sollicitation_historique`
--
ALTER TABLE `sollicitation_historique`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_histo_id_sol` (`id_sol`),
  ADD KEY `etat` (`etat`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_fonction` (`fonction`);

--
-- Index pour la table `ville`
--
ALTER TABLE `ville`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `adresse`
--
ALTER TABLE `adresse`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=203;
--
-- AUTO_INCREMENT pour la table `attributaire`
--
ALTER TABLE `attributaire`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
--
-- AUTO_INCREMENT pour la table `brs`
--
ALTER TABLE `brs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `brs_compteur`
--
ALTER TABLE `brs_compteur`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT pour la table `brs_etat`
--
ALTER TABLE `brs_etat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT pour la table `brs_historique`
--
ALTER TABLE `brs_historique`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;
--
-- AUTO_INCREMENT pour la table `brs_modifie`
--
ALTER TABLE `brs_modifie`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `catalogue`
--
ALTER TABLE `catalogue`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=130;
--
-- AUTO_INCREMENT pour la table `catalogue_attributaire`
--
ALTER TABLE `catalogue_attributaire`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=182;
--
-- AUTO_INCREMENT pour la table `catalogue_attributaire_commune`
--
ALTER TABLE `catalogue_attributaire_commune`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=459;
--
-- AUTO_INCREMENT pour la table `catalogue_attributaire_commune_adresse`
--
ALTER TABLE `catalogue_attributaire_commune_adresse`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=473;
--
-- AUTO_INCREMENT pour la table `commune`
--
ALTER TABLE `commune`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;
--
-- AUTO_INCREMENT pour la table `dispositif`
--
ALTER TABLE `dispositif`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT pour la table `fonction`
--
ALTER TABLE `fonction`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT pour la table `formation`
--
ALTER TABLE `formation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `formation_commentaire`
--
ALTER TABLE `formation_commentaire`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
--
-- AUTO_INCREMENT pour la table `formation_etat`
--
ALTER TABLE `formation_etat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
--
-- AUTO_INCREMENT pour la table `formation_historique_old`
--
ALTER TABLE `formation_historique_old`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `lot`
--
ALTER TABLE `lot`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
--
-- AUTO_INCREMENT pour la table `lot_bassin`
--
ALTER TABLE `lot_bassin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
--
-- AUTO_INCREMENT pour la table `lot_bassin_catalogue`
--
ALTER TABLE `lot_bassin_catalogue`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=511;
--
-- AUTO_INCREMENT pour la table `niveau`
--
ALTER TABLE `niveau`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT pour la table `objectif`
--
ALTER TABLE `objectif`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT pour la table `sollicitation`
--
ALTER TABLE `sollicitation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `sollicitation_dateicop`
--
ALTER TABLE `sollicitation_dateicop`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `sollicitation_etat`
--
ALTER TABLE `sollicitation_etat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
--
-- AUTO_INCREMENT pour la table `sollicitation_historique`
--
ALTER TABLE `sollicitation_historique`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `ville`
--
ALTER TABLE `ville`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;
--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `adresse`
--
ALTER TABLE `adresse`
  ADD CONSTRAINT `fk_commune` FOREIGN KEY (`commune`) REFERENCES `ville` (`id`);

--
-- Contraintes pour la table `brs`
--
ALTER TABLE `brs`
  ADD CONSTRAINT `fk_attrib` FOREIGN KEY (`id_attributaire`) REFERENCES `attributaire` (`id`),
  ADD CONSTRAINT `fk_brs_lot` FOREIGN KEY (`id_lot`) REFERENCES `lot` (`id`),
  ADD CONSTRAINT `fk_newBRS` FOREIGN KEY (`nouveauBRS`) REFERENCES `brs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `brs_compteur`
--
ALTER TABLE `brs_compteur`
  ADD CONSTRAINT `lot` FOREIGN KEY (`id_lot`) REFERENCES `lot` (`id`);

--
-- Contraintes pour la table `brs_historique`
--
ALTER TABLE `brs_historique`
  ADD CONSTRAINT `fk_brs` FOREIGN KEY (`id_brs`) REFERENCES `brs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_brs_etat` FOREIGN KEY (`id_etat`) REFERENCES `brs_etat` (`id`);

--
-- Contraintes pour la table `brs_modifie`
--
ALTER TABLE `brs_modifie`
  ADD CONSTRAINT `fk_sol` FOREIGN KEY (`id_sol`) REFERENCES `sollicitation` (`id`),
  ADD CONSTRAINT `fk_t_brs_modifier_idBRS` FOREIGN KEY (`id_brs`) REFERENCES `brs_sollicitation` (`id_brs`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `brs_sollicitation`
--
ALTER TABLE `brs_sollicitation`
  ADD CONSTRAINT `fk_idBRS` FOREIGN KEY (`id_brs`) REFERENCES `brs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_id_sol_brs` FOREIGN KEY (`id_sol`) REFERENCES `sollicitation` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `catalogue`
--
ALTER TABLE `catalogue`
  ADD CONSTRAINT `fk_cata_lot` FOREIGN KEY (`id_lot`) REFERENCES `lot` (`id`),
  ADD CONSTRAINT `fk_cata_niveau` FOREIGN KEY (`niveau_form`) REFERENCES `niveau` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_cata_obj` FOREIGN KEY (`objectif_form`) REFERENCES `objectif` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `catalogue_attributaire`
--
ALTER TABLE `catalogue_attributaire`
  ADD CONSTRAINT `c_attr_id_attributaire` FOREIGN KEY (`id_attributaire`) REFERENCES `attributaire` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `c_attr_id_cata` FOREIGN KEY (`id_cata`) REFERENCES `catalogue` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `catalogue_attributaire_commune`
--
ALTER TABLE `catalogue_attributaire_commune`
  ADD CONSTRAINT `fk_id_attr` FOREIGN KEY (`id_cata_attr`) REFERENCES `catalogue_attributaire` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_id_commune` FOREIGN KEY (`id_commune`) REFERENCES `ville` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `catalogue_attributaire_commune_adresse`
--
ALTER TABLE `catalogue_attributaire_commune_adresse`
  ADD CONSTRAINT `fk_id_adresse` FOREIGN KEY (`id_adresse`) REFERENCES `adresse` (`id`),
  ADD CONSTRAINT `fk_id_catalogue_attributaire` FOREIGN KEY (`id_catalogue_attributaire_commune`) REFERENCES `catalogue_attributaire_commune` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `catalogue_compteur`
--
ALTER TABLE `catalogue_compteur`
  ADD CONSTRAINT `fk_id_cata` FOREIGN KEY (`id_cata`) REFERENCES `catalogue` (`id`);

--
-- Contraintes pour la table `formation`
--
ALTER TABLE `formation`
  ADD CONSTRAINT `fk_formation_adresse` FOREIGN KEY (`adresse`) REFERENCES `adresse_catalogue_bis` (`id`) ON DELETE SET NULL ON UPDATE SET NULL,
  ADD CONSTRAINT `fk_formation_agenceReferente` FOREIGN KEY (`agence_ref`) REFERENCES `ape` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_formation_commune` FOREIGN KEY (`id_commune`) REFERENCES `ville` (`id`),
  ADD CONSTRAINT `fk_formation_dispositif` FOREIGN KEY (`dispositif`) REFERENCES `dispositif` (`id`) ON DELETE SET NULL ON UPDATE SET NULL,
  ADD CONSTRAINT `fk_formation_etat` FOREIGN KEY (`etat`) REFERENCES `formation_etat` (`id`),
  ADD CONSTRAINT `fk_formation_nArticle` FOREIGN KEY (`id_cata`) REFERENCES `catalogue` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_formation_user` FOREIGN KEY (`idgasi`) REFERENCES `user` (`id`);

--
-- Contraintes pour la table `formation_commentaire`
--
ALTER TABLE `formation_commentaire`
  ADD CONSTRAINT `fk_t_user_remarque` FOREIGN KEY (`idgasi`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE SET NULL;

--
-- Contraintes pour la table `formation_historique_old`
--
ALTER TABLE `formation_historique_old`
  ADD CONSTRAINT `fk_id_etat` FOREIGN KEY (`id_etat`) REFERENCES `formation_etat` (`id`),
  ADD CONSTRAINT `fk_id_form` FOREIGN KEY (`id_formation`) REFERENCES `formation` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `sollicitation`
--
ALTER TABLE `sollicitation`
  ADD CONSTRAINT `fk_form` FOREIGN KEY (`id_formation`) REFERENCES `formation` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `sollicitation_dateicop`
--
ALTER TABLE `sollicitation_dateicop`
  ADD CONSTRAINT `fk_id_sol_icop` FOREIGN KEY (`id_sol`) REFERENCES `sollicitation` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `sollicitation_historique`
--
ALTER TABLE `sollicitation_historique`
  ADD CONSTRAINT `fk_etat` FOREIGN KEY (`etat`) REFERENCES `sollicitation_etat` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_histo_id_sol` FOREIGN KEY (`id_sol`) REFERENCES `sollicitation` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `fk_fonction` FOREIGN KEY (`fonction`) REFERENCES `fonction` (`id`) ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
