
var loadBtn = document.getElementById("loadBtn");
var pathInput = document.getElementById("pathInput");
let xhr = new XMLHttpRequest();


loadBtn.addEventListener("click", function() {
    
    xhr.responseType = 'document';
    xhr.open("GET", pathInput.value);
    xhr.send();

  });

var saveBtn = document.getElementById("saveBtn");


xhr.onload = function() {
    var xmlDocument = xhr.response;


    // save file 
    saveBtn.addEventListener("click", function() {
      function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
      
        element.style.display = 'none';
        document.body.appendChild(element);
      
        element.click();
      
        document.body.removeChild(element);
      }


      var s = new XMLSerializer();
      var newXmlStr = s.serializeToString(xmlDocument);
      console.log(newXmlStr);
      download("output.xml", newXmlStr);


    }) 



    var body = document.getElementsByTagName('body')[0];

    // Animals Table
    var animals = xmlDocument.getElementsByTagName("animal");
    var tbl = document.createElement('table');
    tbl.classList.add("animalsTable");

    var thead = document.createElement('thead');
    var headrow = document.createElement('tr');

    var idheading = document.createElement('th');
    idheading.innerHTML = "ID";
    var sidheading = document.createElement('th');
    sidheading.innerHTML = "SID_REF";
    nameheading = document.createElement('th');
    nameheading.innerHTML = "Name";
    birthHeading = document.createElement('th');
    birthHeading.innerHTML = "Birth Date";
    runHeading = document.createElement('th');
    runHeading.innerHTML = "Run";
    weightHeading = document.createElement('th');
    weightHeading.innerHTML = "Weight";
    priceHeading = document.createElement('th');
    priceHeading.innerHTML = "Price";
    var modifyHeading = document.createElement('th');
    modifyHeading.innerHTML = "Modify";
    var deleteHeading = document.createElement('th');
    deleteHeading.innerHTML = "Delete";

    headrow.append(idheading, sidheading, nameheading, birthHeading, runHeading, weightHeading, priceHeading, modifyHeading, deleteHeading);
    thead.appendChild(headrow);
    tbl.appendChild(thead);

    var tbdy = document.createElement('tbody');


        // create row for adding animal:

        let row = document.createElement('tr');

        var colID = document.createElement('td');
        var IDInput = document.createElement('input');
        IDInput.setAttribute('disabled', true);
        IDInput.value = "auto";
        colID.appendChild(IDInput);
    
        var colSIDREF = document.createElement('td');
        var SIDREFInput = document.createElement('select');
        SIDREFInput.id = "speciesInputForAnimal";
    
        // add options to select: ( one for each individual species )
        var species = xmlDocument.getElementsByTagName("species");
        for (const spec of species) {
          var option = document.createElement('option');
          option.innerHTML = spec.getAttribute('sid') + " = " + spec.innerHTML ;
          option.setAttribute('value', spec.getAttribute('sid'));
          SIDREFInput.appendChild(option);
        }
        colSIDREF.appendChild(SIDREFInput);
    
    
        colName = document.createElement('td');
        nameInput = document.createElement('input');
        nameInput.id = "nameInputForAnimal";
        colName.appendChild(nameInput);
      
    
        colBirth = document.createElement('td');
        birthInput = document.createElement('input');
        birthInput.id = "birthInputForAnimal";
        colBirth.appendChild(birthInput);
    
    
        colRun = document.createElement('td');
        runInput = document.createElement('input');
        runInput.id = "runInputForAnimal"; 
        colRun.appendChild(runInput);
    
        colWeight = document.createElement('td');
        weightInput = document.createElement('input');
        weightInput.id = "weightInputForAnimal";
        colWeight.appendChild(weightInput);
    
        colPrice = document.createElement('td');
        priceInput = document.createElement('input');
        priceInput.id = "priceInputForAnimal";
        colPrice.appendChild(priceInput);
    
        colAction = document.createElement('td');
        addBtn = document.createElement('button');
        addBtn.innerHTML = "add";
        colAction.appendChild(addBtn);
        
      
        addBtn.addEventListener("click", (e) => {
          
          // calculate next ID
          let animals = xmlDocument.getElementsByTagName('animal');
          let lastID = animals[animals.length-1].getAttribute('aid');
          
          const regex = /\d+/g;
          const found = lastID.match(regex);
          let integer = parseInt(found[0], 10);
          integer = integer + 1;
          let nextID = "A_" + integer.toString();
          console.log(nextID);
    
          // get species
          let spec = document.getElementById("speciesInputForAnimal").value;
          
          // get name
          let name = document.getElementById("nameInputForAnimal").value;
    
          // get birthdate
          let birthdate = document.getElementById("birthInputForAnimal").value;
    
          // get run
          let run = document.getElementById("runInputForAnimal").value;
    
          // get weight
          let weight = document.getElementById("weightInputForAnimal").value;
    
          // get price
          let price = document.getElementById("priceInputForAnimal").value;
    
          if (verifyParams(name, birthdate, run, weight, price)) {
            // create animal here
            // createAnimal(nextID, spec, name, birthdate, run, weight, price);
            
            let animalElement = xmlDocument.createElement("animal");
            animalElement.setAttribute('aid', nextID);
            animalElement.setAttribute('species', spec);
            let nameElement = xmlDocument.createElement("name");
            nameElement.innerHTML = name;
            let birthDateElement = xmlDocument.createElement("birthDate");
            birthDateElement.innerHTML = birthdate;
            let runElement = xmlDocument.createElement("run");
            runElement.innerHTML = run;
            let weightElement = xmlDocument.createElement("weight");
            weightElement.innerHTML = weight;
            weightElement.setAttribute("unit", "kg");
            let priceElement = xmlDocument.createElement("estimatedValue");
            priceElement.innerHTML = price;     
            priceElement.setAttribute("currency", "USD");
            
            animalElement.append(nameElement, birthDateElement, runElement, weightElement, priceElement);
    
            // add to xml object
            xmlDocument.getElementsByTagName("animals")[0].appendChild(animalElement);
            console.log(xmlDocument);
    
            // add to view ( create row and append to table)
    
            let row = document.createElement('tr');
            var idcol = document.createElement('td');
            idcol.innerHTML = animalElement.getAttribute('aid');
    
            var sidcol = document.createElement('td');
            sidcol.innerHTML = animalElement.getAttribute('species');
            sidcol.setAttribute('sidRef', animalElement.getAttribute('species'));
            row.append(idcol, sidcol);
    
            
    
            for (let i = 0; i < 5; i++) {
                let att = animalElement.childNodes[i].innerHTML;
                column = document.createElement('td');
                column.innerHTML = att;
                column.setAttribute("contenteditable", true);
                row.appendChild(column);
              }
    
              modifyBtn = document.createElement('button');
              modifyBtn.setAttribute('aid', animalElement.getAttribute('aid')); // powiazac button z animalem
              modifyBtn.classList.add("modifyBtn");
              modifyBtn.innerHTML = 'modify';
    
              modifyBtn.addEventListener("click", (e) => {
                console.log("XDD");
                var aid = e.target.getAttribute('aid');
                console.log(e.target.parentElement);
                console.log(e.target.parentElement.parentElement);
              })
    
    
              delBtn = document.createElement('button');
              delBtn.setAttribute('aid', animalElement.getAttribute('aid')); // powiazac button z animalem
              delBtn.classList.add("deleteBtn");
              delBtn.innerHTML = 'delete';
    
              delBtn.addEventListener("click", (e) => {
                var aid = e.target.getAttribute('aid');
                xmlDocument.querySelector(`[aid='${aid}']`).remove();
                e.target.parentElement.parentElement.remove();
              })
    
              column = document.createElement('td');
              column.appendChild(modifyBtn);
              row.appendChild(column);
    
              var colDel = document.createElement('td');
              colDel.appendChild(delBtn);
              row.appendChild(colDel);
    
              tbdy.appendChild(row);
    
    
            // xmlDocument.getElementsByTagName('animals')[0].appendChild(animal);
          } else {
            console.log("params are bad");
          }
    
    
        })
    
    
    
        
        row.append(colID, colSIDREF, colName, colBirth, colRun, colWeight, colPrice, colAction);
        tbdy.appendChild(row);


    // create row for each animal
    for (let animal of animals) {
        row = document.createElement('tr');
        var idcol = document.createElement('td');
        idcol.innerHTML = animal.getAttribute('aid');

        var sidcol = document.createElement('td');
        sidcol.innerHTML = animal.getAttribute('species');
        sidcol.setAttribute('sidRef', animal.getAttribute('species'));
        sidcol.setAttribute("contenteditable", true);
        row.append(idcol, sidcol);

        for (let i = 1; i <= 9; i+=2) {
            att = animal.childNodes[i].innerHTML
            column = document.createElement('td');
            column.innerHTML = att;
            column.setAttribute("contenteditable", true);
            row.appendChild(column);
          }

          modifyBtn = document.createElement('button');
          modifyBtn.setAttribute('aid', animal.getAttribute('aid')); // powiazac button z animalem
          modifyBtn.classList.add("modifyBtn");
          modifyBtn.innerHTML = 'modify';

          modifyBtn.addEventListener("click", (e) => {

            // var aid = e.target.getAttribute('aid');
            // console.log(e.target.parentElement);
            let currentRow = e.target.parentElement.parentElement;
            let childs = currentRow.childNodes;
            
            // get ID
            let id = childs[0].innerHTML;
            // get species
            let spec = childs[1].innerHTML;
            
            // get name
            let name = childs[2].innerHTML;;
      
            // get birthdate
            let birthdate = childs[3].innerHTML;;
      
            // get run
            let run = childs[4].innerHTML;;
      
            // get weight
            let weight = childs[5].innerHTML;;
      
            // get price
            let price = childs[6].innerHTML;;
      
            if (verifyParams(name, birthdate, run, weight, price)) {
              console.log(id, spec, name, birthdate, run, weight, price);

              // create new Animal

              let animalElement = xmlDocument.createElement("animal");
              animalElement.setAttribute('aid', id);
              animalElement.setAttribute('species', spec);
              let nameElement = xmlDocument.createElement("name");
              nameElement.innerHTML = name;
              let birthDateElement = xmlDocument.createElement("birthDate");
              birthDateElement.innerHTML = birthdate;
              let runElement = xmlDocument.createElement("run");
              runElement.innerHTML = run;
              let weightElement = xmlDocument.createElement("weight");
              weightElement.innerHTML = weight;
              weightElement.setAttribute("unit", "kg");
              let priceElement = xmlDocument.createElement("estimatedValue");
              priceElement.innerHTML = price;     
              priceElement.setAttribute("currency", "USD");
              
              animalElement.append(nameElement, birthDateElement, runElement, weightElement, priceElement);

              // replaceChild in xmlObject element

              let current = xmlDocument.querySelector(`[aid='${id}']`);
              current.replaceWith(animalElement);
              currentRow.classList.remove("failureModificationRow");
              currentRow.classList.add("successModificationRow");
            } else {
              currentRow.classList.remove("successModificationRow");
              currentRow.classList.add("failureModificationRow");
            }

          })


          delBtn = document.createElement('button');
          delBtn.setAttribute('aid', animal.getAttribute('aid')); // powiazac button z animalem
          delBtn.classList.add("deleteBtn");
          delBtn.innerHTML = 'delete';

          delBtn.addEventListener("click", (e) => {
            var aid = e.target.getAttribute('aid');
            xmlDocument.querySelector(`[aid='${aid}']`).remove();
            e.target.parentElement.parentElement.remove();
          })

          column = document.createElement('td');
          column.appendChild(modifyBtn);
          row.appendChild(column);

          var colDel = document.createElement('td');
          colDel.appendChild(delBtn);
          row.appendChild(colDel);
      
        tbdy.appendChild(row);
    }


    tbl.appendChild(tbdy);
    body.appendChild(tbl);


    // kindsOfSpecies table

    var species = xmlDocument.getElementsByTagName("species");
    var speciesTbl = document.createElement('table');
    speciesTbl.classList.add("speciesTable");

    specieshead = document.createElement('thead');
    speciesheading = document.createElement('tr');
    sid = document.createElement('th');
    sid.innerHTML = "SID";
    speciesName = document.createElement('th');
    speciesName.innerHTML = 'Species Name';
    var speciesDeleteAction = document.createElement('th');
    speciesDeleteAction.innerHTML = 'Delete';
    var speciesModifyAction = document.createElement('th');
    speciesModifyAction.innerHTML = 'Modify';

    speciesheading.append(sid, speciesName, speciesModifyAction, speciesDeleteAction);
    specieshead.appendChild(speciesheading);
    speciesTbl.appendChild(specieshead);


    speciesTblBody = document.createElement('tbody');


        // adding row
        row = document.createElement('tr');

        var colSID = document.createElement('td');
        var sidInput = document.createElement('input');
        sidInput.setAttribute("disabled", true);
        sidInput.value = "auto";
        colSID.appendChild(sidInput);
    
        var colSpecies = document.createElement('td');
        var speciesInput = document.createElement('input');
        speciesInput.id = "nameInputForSpecies";
        colSpecies.appendChild(speciesInput);
    
        var colAction = document.createElement('td');
        var addSpeciesBtn = document.createElement('button');
        addSpeciesBtn.innerHTML = "add";
        colAction.appendChild(addSpeciesBtn);
    
    
        addSpeciesBtn.addEventListener("click", (e) => {
          
            // calculate next ID
            let animals = xmlDocument.getElementsByTagName('species');
            let lastID = animals[animals.length-1].getAttribute('sid');
            
            let regex = /\d+/g;
            let found = lastID.match(regex);
            let integer = parseInt(found[0], 10);
            integer = integer + 1;
            let nextID = "_" + integer.toString();
            console.log(nextID);
      
            // get name
            let specName = document.getElementById("nameInputForSpecies").value;
            regex = /^[\w\s]+$/g;
            found = specName.match(regex);
            if (!(found == null)) {
              // create species element
              let spec = xmlDocument.createElement("species");
              spec.setAttribute('sid', nextID);
              spec.innerHTML = specName;

              // add element to xml object
              xmlDocument.getElementsByTagName("kindsOfSpecies")[0].appendChild(spec);
              console.log(xmlDocument);

              // add next option SID_REF select input
              let select = document.getElementById("speciesInputForAnimal");
              let option = document.createElement("option");
              option.innerHTML = nextID + " = " + spec.innerHTML;
              option.setAttribute('value', nextID);
              select.appendChild(option);

              // create row
              let row = document.createElement('tr');
              let sidcol = document.createElement('td');
              sidcol.innerHTML = spec.getAttribute('sid');
      
              var speciesNameCol = document.createElement('td');
              speciesNameCol.setAttribute("contenteditable", true);
              speciesNameCol.innerHTML = spec.innerHTML;
              

              
              // create action buttons for this row

              var roomForBtn = document.createElement('td');
              var modifyBtn = document.createElement('button');
              modifyBtn.setAttribute('sid', nextID);
              modifyBtn.innerHTML = "modify";
    
              roomForBtn.appendChild(modifyBtn);
      
              modifyBtn.addEventListener("click", (e) => {
                //1. Change xml object
                console.log(e.target.getAttribute('sid'));
                let sid = e.target.getAttribute('sid');
                let row = e.target.parentElement.parentElement;
                let speciesName = row.childNodes[1].innerHTML;
                let regex = /^[a-zA-Z\s]+$/g;
      
                let found = speciesName.match(regex);
                if (found == null){
                  row.classList.remove("successModificationRow");
                  row.classList.add("failureModificationRow");
                  return false;
                } else {
      
                  let currentSpeciesElement = xmlDocument.querySelector(`[sid='${sid}']`);
                  currentSpeciesElement.innerHTML = speciesName;
                  console.log(xmlDocument);
                  // modify in place - only one property could change anyway
                  row.classList.remove("failureModificationRow");
                  row.classList.add("successModificationRow");
                }
                //2. Change options in SID_REF select in animalsTable
      
                let modifyingOption = document.querySelector(`[value='${sid}']`);
                modifyingOption.innerHTML = sid + " = " + speciesName;
              });


              var roomForBtn1 = document.createElement('td');
              var deleteBtn = document.createElement('button');
              deleteBtn.innerHTML = "delete";
              deleteBtn.setAttribute('sid', spec.getAttribute('sid'));
      
              deleteBtn.addEventListener("click", (e) => {
                var sid = e.target.getAttribute('sid');
                xmlDocument.querySelector(`[sid='${sid}']`).remove();
                e.target.parentElement.parentElement.remove();
      
                // remove from XML object
                let specieslst = xmlDocument.querySelectorAll(`[species='${sid}']`);
                specieslst.forEach(element => {
                  element.remove();
                });
      
                // remove from view
                let sidRefsLst = document.querySelectorAll(`[sidRef='${sid}']`);
                sidRefsLst.forEach(element => {
                  element.parentElement.remove();
                });
              })
      
              row.append(sidcol, speciesNameCol, roomForBtn, roomForBtn1);
              roomForBtn1.appendChild(deleteBtn);
              
              
              speciesTblBody.appendChild(row);
            }

        });
        
        speciesTblBody.appendChild(row);
        row.append(colSID, colSpecies, colAction);
    



    // create row for each species
    for (const spec of species) {
        row = document.createElement('tr');

        sid = document.createElement('td');
        sid.innerHTML = spec.getAttribute('sid');

        var name = document.createElement('td');
        name.setAttribute("contenteditable", true);
        name.innerHTML = spec.childNodes[0].data;

        
        speciesTblBody.appendChild(row);


        var roomForBtn = document.createElement('td');
        var modifyBtn = document.createElement('button');
        modifyBtn.setAttribute('sid', spec.getAttribute('sid'));
        modifyBtn.innerHTML = "modify";

        roomForBtn.appendChild(modifyBtn);


        modifyBtn.addEventListener("click", (e) => {
          //1. Change xml object
          let sid = e.target.getAttribute('sid');
          let row = e.target.parentElement.parentElement;
          let speciesName = row.childNodes[1].innerHTML;
          let regex = /^[a-zA-Z\s]+$/g;

          let found = speciesName.match(regex);
          if (found == null){
            row.classList.remove("successModificationRow");
            row.classList.add("failureModificationRow");
            return false;
          } else {

            let currentSpeciesElement = xmlDocument.querySelector(`[sid='${sid}']`);
            currentSpeciesElement.innerHTML = speciesName;
            console.log(xmlDocument);
            // modify in place - only one property could change anyway
            row.classList.remove("failureModificationRow");
            row.classList.add("successModificationRow");
          }
          //2. Change options in SID_REF select in animalsTable

          let modifyingOption = document.querySelector(`[value='${sid}']`);
          modifyingOption.innerHTML = sid + " = " + speciesName;
        });


        var roomForBtn1 = document.createElement('td');
        var deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = "delete";
        deleteBtn.setAttribute('sid', spec.getAttribute('sid'));

        deleteBtn.addEventListener("click", (e) => {
          var sid = e.target.getAttribute('sid');
          xmlDocument.querySelector(`[sid='${sid}']`).remove();
          e.target.parentElement.parentElement.remove();

          // remove from XML object
          let specieslst = xmlDocument.querySelectorAll(`[species='${sid}']`);
          specieslst.forEach(element => {
            element.remove();
          });

          // remove from view
          let sidRefsLst = document.querySelectorAll(`[sidRef='${sid}']`);
          sidRefsLst.forEach(element => {
            element.parentElement.remove();
          });
        })


        roomForBtn1.appendChild(deleteBtn);


        row.append(sid, name, roomForBtn, roomForBtn1);
    }

    speciesTbl.append(speciesTblBody);
    body.appendChild(speciesTbl);


  };


xhr.onerror = function() { // only triggers if the request couldn't be made at all
  alert(`Sth went wrong`);
};

function verifyParams(animalName, birthdate, run, weight, price) {

  //name
  let regex = /^[a-zA-Z\s]+$/g;
  let found = animalName.match(regex);
  if (found == null){
    return false;
  }

  // birthDate
  regex = /^\d{4}-\d{2}-\d{2}$/g;
  found = birthdate.match(regex);
  if (found == null){
    return false;
  }

  // run
  regex = /^[A-Z]+\d+$/g;
  found = run.match(regex);
  if (found == null) {
    return false;
  }

  // weight
  regex = /^\d+\.\d+$/g;
  found = weight.match(regex);
  if (found == null) {
    return false;
  }

  // price
  regex = /^\d+\.\d{2}$/g; 
  found = price.match(regex);
  if (found == null) {
    return false;
  }

  return true;
}


