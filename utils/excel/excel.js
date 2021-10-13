const excel = require('exceljs');

module.exports = {
    /*

        Modules pour créer les fichier export XLS
        Utilisation = xls.CreateXls(wsName, header, data, filter)
        wsName      = Nom de la sheet
        header      = tableau d'objet entête [{name : ..., key : ...}, {name : ..., key : ...}]
        data  = résultat de la requête SQL
        filter  = filtre utilisé (Si pas de filtre, MyTable commence en 'A1')
        prct = Int numéro de la colonne à mettre en %, pour ne rien mettre en %, ne rien mettre à la place de prct

    */
    CreateBrs: function (wsName = 'BRS', brs, attrib, rowsTable) {

        var workbook = new excel.Workbook();
        var worksheet = workbook.addWorksheet(brs.lot ? brs.lot.toUpperCase() : wsName, { views: [{ showGridLines: false, zoomScale: 70 }] });

        // Entete du fichier
        worksheet.mergeCells('A1:T1');
        worksheet.getCell("A1").value = "Bon de réservation de session";
        worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell("A1").font = { name: 'Arial', size: 16, 'bold': true, color: { argb: '000000FF' } };
        worksheet.getRow(1).height = 90;

        worksheet.mergeCells('A2:T2');
        worksheet.getCell("A2").value = "AFC - Action de formation conventionnée";
        worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell("A2").font = { name: 'Arial', size: 16, 'bold': true, 'italic': true, };

        worksheet.mergeCells('A3:T3');
        worksheet.getCell("A3").value = "Pôle emploi Réunion";
        worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell("A3").font = { name: 'Arial', size: 16, 'bold': true, };

        worksheet.mergeCells('A4:T4');
        worksheet.getCell("A4").value = `${brs.n_marche} DR Réunion - ${brs.lot}`;
        worksheet.getCell('A4').alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell("A4").font = { name: 'Arial', size: 16, 'bold': true, };

        // Objet
        worksheet.mergeCells('B6:T6');
        worksheet.getCell("B6").value = "Bon de réservation de sessions";
        worksheet.getCell('B6').alignment = { vertical: 'middle', horizontal: 'left' };
        worksheet.getCell("B6").font = { name: 'Arial', size: 12, 'bold': true, color: '#FF0000' };

        worksheet.mergeCells('B7:T7');
        worksheet.getCell("B7").value = `Le titulaire / mandataire renverra sous 5 jours ouvrés par mail, dûment remplie, paraphée et signée, la copie ci-jointe tenant lieu d’accusé de réception.`;
        worksheet.getCell('B7').alignment = { vertical: 'middle', horizontal: 'left' };
        worksheet.getCell("B7").font = { name: 'Arial', size: 12, };

        worksheet.getRow(8).height = 50;
        worksheet.mergeCells('B8:D8');
        worksheet.getCell('B8').border = { top: { style: 'thick' }, left: { style: 'thick' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell("B8").value = `Expediteur.`;
        worksheet.getCell('B8').alignment = { vertical: 'middle', horizontal: 'left' };
        worksheet.getCell("B8").font = { name: 'Arial', size: 12, 'bold': true };

        worksheet.getColumn('A').width = 5;
        worksheet.getColumn('B').width = 20;
        worksheet.getColumn('C').width = 15;
        worksheet.getColumn('D').width = 20;
        worksheet.getColumn('E').width = 20;
        worksheet.getColumn('F').width = 20;
        worksheet.getColumn('G').width = 20;
        worksheet.getColumn('H').width = 20;
        worksheet.getColumn('I').width = 15;
        worksheet.getColumn('J').width = 15;
        worksheet.getColumn('K').width = 15;
        worksheet.getColumn('L').width = 15;
        worksheet.getColumn('M').width = 15;
        worksheet.getColumn('N').width = 15;
        worksheet.getColumn('O').width = 15;
        worksheet.getColumn('P').width = 15;
        worksheet.getColumn('Q').width = 25;
        worksheet.getColumn('R').width = 25;
        worksheet.getColumn('S').width = 25;
        worksheet.getColumn('T').width = 25;

        worksheet.mergeCells('E8:H8');
        worksheet.getCell('E8').border = { top: { style: 'thick' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        let text = 'Direction régionale Pôle emploi Réunion';
        text += '\r\n 62 Boulevard du Chaudron Centre d\'affaires CADJEE Bât C CS 52008';
        text += '\r\n 97744 Saint-Denis cedex 9.';
        worksheet.getCell("E8").value = text;
        worksheet.getCell('E8').alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell("E8").font = { name: 'Arial', size: 12 };
        worksheet.getCell("E8").alignment = { wrapText: true };

        worksheet.mergeCells('I8:T8');
        worksheet.getCell('I8').border = { top: { style: 'thick' }, bottom: { style: 'thin' }, right: { style: 'thick' } };
        worksheet.getCell("I8").value = `Direction Des Opérations.`;
        worksheet.getCell('I8').alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell("I8").font = { name: 'Arial', size: 12 };

        worksheet.mergeCells('B9:H9');
        worksheet.getCell('B9').border = { left: { style: 'thick' }, bottom: { style: 'thick' }, right: { style: 'thin' } };

        worksheet.getRow(9).height = 50;
        let textMail = 'Adresse mail où le titulaire / mandataire retourne, par courriel la copie scannée';
        textMail += '\r\n et signée du présent bon de réservation de sessions,';
        textMail += '\r\n dans un délai de 5 jours ouvrés à compter de sa sollicitation.';
        worksheet.getCell("B9").value = textMail;
        worksheet.getCell('B9').alignment = { vertical: 'middle', horizontal: 'left' };
        worksheet.getCell("B9").font = { name: 'Arial', size: 12, bold: true };
        worksheet.getCell("B9").alignment = { wrapText: true };

        worksheet.mergeCells('I9:T9');
        worksheet.getCell('I9').border = { bottom: { style: 'thick' }, right: { style: 'thick' } };

        // Destinataire
        // Ligne 11
        worksheet.mergeCells('B11:D11');
        worksheet.getCell('B11').border = { top: { style: 'thick' }, left: { style: 'thick' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell("B11").value = `Destinataire :`;
        worksheet.getCell('B11').alignment = { wrapText: true };
        worksheet.getCell("B11").fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00CCFFCC' }, };
        worksheet.getCell("B11").font = { name: 'Arial', size: 12, bold: true };

        worksheet.mergeCells('E11:T11');
        worksheet.getCell('E11').border = { top: { style: 'thick' }, bottom: { style: 'thin' }, right: { style: 'thick' } };
        worksheet.getCell('E11').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00FFFF00' }, };
        worksheet.getCell("E11").value = attrib.attributaire;
        worksheet.getCell('E11').alignment = { horizontal: 'center', wrapText: true };
        worksheet.getCell("E11").font = { name: 'Arial', size: 12 };

        // Ligne 12
        worksheet.mergeCells('B12:D12');
        worksheet.getCell('B12').border = { left: { style: 'thick' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell("B12").value = `N° de SIRET du titulaire / mandataire :`;
        worksheet.getCell('B12').alignment = { wrapText: true };
        worksheet.getCell("B12").fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00CCFFCC' }, };
        worksheet.getCell("B12").font = { name: 'Arial', size: 12 };

        worksheet.mergeCells('E12:T12');
        worksheet.getCell('E12').border = { bottom: { style: 'thin' }, right: { style: 'thick' } };
        worksheet.getCell('E12').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00FFFF00' }, };
        worksheet.getCell("E12").value = attrib.siret;
        worksheet.getCell("E12").numFmt = '0';
        worksheet.getCell('E12').alignment = { horizontal: 'center', wrapText: true };
        worksheet.getCell("E12").font = { name: 'Arial', size: 12 };

        // Ligne 13
        worksheet.mergeCells('B13:D13');
        worksheet.getCell('B13').border = { left: { style: 'thick' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell("B13").value = `Representant du titulaire / mandataire :`;
        worksheet.getCell('B13').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00CCFFCC' }, };
        worksheet.getCell('B13').alignment = { wrapText: true };
        worksheet.getCell("B13").font = { name: 'Arial', size: 12 };

        worksheet.mergeCells('E13:F13');
        worksheet.getCell('E13').border = { bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('E13').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00FFFF00' }, };
        worksheet.getCell("E13").value = attrib.representant;
        worksheet.getCell('E13').alignment = { horizontal: 'center', wrapText: true };
        worksheet.getCell("E13").font = { name: 'Arial', size: 12 };

        worksheet.getCell('G13').border = { bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('G13').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00CCFFCC' }, };
        worksheet.getCell("G13").value = 'Courriel :';
        worksheet.getCell('G13').alignment = { horizontal: 'center', wrapText: true };
        worksheet.getCell("G13").font = { name: 'Arial', size: 12 };

        worksheet.mergeCells('H13:T13');
        worksheet.getCell('H13').border = { bottom: { style: 'thin' }, right: { style: 'thick' } };
        worksheet.getCell('H13').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00FFFF00' }, };
        worksheet.getCell("H13").value = attrib.destinataireMail;
        worksheet.getCell('H13').alignment = { horizontal: 'center', wrapText: true };
        worksheet.getCell("H13").font = { name: 'Arial', size: 12 };

        // Ligne 14
        worksheet.mergeCells('B14:D14');
        worksheet.getCell('B14').border = { left: { style: 'thick' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell("B14").value = `Adresse :`;
        worksheet.getCell('B14').alignment = { wrapText: true };
        worksheet.getCell('B14').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00CCFFCC' }, };
        worksheet.getCell("B14").font = { name: 'Arial', size: 12 };

        worksheet.mergeCells('E14:T14');
        worksheet.getCell('E14').border = { bottom: { style: 'thin' }, right: { style: 'thick' } };
        worksheet.getCell('E14').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00FFFF00' }, };
        worksheet.getCell("E14").value = attrib.adresse;
        worksheet.getCell("E14").numFmt = '0';
        worksheet.getCell('E14').alignment = { horizontal: 'center', wrapText: true };
        worksheet.getCell("E14").font = { name: 'Arial', size: 12 };

        // Ligne 15
        worksheet.mergeCells('B15:D15');
        worksheet.getCell('B15').border = { left: { style: 'thick' }, bottom: { style: 'thick' }, right: { style: 'thin' } };
        worksheet.getCell("B15").value = `Telephone :`;
        worksheet.getCell('B15').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00CCFFCC' }, };
        worksheet.getCell('B15').alignment = { wrapText: true };
        worksheet.getCell("B15").font = { name: 'Arial', size: 12 };

        worksheet.mergeCells('E15:F15');
        worksheet.getCell('E15').border = { bottom: { style: 'thick' }, right: { style: 'thin' } };
        worksheet.getCell('E15').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00FFFF00' }, };
        worksheet.getCell("E15").value = attrib.telephone;
        worksheet.getCell('E15').alignment = { horizontal: 'center', wrapText: true };
        worksheet.getCell("E15").font = { name: 'Arial', size: 12 };

        worksheet.mergeCells('G15:T15');
        worksheet.getCell('G15').border = { bottom: { style: 'thick' }, right: { style: 'thick' } };
        worksheet.getCell('G15').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00B2BEB5' }, };

        // Réédition de BRS
        worksheet.mergeCells('B17:T17');
        worksheet.getCell('B17').border = { top: { style: 'thick' }, left: { style: 'thick' }, bottom: { style: 'thin' }, right: { style: 'thick' } };
        worksheet.getCell("B17").value = `En cas de réédition d'un bon de réservation de sessions déjà expédié, renseigner la mention suivante :`;
        worksheet.getCell('B17').alignment = { wrapText: true };
        worksheet.getCell("B17").font = { name: 'Arial', size: 12, 'italic': true, };

        worksheet.mergeCells('B18:D18');
        worksheet.getCell('B18').border = { left: { style: 'thick' }, bottom: { style: 'thick' }, right: { style: 'thin' } };
        worksheet.getCell("B18").value = 'Annule et remplace :';
        worksheet.getCell('B18').alignment = { horizontal: 'left', wrapText: true };
        worksheet.getCell("B18").font = { name: 'Arial', size: 12 };

        worksheet.mergeCells('E18:T18');
        worksheet.getCell('E18').border = { bottom: { style: 'thick' }, right: { style: 'thick' } };
        worksheet.getCell("E18").value = brs.remplace ? brs.remplace : '';
        worksheet.getCell('E18').alignment = { horizontal: 'center', wrapText: true };
        worksheet.getCell("E18").font = { name: 'Arial', size: 12 };

        // foramtion du BRS
        worksheet.getRow(20).height = 40;
        worksheet.mergeCells('B20:D20');
        worksheet.getCell('B20').border = { top: { style: 'thick' }, left: { style: 'thick' }, right: { style: 'thick' }, bottom: { style: 'thick' } };
        worksheet.getCell("B20").value = 'Bon de Réservation de Sessions n° :';
        worksheet.getCell('B20').alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
        worksheet.getCell("B20").font = { name: 'Arial', bold: true, size: 12, color: { argb: '000000FF' } };

        worksheet.mergeCells('E20:G20');
        worksheet.getCell('E20').border = { top: { style: 'thick' }, right: { style: 'thick' }, bottom: { style: 'thick' } };
        worksheet.getCell("E20").value = brs.n_brs;
        worksheet.getCell('E20').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getCell("E20").font = { name: 'Arial', bold: true, size: 12, color: { argb: '000000FF' } };

        worksheet.mergeCells('H20:O20');
        worksheet.getCell('H20').border = { top: { style: 'thick' }, right: { style: 'thick' }, bottom: { style: 'thick' } };

        worksheet.getCell('P20').border = { top: { style: 'thick' }, right: { style: 'thick' }, bottom: { style: 'thick' } };

        worksheet.mergeCells('Q20:T20');
        worksheet.getCell('Q20').border = { top: { style: 'thick' }, left: { style: 'thick' }, right: { style: 'thick' }, bottom: { style: 'thick' } };
        worksheet.getCell("Q20").value = 'Données à remplir par le titulaire / mandataire du marché';
        worksheet.getCell('Q20').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getCell("Q20").font = { name: 'Arial', bold: true, size: 12, color: { argb: '000000FF' } };

        // Tableau
        worksheet.getRow(21).height = 60;
        worksheet.getRow(21).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

        let rowsLength = rowsTable.length
        for (let i = 0; i < rowsLength; i++) {
            worksheet.getRow(22 + i).height = 40;
            worksheet.getRow(22 + i).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        }

        worksheet.addTable({
            name: 'MyTable',
            ref: 'B21',
            headerRow: true,
            totalsRow: false,
            style: {
                theme: 'TableStyleLight15',
                showRowStripes: true,
            },
            columns: [
                { name: 'Contact' },
                { name: 'Code Article (n° interne PE)' },
                { name: 'Intitulé de la formation' },
                { name: 'Objectif de formation' },
                { name: 'Niveau de sortie / Type de validation' },
                { name: 'Code / Intitulé du formacode' },
                { name: 'Lieu d\'éxécution (adresse, CP, ville)' },
                { name: 'Coût prévisionnel par stagiaire (1)' },
                { name: 'Intensité hebdo (2)' },
                { name: 'Nb de places achetées' },
                { name: 'Durée max de la session (en h) (3)' },
                { name: 'Durée en entreprise (en h)' },
                { name: 'Durée en centre (en h) (4)' },
                { name: 'Date de démarrage de la session (5)(jj/mm/aaaa)' },
                { name: 'Date de fin de la session (5) (jj/mm/aaaa) 15 jrs de fermeture autorisée inclus' },
                { name: 'Confirmation de la mise en œuvre de la session (OUI ou NON)' },
                { name: 'OF dispensateurs (SIRET/Raison sociale) et coordonnées du contact (Nom,Téléphones,Mail)' },
                { name: 'OF (SIRET/raison sociale) bénéficiaire de l\'avance (si montant BDC > 50 k€ 2 session > 2 mois)' },
                { name: 'Date prévisionnelle de l\'ICOP (6) (jj/mm/aaaa)' },
            ],
            rows: rowsTable,
        });

        // Case réservé PE - OF
        let newRow = 21 + rowsLength + 2;
        worksheet.mergeCells('B' + newRow + ':F' + newRow);
        worksheet.getCell('B' + newRow).border = { top: { style: 'thick' }, left: { style: 'thick' }, right: { style: 'thick' } };
        worksheet.getCell('B' + newRow).value = `Réervé à Pôle Emploi.`;
        worksheet.getCell('B' + newRow).alignment = { wrapText: true };
        worksheet.getCell('B' + newRow).font = { name: 'Arial', size: 12, 'italic': true, 'bold': true, };

        worksheet.mergeCells('H' + newRow + ':T' + newRow);
        worksheet.getCell('H' + newRow).border = { top: { style: 'thick' }, left: { style: 'thick' }, right: { style: 'thick' } };
        worksheet.getCell('H' + newRow).value = `Réervé au titulaire / mandataire.`;
        worksheet.getCell('H' + newRow).alignment = { wrapText: true };
        worksheet.getCell('H' + newRow).font = { name: 'Arial', size: 12, 'italic': true, 'bold': true, };

        newRow++;
        worksheet.mergeCells('B' + newRow + ':F' + newRow);
        worksheet.getCell('B' + newRow).border = { left: { style: 'thick' }, right: { style: 'thick' } };
        worksheet.getCell('B' + newRow).value = `Emis le présent bon de réservation de sessions`;
        worksheet.getCell('B' + newRow).alignment = { wrapText: true };
        worksheet.getCell('B' + newRow).font = { name: 'Arial', size: 12 };

        worksheet.mergeCells('H' + newRow + ':T' + newRow);
        worksheet.getCell('H' + newRow).border = { left: { style: 'thick' }, right: { style: 'thick' } };
        worksheet.getCell('H' + newRow).value = `Reçu le présent bon de réservation de sessions`;
        worksheet.getCell('H' + newRow).alignment = { wrapText: true };
        worksheet.getCell('H' + newRow).font = { name: 'Arial', size: 12 };

        newRow++;
        worksheet.getCell('B' + newRow).border = { left: { style: 'thick' } };
        worksheet.getCell('B' + newRow).value = `Fais à`;
        worksheet.getCell('B' + newRow).alignment = { horizontal: 'right', wrapText: true };
        worksheet.getCell('B' + newRow).font = { name: 'Arial', size: 12 };
        worksheet.mergeCells('C' + newRow + ':F' + newRow);
        worksheet.getCell('C' + newRow).border = { right: { style: 'thick' } };

        worksheet.getCell('H' + newRow).border = { left: { style: 'thick' } };
        worksheet.getCell('H' + newRow).value = `Fais à`;
        worksheet.getCell('H' + newRow).alignment = { horizontal: 'right', wrapText: true };
        worksheet.getCell('H' + newRow).font = { name: 'Arial', size: 12 };
        worksheet.mergeCells('I' + newRow + ':T' + newRow);
        worksheet.getCell('I' + newRow).border = { right: { style: 'thick' } };

        newRow++;
        worksheet.getCell('B' + newRow).border = { left: { style: 'thick' }, };
        worksheet.getCell('B' + newRow).value = `Le`;
        worksheet.getCell('B' + newRow).alignment = { horizontal: 'right', wrapText: true };
        worksheet.getCell('B' + newRow).font = { name: 'Arial', size: 12 };

        worksheet.getCell('H' + newRow).border = { left: { style: 'thick' }, };
        worksheet.getCell('H' + newRow).value = `Le`;
        worksheet.getCell('H' + newRow).alignment = { horizontal: 'right', wrapText: true };
        worksheet.getCell('H' + newRow).font = { name: 'Arial', size: 12 };

        worksheet.mergeCells('C' + newRow + ':F' + newRow);
        worksheet.getCell('C' + newRow).border = { right: { style: 'thick' } };
        worksheet.mergeCells('I' + newRow + ':T' + newRow);
        worksheet.getCell('I' + newRow).border = { right: { style: 'thick' } };

        newRow++;
        worksheet.mergeCells('B' + newRow + ':F' + newRow);
        worksheet.getCell('B' + newRow).border = { left: { style: 'thick' }, right: { style: 'thick' } };
        worksheet.getCell('B' + newRow).value = `Prénom et nom du signataire :`;
        worksheet.getCell('B' + newRow).alignment = { wrapText: true };
        worksheet.getCell('B' + newRow).font = { name: 'Arial', size: 12 };

        worksheet.mergeCells('H' + newRow + ':T' + newRow);
        worksheet.getCell('H' + newRow).border = { left: { style: 'thick' }, right: { style: 'thick' } };
        worksheet.getCell('H' + newRow).value = `Prénom, nom et qualité du représentant du titulaire / mandataire :`;
        worksheet.getCell('H' + newRow).alignment = { wrapText: true };
        worksheet.getCell('H' + newRow).font = { name: 'Arial', size: 12 };

        newRow++;
        worksheet.mergeCells('B' + newRow + ':F' + newRow);
        worksheet.getCell('B' + newRow).border = { left: { style: 'thick' }, right: { style: 'thick' } };
        worksheet.mergeCells('H' + newRow + ':T' + newRow);
        worksheet.getCell('H' + newRow).border = { left: { style: 'thick' }, right: { style: 'thick' } };

        newRow++;
        worksheet.mergeCells('B' + newRow + ':F' + newRow);
        worksheet.getCell('B' + newRow).border = { left: { style: 'thick' }, right: { style: 'thick' } };
        worksheet.getCell('B' + newRow).value = `Directeur Régional Adjoint en charge des Opérations :`;
        worksheet.getCell('B' + newRow).alignment = { wrapText: true };
        worksheet.getCell('B' + newRow).font = { name: 'Arial', size: 12 };

        worksheet.mergeCells('H' + newRow + ':T' + newRow);
        worksheet.getCell('H' + newRow).border = { left: { style: 'thick' }, right: { style: 'thick' } };
        worksheet.getCell('H' + newRow).value = `Bon pour accord`;
        worksheet.getCell('H' + newRow).alignment = { wrapText: true };
        worksheet.getCell('H' + newRow).font = { name: 'Arial', size: 12 };

        newRow++;
        worksheet.getRow(newRow).height = 50;
        worksheet.mergeCells('B' + newRow + ':F' + newRow);
        worksheet.getCell('B' + newRow).border = { left: { style: 'thick' }, right: { style: 'thick' }, bottom: { style: 'thick' } };
        worksheet.getCell('B' + newRow).value = `Cachet et signature`;
        worksheet.getCell('B' + newRow).alignment = { vertical: 'top', wrapText: true };
        worksheet.getCell('B' + newRow).font = { name: 'Arial', size: 12 };

        worksheet.mergeCells('H' + newRow + ':T' + newRow);
        worksheet.getCell('H' + newRow).border = { left: { style: 'thick' }, right: { style: 'thick' }, bottom: { style: 'thick' } };
        worksheet.getCell('H' + newRow).value = `Cache et signature`;
        worksheet.getCell('H' + newRow).alignment = { vertical: 'top', wrapText: true };
        worksheet.getCell('H' + newRow).font = { name: 'Arial', size: 12 };

        newRow++;
        let textCU = 'Ce bon de réservation de session est émis en application'
        textCU += ' de l’article 5.1.1 du Contrat et conformément aux dispositions'
        textCU += ' du Cahier des charges fonctionnel et technique (CCFT) du marché sous références.'
        worksheet.getCell('B' + newRow).value = textCU;
        worksheet.getCell('B' + newRow).font = { name: 'Arial', size: 9, italic: true };

        newRow++;
        newRow++;
        worksheet.getCell('B' + newRow).value = '(1) le coût par stagiaire sera transmis par Pôle emploi à partir de 2020';
        worksheet.getCell('B' + newRow).font = { name: 'Arial', size: 9, color: { argb: '00FF0000' } };
        newRow++;
        worksheet.getCell('B' + newRow).value = '(2) Sauf exception validée par Pôle emploi la durée hebdomadaire est a minima de 30h pour tous les stagiaires';
        worksheet.getCell('B' + newRow).font = { name: 'Arial', size: 9, color: { argb: '00FF0000' } };
        newRow++;
        worksheet.getCell('B' + newRow).value = '(3) Durée maximum de la session = durée de la formation professionnelle  (400h) + RAN (80h soit 20% de 400h) + formation en situation de travail en entreprise (120h soit 30%) + soutien (66h soit 16,6% arrondi à l\'inférieur ) + 21 h d\'appui à la recherche d\'emploi ';
        worksheet.getCell('B' + newRow).font = { name: 'Arial', size: 9, color: { argb: '00FF0000' } };
        newRow++;
        worksheet.getCell('B' + newRow).value = '(4) Toutes les durées maximum hors Formation en situation de travail ';
        worksheet.getCell('B' + newRow).font = { name: 'Arial', size: 9, color: { argb: '00FF0000' } };
        newRow++;
        worksheet.getCell('B' + newRow).value = '(5) Les bornes de début et de fin de la session sont définies par la durée maximum de la session répartie sur X semaines à 35h soit X jours + jusqu\'à 15 jours calendaires de fermeture autorisée le cas échéant.  ';
        worksheet.getCell('B' + newRow).font = { name: 'Arial', size: 9, color: { argb: '00FF0000' } };
        newRow++;
        worksheet.getCell('B' + newRow).value = '(6) Une date d\'ICOP (prévisionnelle le cas échéant) est obligatoire pour toute session planifiée';
        worksheet.getCell('B' + newRow).font = { name: 'Arial', size: 9, color: { argb: '00FF0000' } };

        return workbook

    },

    CreateSollicitation: function (wsName = 'Sollicitation', rowsTable) {

        var workbook = new excel.Workbook();
        var worksheet = workbook.addWorksheet(wsName, { views: [{ zoomScale: 100 }] });


        // Entete du fichier
        worksheet.mergeCells('A1:S1');
        worksheet.getCell("A1").value = "Sollicitation pour une action de formation";
        worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell("A1").font = { name: 'Arial', size: 14, 'bold': true, color: { argb: '000000FF' } };
        worksheet.getRow(1).height = 90;

        worksheet.mergeCells('A2:S2');
        worksheet.getCell("A2").value = "AFC";
        worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell("A2").font = { name: 'Arial', size: 14, 'bold': true, };

        worksheet.mergeCells('A3:S3');
        worksheet.getCell("A3").value = "Pôle emploi Réunion";
        worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell("A3").font = { name: 'Arial', size: 14, 'bold': true, };

        worksheet.mergeCells('A4:S4');
        worksheet.getCell("A4").value = `N_MARCHE DR Réunion - LOT`;
        worksheet.getCell('A4').alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell("A4").font = { name: 'Arial', size: 12, 'bold': true, };


        worksheet.getRow(8).height = 50;

        for (let i = 1; i < 19; i++) {
            let letter = String.fromCharCode(65 + i);
            worksheet.getColumn(letter).width = (i === 3 || i === 6) ? 20 : 13;
            worksheet.getCell(letter + "6").alignment = { vertical: 'middle', horizontal: 'center' };
            worksheet.getCell(letter + "6").alignment = { wrapText: true };
            worksheet.getCell(letter + "7").alignment = { vertical: 'middle', horizontal: 'center' };
            worksheet.getCell(letter + "7").alignment = { wrapText: true };
        }

        worksheet.addTable({
            name: 'MyTable',
            ref: 'B6',
            headerRow: true,
            totalsRow: false,
            style: {
                theme: 'TableStyleLight13',
                showRowStripes: true,
            },
            columns: [

                { name: 'Contact' },
                { name: 'Code Article (n° interne PE)' },
                { name: 'Intitulé de la formation' },
                { name: 'Objectif de formation' },
                { name: 'Niveau de sortie / Type de validation' },
                { name: 'Code / Intitulé du formacode' },
                { name: 'Lieu d\'éxécution (A détailler par l\'OF)' },
                { name: 'Intensité hebdo' },
                { name: 'Nb de places souhaitée' },
                { name: 'Nbre de places maxi proposées par l\'OF' },
                { name: 'Durée max de la session (en h)' },
                { name: 'Durée en entreprise (en h)' },
                { name: 'Durée en centre (en h) (4)' },
                { name: 'Date de démarrage de la session souhaitée' },
                { name: 'Dates ICOP' },
                { name: 'Date de début' },
                { name: 'Commentaires' },
            ],
            rows: rowsTable,
        });

        worksheet.getCell("D7").alignment = { wrapText: true };
        worksheet.getCell("G7").alignment = { wrapText: true };

        return workbook
    },

    Export: function (wsName, header, data, filter){

        let workbook = new excel.Workbook(); //creating workbook
        let worksheet = workbook.addWorksheet(wsName,{views: [{showGridLines: false}]}); //creating worksheet
        let tab_header = []
        let tab_row = []
        let cellTable = ''
        
        if(filter && filter.length > 0){
            filter.unshift('Mes filtres', '')
            filter.map((value, index) => {
                let cell = worksheet.getCell('A'+(2+index).toString());
                cell.value = value;
                // worksheet.mergeCells('A'+(2+index).toString()+':'+String.fromCharCode(64+parseInt(header.length))+(2+index).toString());
                
                if(index==0){
                    cell.font = {
                        family: 4,
                        size: 12,
                        bold: true
                        };
                }
            })
            cellTable = (3+filter.length).toString();
        }else{
            cellTable = '1';
        }
        

        header.map((key) => {
            tab_header.push({name: key.header, filterButton: true})
            
        })

        let rows = []
        for(i in data){
            header.map((key) => {
                tab_row.push(data[i][key.key])
            })
            rows.push(tab_row)
            tab_row = []
        }
        // console.log(rows)

        worksheet.addTable({
            name: 'MyTable',
            ref: 'A'+cellTable,
            headerRow: true,
            totalsRow: false,
            style: {
                theme: 'TableStyleLight6',
                showRowStripes: true,
            },
            columns: tab_header,
            rows: rows,
        });

        for(i in tab_header){
            worksheet.getColumn(parseInt(i)+1).width = 15;
        } 
        if(typeof(prct)=='object')
            {
                prct.map((key) => {
                   worksheet.getColumn(key).eachCell((cell) => {
                        cell.numFmt = '0.0%';
                    });
                })
            }

        worksheet.addRows(data);

        return workbook

    }


}