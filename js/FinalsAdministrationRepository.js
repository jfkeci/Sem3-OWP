var aMentorList = [];
var aPodrucjeRadaList = [];
var aAktivnostList = [];

oDbAktivnosti.on('value', function (oOdgovorPosluzitelja) {
    aAktivnostList = [];
    oOdgovorPosluzitelja.forEach(function (oAktivnostSnapshot) {
        var sAktivnostKey = oAktivnostSnapshot.key;
        var oAktivnost = oAktivnostSnapshot.val();
        aAktivnostList.push({
            aktivnostKey: sAktivnostKey,
            dateTime: oAktivnost.dateTime,
            rad: oAktivnost.rad,
            radnja: oAktivnost.radnja
        });
    });
    console.log(aAktivnostList);
    $(document).ready(function () {
        PopuniTablicuAktivnosti();
    });
});

oDbMentori.on('value', function (oOdgovorPosluzitelja) {
    aMentorList = [];
    oOdgovorPosluzitelja.forEach(function (oMentorSnapshot) {

        var sMentorKey = oMentorSnapshot.key;
        var oMentor = oMentorSnapshot.val();
        aMentorList.push({
            mentorKey: sMentorKey,
            mentor: oMentor.mentor
        });
    });
    $(document).ready(function () {
        PopuniTablicuMentori();
    });
    console.log(aMentorList);
})

oDbPodrucjeRada.on('value', function (oOdgovorPosluzitelja) {
    aPodrucjeRadaList = [];
    oOdgovorPosluzitelja.forEach(function (oPodrucjeSnapshot) {

        var sPodrucjeKey = oPodrucjeSnapshot.key;
        var oPodrucje = oPodrucjeSnapshot.val();
        aPodrucjeRadaList.push({
            podrucjeKey: sPodrucjeKey,
            podrucje: oPodrucje.podrucje
        });
    });
    $(document).ready(function () {;
        PopuniTablicuPodrucjaRada();
    });
    console.log(aPodrucjeRadaList);
});

function ModalAzurirajMentora(mKey) {
    aMentorList = [];
    var oMentorRef = oDb.ref('mentori/' + mKey);
    oMentorRef.once('value', function (oOdgovorPosluzitelja) {
        var oMentor = oOdgovorPosluzitelja.val();
        console.log(oMentor);
        //Popunjavanje elemenata forme za ureðivanje
        $('#inptMentorEdit').val(oMentor.mentor);

        $('#adminAzurirajMentora').attr('onclick', 'SpremiAzuriranogMentora("' + mKey + '")');

        $('#azuriraj-mentora').modal('show');
    });
}
function SpremiAzuriranogMentora(mKey) {
    var oMentorRef = oDb.ref('mentori/' + mKey);

    aMentorList = [];

    var mentorEdit = $('#inptMentorEdit').val();

    var oMentor = {
        mentor: mentorEdit
    }
    oMentorRef.update(oMentor);
}
function ModalAzurirajPodrucje(pKey) {
    aPodrucjeRadaList = [];
    var oPodrucjeRef = oDb.ref('podrucjaRada/' + pKey);
    oPodrucjeRef.once('value', function (oOdgovorPosluzitelja) {
        var oPodrucje = oOdgovorPosluzitelja.val();

        $('#inptPodrucjeEdit').val(oPodrucje.podrucje);

        $('#adminAzurirajPodrucje').attr('onclick', 'SpremiAzuriranoPodrucje("' + pKey + '")');

        $('#azuriraj-podrucje').modal('show');
    });
}
function SpremiAzuriranoPodrucje(pKey) {
    var oPodrucjeRef = oDb.ref('podrucjaRada/' + pKey);

    aPodrucjeRadaList = [];

    var podrucjeEdit = $('#inptPodrucjeEdit').val();

    var oPodrucje = {
        podrucje: podrucjeEdit
    }
    oPodrucjeRef.update(oPodrucje);
}

function PopuniTablicuAktivnosti() {
    var oTablica = $('#povijestAktivnosti');
    var nRbr = 1;
    oTablica.find('tbody').empty();
    aAktivnostList.forEach(oAktivnost => {
        var sRow = '<tr><td>' + nRbr++ + '</td><td>' + dajRadnju(oAktivnost.radnja) + '</td><td>' + oAktivnost.dateTime + '</td><td>' + oAktivnost.rad + '</td></tr>';

        oTablica.append(sRow);
    });
}
function PopuniTablicuMentori() {
    var oTablica = $('#TablicaMentori');
    var nRbr = 1;
    oTablica.find('tbody').empty();
    aMentorList.forEach(oMentor => {
        var sRow = '<tr><td>' + nRbr++ + '</td><td>' + oMentor.mentor + '</td><td><span><button onclick="ModalAzurirajMentora(\'' + oMentor.mentorKey + '\')" class="btn btn-info" data-toggle="modal"><span class="glyphicon glyphicon-pencil"></span></button></span></td><td><span><button class="btn btn-danger" data-toggle="modal" onclick="ObrisiMentora(\'' + oMentor.mentorKey + '\')"><span class="glyphicon glyphicon-remove"></span></button></span></td></tr>';

        oTablica.append(sRow);
    });
}
function PopuniTablicuPodrucjaRada() {
    var oTablica = $('#TablicaPodrucja');
    var nRbr = 1;
    oTablica.find('tbody').empty();
    aPodrucjeRadaList.forEach(oPodrucje => {
        var sRow = '<tr><td>' + nRbr++ + '</td><td>' + oPodrucje.podrucje + '</td><td><span><button onclick="ModalAzurirajPodrucje(\'' + oPodrucje.podrucjeKey + '\')" class="btn btn-info" data-toggle="modal"><span class="glyphicon glyphicon-pencil"></span></button></span></td><td><span><button class="btn btn-danger" data-toggle="modal" onclick="ObrisiPodrucje(\'' + oPodrucje.podrucjeKey + '\')"><span class="glyphicon glyphicon-remove"></span></button></span></td></tr>';
        oTablica.append(sRow);
    });
}

function DodajMentora() {
    var sMentorNew = $('#inptNoviMentor').val();

    var sKey = firebase.database().ref().child('mentori').push().key;

    var oMentor = {
        mentor: sMentorNew
    }
    var oZapis = {};
    oZapis[sKey] = oMentor;
    oDbMentori.update(oZapis);
}

function DodajPodrucje() {
    var sPodrucjeNew = $('#inptNovoPodrucje').val();

    var sKey = firebase.database().ref().child('podrucjaRada').push().key;

    var oPodrucje = {
        podrucje: sPodrucjeNew
    }
    var oZapis = {};
    oZapis[sKey] = oPodrucje;
    oDbPodrucjeRada.update(oZapis);
}

function ObrisiMentora(mKey) {
    var oMentorRef = oDb.ref('mentori/' + mKey);
    oMentorRef.remove();
}
function ObrisiPodrucje(mKey) {
    var oPodrucjeRef = oDb.ref('podrucjaRada/' + mKey);
    oPodrucjeRef.remove();
}

function dajRadnju(id) {
    switch (id) {
        case 1:
            return "Dodavanje rada";
            break;
        case 2:
            return "Azuriranje rada";
            break;
        case 3:
            return "Brisanje rada";
            break;
    }
}