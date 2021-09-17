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
    CreateBrs: function (wsName = 'BRS', data, attributaire) {

        var workbook = new excel.Workbook();
        var worksheet = workbook.addWorksheet(wsName,{views: [{showGridLines: false}]});

        const font = { name: 'Arial', size: 16 };
        // col width 50
        worksheet.views = [
            { zoomScale: 70 }
        ];

        // [...Array(20).keys()].map((v) => {
        //     worksheet.getColumn(v+1).width = 25;
        // })

        worksheet.mergeCells('A1:T1');
        worksheet.getCell("A1").value = "Bon de réservation de session";
        worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell("A1").font = { name: 'Arial', size: 16, 'bold': true, color: '#0000FF' };
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
        worksheet.getCell("A4").value = "${n_marche} DR Réunion - ${intitule}";
        worksheet.getCell('A4').alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell("A4").font = { name: 'Arial', size: 16, 'bold': true, };

        worksheet.mergeCells('A6:T6');
        worksheet.getCell("A6").value = "Bon de réservation de sessions";
        worksheet.getCell('A6').alignment = { vertical: 'middle', horizontal: 'left' };
        worksheet.getCell("A6").font = { name: 'Arial', size: 12, 'bold': true, color: '#FF0000' };

        worksheet.mergeCells('A7:T7');
        worksheet.getCell("A7").value = `Le titulaire / mandataire renverra sous 5 jours ouvrés par mail, dûment remplie, paraphée et signée, la copie ci-jointe tenant lieu d’accusé de réception.`;
        worksheet.getCell('A7').alignment = { vertical: 'middle', horizontal: 'left' };
        worksheet.getCell("A7").font = { name: 'Arial', size: 12, };

        worksheet.getRow(8).height = 50;
        worksheet.mergeCells('A8:D8');
        worksheet.getCell('A8').border = {
            top: { style: 'thick' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
        worksheet.getCell("A8").value = `Expediteur.`;
        worksheet.getCell('A8').alignment = { vertical: 'middle', horizontal: 'left' };
        worksheet.getCell("A8").font = { name: 'Arial', size: 12, 'bold': true };

        worksheet.getColumn('E').width = 30;
        worksheet.getColumn('F').width = 30;
        worksheet.getColumn('G').width = 30;
        worksheet.getColumn('H').width = 30;
        worksheet.mergeCells('E8:H8');
        worksheet.getCell('E8').border = {
            top: { style: 'thick' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
        let text = 'Direction régionale Pôle emploi Réunion';
        text += '\r\n62 Boulevard du Chaudron Centre d\'affaires CADJEE Bât C CS 52008';
        text += '\r\n\r\n97744 Saint-Denis cedex 9.';
        worksheet.getCell("E8").value = text;
        worksheet.getCell('E8').alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell("E8").font = { name: 'Arial', size: 12};
        
        worksheet.mergeCells('I8:T8');
        worksheet.getCell('I8').border = {
            top: { style: 'thick' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
        worksheet.getCell("I8").value = `Direction Des Opérations.`;
        worksheet.getCell('I8').alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell("I8").font = { name: 'Arial', size: 12};

        // worksheet.columns = [{ header: "Album", key: "album" }, { header: "Year", key: "year" }];

        worksheet.addRow({ album: "Taylor Swift", year: 2006 });

        worksheet.addRow(["Fearless", 2008]);

        var rows = [["Speak Now", 2010], { album: "Red", year: 2012 }];
        worksheet.addRows(rows);

        worksheet.getCell("A15").value = "1989";
        worksheet.getCell("B15").value = 2014;

        // console.log(rows)

        // worksheet.addTable({
        //     name: 'MyTable',
        //     ref: 'A'+cellTable,
        //     headerRow: true,
        //     totalsRow: false,
        //     style: {
        //         theme: 'TableStyleLight6',
        //         showRowStripes: true,
        //     },
        //     columns: tab_header,
        //     rows: ['rows','a'],
        // });

        // for(i in tab_header){
        //     worksheet.getColumn(parseInt(i)+1).width = 15;
        // } 

        // worksheet.addRows(data);

        return workbook

    }


}