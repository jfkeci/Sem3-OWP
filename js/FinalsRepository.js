var aZavrsniList = [];
var aMentorList = [];
var aPodrucjeRadaList = [];
var aAktivnostList = [];
//var zablica Zavrsni = null;

//Pravimo Listu Zavrsnih i u nju pohranjujemo objekte zavrsnih iz baze podataka

oDbZavrsniRadovi.on('value', function (oOdgovorPosluzitelja) {
    aZavrsniList = [];
    oOdgovorPosluzitelja.forEach(function (oZavrsniSnapshot) {
        
        var sZavrsniKey = oZavrsniSnapshot.key;
        var oZavrsni = oZavrsniSnapshot.val();
        aZavrsniList.push({
            zavrsniKey: sZavrsniKey,
            akGodina: oZavrsni.akGodina,
            mentorId: oZavrsni.mentorId,
            nazivRada: oZavrsni.nazivRada,
            ocjena: oZavrsni.ocjena,
            podrucjeRada: oZavrsni.podrucjeRada,
            sifra: oZavrsni.sifra,
            student: oZavrsni.student,
            sumentorId: oZavrsni.sumentorId
        });
    });
    console.log(aZavrsniList);
    $(document).ready(function () {
        PopuniTablicuZavrsni(aZavrsniList);
    });
    var searchData = ''
    $('#searchInput').on('keyup', function () {
        searchData = $(this).val()
        console.log('Value: ', searchData)
        pretraziTablicu(searchData, aZavrsniList)
    })
    AkGodinaDrop('#GodinaDropdown');
    AkGodinaDrop('#GodinaDropdownEdit');
    OcjenaDrop('#OcjenaDropdown');
    OcjenaDrop('#OcjenaDropdownEdit');

});

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
        MentorDrop('#MentorDropdown');
        MentorDrop('#SumentorDropdown');
        MentorDrop('#PoMentoruDropdown');
        MentorDrop('#PoSumentoruDropdown');
        MentorDrop('#AzurirajSumentora');
        MentorDrop('#AzurirajMentora');
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
    $(document).ready(function () {
        PodrucjeDrop('#PodrucjeDropdown');
        PodrucjeDrop('#PoPodrucjeDropdown');
        PodrucjeDrop('#AzurirajPodrucje');
    });
    console.log(aPodrucjeRadaList);
});

function pretraziTablicu(data, lista) {
    var filtList = [];
    for (var i = 0; i < lista.length; i++) {
        data = data.toLowerCase();
        var naziv = lista[i].nazivRada.toLowerCase();

        if (naziv.includes(data)) {
            filtList.push(lista[i]);
        }
    }
    PopuniTablicuSearch(filtList);
}
function PopuniTablicuSearch(lista) {
    var oTablica = document.getElementById('TablicaPretrazivanje');
    oTablica.innerHTML = '';
    var nRbr = 1;
    for (var i = 0; i < lista.length; i++) {
        var sRow = '<tr><td>' + nRbr++ + '</td><td>' + lista[i].sifra + '</td><td>' + lista[i].nazivRada + '</td><td>' + dajPodrucje(lista[i].podrucjeRada) + '</td><td>' + dajMentora(lista[i].mentorId) + '</td><td>' + dajMentora(lista[i].sumentorId) + '</td><td>' + lista[i].student + '</td><td>' + lista[i].akGodina + '</td><td>' + lista[i].ocjena + '</td><td><span><button data-dismiss="modal" onclick="ModalAzurirajRad(\'' + lista[i].zavrsniKey + '\')" class="btn btn-info" data-toggle="modal"><span class="glyphicon glyphicon-pencil"></span></button></span></td><td><span><button class="btn btn-danger" data-toggle="modal" onclick="ObrisiRad(\'' + lista[i].zavrsniKey + '\')"><span class="glyphicon glyphicon-remove"></span></button></span></td></tr>';
        oTablica.innerHTML += sRow;
    }
}

function DodajRad() {
  
    var num = 10001;
    var nSifra = 0;
    var sig = 0;
    for (var i = 0; i < aZavrsniList.length; i++) {
        sig = 0;
        for (var j = 0; j < aZavrsniList.length; j++) {
            if (num == aZavrsniList[j].sifra) {
                num++;
                sig = 1;
            }
        }
        if (sig == 0) {
            nSifra = num;
        }
    }

    var sNazivRada = $('#inptNazivRada').val();
    var sPodrucjeRada = $('#PodrucjeDropdown').val();
    var sStudentIme = $('#txtStudentIme').val();
    var sMentorVal = $('#MentorDropdown').val();
    var sSumentorVal = $('#SumentorDropdown').val();
    var sGodinaDrop = $('#GodinaDropdown').val();
    var sOcjena = $('#OcjenaDropdown').val();

    // Generiranje novoga klju�a u bazi
    var zKey = firebase.database().ref().child('zavrsniRadovi').push().key;

    var oZavrsni =
    {
        akGodina: sGodinaDrop,
        mentorId: sMentorVal,
        nazivRada: sNazivRada,
        ocjena: sOcjena,
        podrucjeRada: sPodrucjeRada,
        sifra: nSifra,
        student: sStudentIme,
        sumentorId: sSumentorVal
    };
    // Zapi�i u Firebase
    //if (sNazivRada == null || sStudentIme == null) {
    //    alert("Niste unijeli sve podatke");
    //    console.log("Niste unijeli sve podatke");
    //}
    //else {
    var oZapis = {};
    oZapis[zKey] = oZavrsni;
    oDbZavrsniRadovi.update(oZapis);
    dodajAktivnost(1, sNazivRada);
    $('#dodaj-rad input').val('');
    //}  
}

//Dropdowns
function MentorDrop(dropid) {
    var oSelect = $(dropid);
    oSelect.find('select');
    oSelect.empty();
    aMentorList.forEach(oMentor => {
        var sSelect = '<option value="' + oMentor.mentorKey + '">' + oMentor.mentor + '</option>';
        oSelect.append(sSelect);
    });
}
function AkGodinaDrop(akGodId) {
    var oSelect = $(akGodId);
    oSelect.find('select');
    oSelect.empty();
    for (var i = 2020; i >= 1950; i--) {
        var sSelect = '<option value="' + i + '">' + i + '</option>';
        oSelect.append(sSelect);
    }
}
function OcjenaDrop(ocjId) {
    var oSelect = $(ocjId);
    oSelect.find('select');
    oSelect.empty();
    for (var i = 1; i <= 5; i++) {
        var sSelect = '<option value="' + i + '">' + i + '</option>';
        oSelect.append(sSelect);
    }
}
function PodrucjeDrop(podDropId) {
    var oSelect = $(podDropId);
    oSelect.find('select');
    oSelect.empty();
    aPodrucjeRadaList.forEach(function (oPodrucje) {
        var sSelect = '<option value="' + oPodrucje.podrucjeKey + '">' + oPodrucje.podrucje + '</option>';
        oSelect.append(sSelect);
    });
}

function Odabir(DdId) {
    var x = document.getElementById(DdId);
    var podatak = x.value;
    return podatak;
}

//GLAVNA TABLICA
function PopuniTablicuZavrsni(glavnaLista) {
    var oTablica = $('#TablicaZavrsni');
    var nRbr = 1;
    oTablica.find('tbody').empty();
    //aZavrsniList.forEach(oZavrsni => {
    for (var i = 0; i < glavnaLista.length; i++) {
        var sRow = '<tr><td>' + nRbr++ + '</td><td>' + glavnaLista[i].sifra + '</td><td>' + glavnaLista[i].nazivRada + '</td><td>' + dajPodrucje(glavnaLista[i].podrucjeRada) + '</td><td>' + dajMentora(glavnaLista[i].mentorId) + '</td><td>' + dajMentora(glavnaLista[i].sumentorId) + '</td><td>' + glavnaLista[i].student + '</td><td>' + glavnaLista[i].akGodina + '</td><td>' + glavnaLista[i].ocjena + '</td><td><span><button onclick="ModalAzurirajRad(\'' + glavnaLista[i].zavrsniKey + '\')" class="btn btn-info" data-toggle="modal"><span class="glyphicon glyphicon-pencil"></span></button></span></td><td><span><button class="btn btn-danger" data-toggle="modal" onclick="ObrisiRad(\'' + glavnaLista[i].zavrsniKey + '\')"><span class="glyphicon glyphicon-remove"></span></button></span></td></tr>';
        oTablica.append(sRow);
    }
    //});
}

//FILTRIRANE TABLICE
function radoviPoMentoru() {
    $('#tablica-po-mentoru').modal('show');
    var Table = document.getElementById("podaciTablicePoMentoru");
    Table.innerHTML = "";
    var oTablica = $('#TablicaPoMentoru');
    var nRbr = 1;
    aZavrsniList.forEach(oZavrsni => {
        if (oZavrsni.mentorId == (document.getElementById('PoMentoruDropdown').value)) {
            var sRow = '<tr><td>' + nRbr++ + '</td><td>' + oZavrsni.sifra + '</td><td>' + oZavrsni.nazivRada + '</td><td>' + dajPodrucje(oZavrsni.podrucjeRada) + '</td><td>' + dajMentora(oZavrsni.mentorId) + '</td><td>' + dajMentora(oZavrsni.sumentorId) + '</td><td>' + oZavrsni.student + '</td><td>' + oZavrsni.akGodina + '</td><td>' + oZavrsni.ocjena + '</td><td><span><button data-dismiss="modal" onclick="ModalAzurirajRad(\'' + oZavrsni.zavrsniKey + '\')" class="btn btn-info" data-toggle="modal"><span class="glyphicon glyphicon-pencil"></span></button></span></td><td><span><button class="btn btn-danger" data-toggle="modal" onclick="ObrisiRad(\'' + oZavrsni.zavrsniKey + '\')"><span class="glyphicon glyphicon-remove"></span></button></span></td></tr>';
            oTablica.append(sRow);
        }
    });
}

function radoviPoSumentoru() {
    $('#tablica-po-sumentoru').modal('show');
    var Table = document.getElementById("podaciTablicePoSumentoru");
    Table.innerHTML = "";
    var oTablica = $('#TablicaPoSumentoru');
    var nRbr = 1;
    aZavrsniList.forEach(oZavrsni => {
        if (oZavrsni.sumentorId == (document.getElementById('PoSumentoruDropdown').value)) {
            var sRow = '<tr><td>' + nRbr++ + '</td><td>' + oZavrsni.sifra + '</td><td>' + oZavrsni.nazivRada + '</td><td>' + dajPodrucje(oZavrsni.podrucjeRada) + '</td><td>' + dajMentora(oZavrsni.mentorId) + '</td><td>' + dajMentora(oZavrsni.sumentorId) + '</td><td>' + oZavrsni.student + '</td><td>' + oZavrsni.akGodina + '</td><td>' + oZavrsni.ocjena + '</td><td><span><button data-dismiss="modal" onclick="ModalAzurirajRad(\'' + oZavrsni.zavrsniKey + '\')" class="btn btn-info" data-toggle="modal"><span class="glyphicon glyphicon-pencil"></span></button></span></td><td><span><button class="btn btn-danger" data-toggle="modal" onclick="ObrisiRad(\'' + oZavrsni.zavrsniKey + '\')"><span class="glyphicon glyphicon-remove"></span></button></span></td></tr>';
            oTablica.append(sRow);
        }
    });
}

function radoviPoPodrucju() {
    $('#tablica-po-podrucju').modal('show');
    var Table = document.getElementById("podaciTablicePoPodrucju");
    Table.innerHTML = "";
    var oTablica = $('#TablicaPoPodrucju');
    var nRbr = 1;
    aZavrsniList.forEach(oZavrsni => {
        if (oZavrsni.podrucjeRada == (document.getElementById('PoPodrucjeDropdown').value)) {
            var sRow = '<tr><td>' + nRbr++ + '</td><td>' + oZavrsni.sifra + '</td><td>' + oZavrsni.nazivRada + '</td><td>' + dajPodrucje(oZavrsni.podrucjeRada) + '</td><td>' + dajMentora(oZavrsni.mentorId) + '</td><td>' + dajMentora(oZavrsni.sumentorId) + '</td><td>' + oZavrsni.student + '</td><td>' + oZavrsni.akGodina + '</td><td>' + oZavrsni.ocjena + '</td><td><span><button data-dismiss="modal" onclick="ModalAzurirajRad(\'' + oZavrsni.zavrsniKey + '\')" class="btn btn-info" data-toggle="modal"><span class="glyphicon glyphicon-pencil"></span></button></span></td><td><span><button class="btn btn-danger" data-toggle="modal" onclick="ObrisiRad(\'' + oZavrsni.zavrsniKey + '\')"><span class="glyphicon glyphicon-remove"></span></button></span></td></tr>';
            oTablica.append(sRow);
        }
    });
}

function dajMentora(mKey) {
    var name = '';
    aMentorList.forEach(oMentor => {
        if (mKey == oMentor.mentorKey) {
            name = oMentor.mentor;
        }
    });
    return name;
}
function dajPodrucje(pKey) {
    var pdcj = '';
    aPodrucjeRadaList.forEach(oPodrucje => {
        if (pKey == oPodrucje.podrucjeKey) {
            pdcj = oPodrucje.podrucje;
        }
    });
    return pdcj;
}

function ObrisiRad(radKey) {
    var obrisaniRad = '';
    for (var i = 0; i < aZavrsniList.length; i++) {
        if (radKey == aZavrsniList[i].zavrsniKey) {
            obrisaniRad = aZavrsniList[i].nazivRada;
        }
    }
    var oRadRef = oDb.ref('zavrsniRadovi/' + radKey);
    oRadRef.remove();
    dodajAktivnost(3, obrisaniRad);
}

function ModalAzurirajRad(sRadKey) {
    var oRadRef = oDb.ref('zavrsniRadovi/' + sRadKey);
    oRadRef.once('value', function (oOdgovorPosluzitelja) {
        var oRad = oOdgovorPosluzitelja.val();
        console.log(oRad);
        //Popunjavanje elemenata forme za ure�ivanje
        $('#GodinaDropdownEdit').val(oRad.akGodina);
        $('#AzurirajMentora').val(oRad.mentorId);
        $('#inptNazivRadaEdit').val(oRad.nazivRada);
        $('#OcjenaDropdownEdit').val(oRad.ocjena);
        $('#AzurirajPodrucje').val(oRad.podrucjeRada);
        $('#txtStudentImeEdit').val(oRad.student);
        $('#AzurirajSumentora').val(oRad.sumentorId);

        $('#AzurirajRad').attr('onclick', 'SpremiAzuriraniRad("' + sRadKey + '")');

        $('#azuriraj-rad').modal('show');
    });
}

function sifraEdit(sKey) {
    var sifra;
    for (var i = 0; i < aZavrsniList.length; i++) {
        if (aZavrsniList[i].zavrsniKey == sKey) {
            sifra = aZavrsniList[i].sifra;
        }
    }
    return sifra;
}

function SpremiAzuriraniRad(sRadKey) {
    var oRadRef = oDb.ref('zavrsniRadovi/' + sRadKey);
    var setSifra = sifraEdit(sRadKey);

    var radGodinaEdit = $('#GodinaDropdownEdit').val();
    var radMentorEdit = $('#AzurirajMentora').val();
    var radNazivRadaEdit = $('#inptNazivRadaEdit').val();
    var radOcjenaEdit = $('#OcjenaDropdownEdit').val();
    var radPodrucjeEdit = $('#AzurirajPodrucje').val(); 0
    var radStudentEdit = $('#txtStudentImeEdit').val();
    var radSumentorEdit = $('#AzurirajSumentora').val();

    var oRad = {
        akGodina: radGodinaEdit,
        mentorId: radMentorEdit,
        nazivRada: radNazivRadaEdit,
        ocjena: radOcjenaEdit,
        podrucjeRada: radPodrucjeEdit,
        sifra: setSifra,
        student: radStudentEdit,
        sumentorId: radSumentorEdit
    }
    oRadRef.update(oRad);
    dodajAktivnost(2, radNazivRadaEdit);
}

//Funkcija za dodavanje aktivnosti
function dodajAktivnost(id, naziv) {
    aAktivnostList = [];
    var obavljenaradnja = id;
    var radNaziv = naziv;

    //dohvacanje datuma i vremena
    var today = new Date();
    var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var datum_vrijeme = date + ' ' + time;

    var sKey = firebase.database().ref().child('aktivnost').push().key;

    var oAktivnost = {
        dateTime: datum_vrijeme,
        rad: radNaziv,
        radnja: obavljenaradnja
    }
    // Zapi�i u Firebase
    var oZapis = {};
    oZapis[sKey] = oAktivnost;
    oDbAktivnosti.update(oZapis);
}

//Get to top button
var mybutton = document.getElementById("myBtn");

// Tipka se prikazuje kada scrollamo dole 20 px
window.onscroll = function () { scrollFunction() };
function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}
// Kada korisnik ppritisne tipku 'Top' vraca se na vrh stranice
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}