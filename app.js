var fs      = require('fs'),
    util    = require('util'),
    xml2js  = require('xml2js'),
    express = require("express"),
    bodyParser = require("body-parser");
 
var parser = new xml2js.Parser();
var app = express();
var port = 3000;
var fileToParse = "./public/examples/digimeds_example1.xml";

//global.fileToValidate = "test.xml";

// Serve Static Assets
app.use(express.static("public"));
// Virtual Path Prefix '/static'
app.use('/static', express.static('public'))

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/",function(req,res){
  res.render("home");
});


app.get("/single",function(req,res){

  console.log("Attempting to parse: " +  fileToParse);

  fs.readFile('./' +  fileToParse, (err, data) => {
    if (err) {
      console.error(err)
      return
    }

    parser.parseString(data, function (err, result) {
        //console.dir(result);
        //console.log(util.inspect(result, false, null));

        var numberOfResources = result.Bundle.entry.length - 1;
        console.log("Digimeds numberOfResources : " + numberOfResources);
        console.log("Digimeds type : " + typeof numberOfResources);

        // MessageHeader resource
        global.type = result.Bundle.type[0].$.value;

        for (i = 1; i <= numberOfResources; i++) {
          var tempResource = JSON.stringify( result.Bundle.entry[i].resource[0] );
          var endBit = tempResource.indexOf('":');
          var tempResource2 = tempResource.slice(2,endBit);
          console.log("Resource : " + i + " " + tempResource2);


          if (tempResource2 == "Encounter")  {
           // Encounter resource
            global.encounterStatus   = result.Bundle.entry[i].resource[0].Encounter[0].status[0].$.value;
          }

          if (tempResource2 == "Patient")  {
            // Patient resource
            global.nhsnumber          = result.Bundle.entry[i].resource[0].Patient[0].identifier[0].value[0].$.value;
            global.patGiven           = result.Bundle.entry[i].resource[0].Patient[0].name[0].given[0].$.value;
            global.patFamily          = result.Bundle.entry[i].resource[0].Patient[0].name[0].family[0].$.value;
            global.patGender          = result.Bundle.entry[i].resource[0].Patient[0].gender[0].$.value;
            global.patDOB1            = result.Bundle.entry[i].resource[0].Patient[0].birthDate[0].$.value;
          }

         if (tempResource2 == "Immunization")  {
           // Immunization resource
            global.vaccineProcedureCode    = result.Bundle.entry[i].resource[0].Immunization[0].extension[1].valueCodeableConcept[0].coding[0].code[0].$.value;
            global.vaccineProcedureDisplay = result.Bundle.entry[i].resource[0].Immunization[0].extension[1].valueCodeableConcept[0].coding[0].display[0].$.value;    
            global.notGiven           = result.Bundle.entry[i].resource[0].Immunization[0].notGiven[0].$.value;
            global.vaccineCodeSNOMED  = result.Bundle.entry[i].resource[0].Immunization[0].vaccineCode[0].coding[0].code[0].$.value;
            global.vaccineCodeDisplay = result.Bundle.entry[i].resource[0].Immunization[0].vaccineCode[0].coding[0].display[0].$.value;
            global.dateChar           = result.Bundle.entry[i].resource[0].Immunization[0].date[0].$.value; 
            global.siteCodeSNOMED     = result.Bundle.entry[i].resource[0].Immunization[0].site[0].coding[0].code[0].$.value;
            global.siteCodeDisplay    = result.Bundle.entry[i].resource[0].Immunization[0].site[0].coding[0].display[0].$.value;
            global.routeCodeSNOMED    = result.Bundle.entry[i].resource[0].Immunization[0].route[0].coding[0].code[0].$.value;
            global.routeCodeDisplay   = result.Bundle.entry[i].resource[0].Immunization[0].route[0].coding[0].display[0].$.value;
            global.batchNumber        = result.Bundle.entry[i].resource[0].Immunization[0].lotNumber[0].$.value; 
            global.expirationDate     = result.Bundle.entry[i].resource[0].Immunization[0].expirationDate[0].$.value; 
          }

          if (tempResource2 == "Practitioner")  {
            // Practitioner resource
            //global.pracPrefix         = result.Bundle.entry[i].resource[0].Practitioner[0].name[0].prefix[0].$.value;
            global.pracGiven          = result.Bundle.entry[i].resource[0].Practitioner[0].name[0].given[0].$.value;
            global.pracFamily         = result.Bundle.entry[i].resource[0].Practitioner[0].name[0].family[0].$.value;
            global.pracRegCodeURI     = result.Bundle.entry[i].resource[0].Practitioner[0].identifier[0].system[0].$.value;
            global.pracRegCode        = result.Bundle.entry[i].resource[0].Practitioner[0].identifier[0].value[0].$.value;
          }

/*
          if (tempResource2 == "Organization")  {
            // Organization resource
            global.orgODS             = result.Bundle.entry[i].resource[0].Organization[0].identifier[0].value[0].$.value;
            global.orgName            = result.Bundle.entry[i].resource[0].Organization[0].name[0].$.value;
          }
*/

/*
          if (tempResource2 == "HealthcareService")  {
            // HealthcareService resource
            global.hcsSNOMED           = result.Bundle.entry[i].resource[0].HealthcareService[0].type[0].coding[0].code[0].$.value;
            global.hcsDisplay          = result.Bundle.entry[i].resource[0].HealthcareService[0].type[0].coding[0].display[0].$.value;
          }
 */
        }
    });

    res.render("digimeds1.ejs");
    
  })
});

// Set placeholder values for optional FHIR resources
global.hcsSNOMED = "NA";
global.hcsDisplay = "NA";
global.pracPrefix  = "NA";
global.pracGiven   = "NA";
global.pracFamily  = "NA";
global.pracSDS    = "NA";

app.listen(port, () => console.log("Server started and listening on port " + port ));