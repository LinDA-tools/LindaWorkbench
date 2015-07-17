lindaGlobals = {
	"prefixes": {},
	"validUrl": false,
	"used_prefixes": {},
	/*
	"ajax": {
		"predicate": {
			type: 'GET',
			dataType: 'jsonp',
			data: { 'q': "" },
			//data: { 'class_property': recent_textinput.value },
			url: "http://linda.epu.ntua.gr:8000/coreapi/recommend/",
		},
		"object": {
			type: 'GET',
			dataType: 'json',
			//url: "http://localhost:8000/transformation/lookup/"+domain+"/"+term+"/",
			url: 'http://lookup.dbpedia.org/api/search/KeywordSearch?QueryClass=' + domain + '&QueryString=' + term,
		},
		"enrich": {
			type: 'GET',
			dataType: 'jsonp',
			data: { 'q': "" },
			//data: { 'q': recent_textinput.value },
			url: "http://linda.epu.ntua.gr:8000/coreapi/recommend/",
		}
	}*/
}

//supress Enter key for form
function stopRKey(evt) {
  var evt = (evt) ? evt : ((event) ? event : null);
  var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
  if ((evt.keyCode == 13) && (node.type=="text"))  {return false;}
}

document.onkeypress = stopRKey;



//from http://linda.epu.ntua.gr:8000/api/vocabularies/versions/
lindaGlobals.prefixes = {
"http://www.ontotext.com/proton/protontop#": "ptop",
"http://www.openarchives.org/ore/terms/": "ore",
"http://www.opengis.net/ont/geosparql": "gsp",
"http://www.opengis.net/ont/gml": "gml",
"http://www.opengis.net/ont/sf#": "sf",
"http://www.opmw.org/ontology/": "opmw",
"http://www.ordnancesurvey.co.uk/ontology/Topography/v0.1/Topography.owl#": "ostop",
"http://www.samos.gr/ontologies/helpdeskOnto.owl#": "hdo",
"http://www.semanticdesktop.org/ontologies/2007/01/19/nie": "nie",
"http://www.semanticdesktop.org/ontologies/2007/03/22/nco#": "nco",
"http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#": "nfo",
"http://www.semanticdesktop.org/ontologies/2007/04/02/ncal#": "ncal",
"http://www.semanticdesktop.org/ontologies/2007/08/15/nao": "nao",
"http://www.semanticdesktop.org/ontologies/2007/08/15/nrl": "nrl",
"http://www.semanticweb.org/ontologies/2008/11/OntologySecurity.owl#": "ontosec",
"http://www.sensormeasurement.appspot.com/ont/transport/traffic": "traffic",
"http://www.tele.pw.edu.pl/~sims-onto/ConnectivityType.owl#": "ct",
"http://www.telegraphis.net/ontology/geography/geography#": "geos",
"http://www.telegraphis.net/ontology/measurement/measurement#": "msr",
"http://www.telegraphis.net/ontology/measurement/quantity#": "quty",
"http://www.w3.org/1999/02/22-rdf-syntax-ns#": "rdf",
"http://www.w3.org/1999/xhtml/vocab": "xhv",
"http://www.w3.org/2000/01/rdf-schema#": "rdfs",
"http://www.w3.org/2000/10/swap/log#": "log",
"http://www.w3.org/2000/10/swap/pim/contact#": "con",
"http://acm.rkbexplorer.com/ontologies/acm#": "acm",
"http://aims.fao.org/aos/geopolitical.owl": "geop",
"http://www.w3.org/2000/10/swap/pim/doc#": "doc",
"http://www.w3.org/2001/02pd/rec54#": "rec54",
"http://www.w3.org/2001/sw/hcls/ns/transmed/": "tmo",
"http://www.w3.org/2002/07/owl": "owl",
"http://www.w3.org/2002/12/cal/ical": "cal",
"http://www.w3.org/2003/01/geo/wgs84_pos": "geo",
"http://www.w3.org/2003/06/sw-vocab-status/ns": "vs",
"http://www.w3.org/2003/11/swrl": "swrl",
"http://www.w3.org/2003/12/exif/ns": "exif",
"http://www.w3.org/2003/g/data-view": "grddl",
"http://www.w3.org/2004/02/skos/core": "skos",
"http://www.w3.org/2004/03/trix/rdfg-1/": "rdfg",
"http://www.w3.org/2004/03/trix/swp-1/": "swp",
"http://archivi.ibc.regione.emilia-romagna.it/ontology/eac-cpf/": "eac-cpf",
"http://bblfish.net/work/atom-owl/2006-06-06/": "awol",
"http://bibframe.org/vocab": "bf",
"http://code-research.eu/ontology/visual-analytics#": "va",
"http://commontag.org/ns#": "ctag",
"http://contextus.net/ontology/ontomedia/core/expression": "oc",
"http://contextus.net/ontology/ontomedia/core/space#": "osr",
"http://contextus.net/ontology/ontomedia/ext/common/being#": "being",
"http://contextus.net/ontology/ontomedia/ext/common/trait#": "trait",
"http://contextus.net/ontology/ontomedia/misc/date#": "date",
"http://courseware.rkbexplorer.com/ontologies/courseware#": "crsw",
"http://creativecommons.org/ns": "cc",
"http://www.w3.org/2004/09/fresnel": "fresnel",
"http://www.w3.org/2006/03/test-description": "test",
"http://www.w3.org/2006/gen/ont#": "gso",
"http://www.w3.org/2006/time": "time",
"http://d-nb.info/standards/elementset/agrelon.owl#": "agrelon",
"http://d-nb.info/standards/elementset/gnd": "gndo",
"http://data.archiveshub.ac.uk/def/": "locah",
"http://data.ign.fr/def/geofla": "geofla",
"http://data.ign.fr/def/geometrie#": "geom",
"http://data.ign.fr/def/ignf#": "ignf",
"http://data.ign.fr/def/topo#": "topo",
"http://data.lirmm.fr/ontologies/food": "food",
"http://data.lirmm.fr/ontologies/oan/": "oan",
"http://data.lirmm.fr/ontologies/osp#": "osp",
"http://data.lirmm.fr/ontologies/passim#": "passim",
"http://data.lirmm.fr/ontologies/poste#": "poste",
"http://data.lirmm.fr/ontologies/vdpp#": "vdpp",
"http://data.ordnancesurvey.co.uk/ontology/50kGazetteer/": "g50k",
"http://data.ordnancesurvey.co.uk/ontology/admingeo/": "osadm",
"http://data.ordnancesurvey.co.uk/ontology/geometry/": "osgeom",
"http://data.ordnancesurvey.co.uk/ontology/postcode/": "postcode",
"http://data.ordnancesurvey.co.uk/ontology/spatialrelations/": "osspr",
"http://data.press.net/ontology/asset/": "pna",
"http://data.press.net/ontology/classification/": "pnc",
"http://data.press.net/ontology/event/": "pne",
"http://data.press.net/ontology/identifier/": "pni",
"http://data.press.net/ontology/stuff/": "pns",
"http://data.press.net/ontology/tag/": "pnt",
"http://data.semanticweb.org/ns/swc/ontology": "swc",
"http://data.totl.net/game/": "game",
"http://dati.camera.it/ocd/": "ocd",
"http://def.seegrid.csiro.au/isotc211/iso19103/2005/basic": "basic",
"http://def.seegrid.csiro.au/isotc211/iso19107/2003/geometry#": "gm",
"http://def.seegrid.csiro.au/isotc211/iso19108/2002/temporal": "tm",
"http://def.seegrid.csiro.au/isotc211/iso19109/2005/feature#": "gf",
"http://def.seegrid.csiro.au/isotc211/iso19115/2003/dataquality#": "dq",
"http://def.seegrid.csiro.au/isotc211/iso19115/2003/extent#": "ext",
"http://def.seegrid.csiro.au/isotc211/iso19115/2003/lineage#": "li",
"http://def.seegrid.csiro.au/isotc211/iso19115/2003/metadata#": "md",
"http://def.seegrid.csiro.au/isotc211/iso19150/-2/2012/basic#": "h2o",
"http://def.seegrid.csiro.au/isotc211/iso19156/2011/observation": "om",
"http://def.seegrid.csiro.au/isotc211/iso19156/2011/sampling": "sam",
"http://dev.poderopedia.com/vocab/": "poder",
"http://elite.polito.it/ontologies/dogont": "dogont",
"http://environment.data.gov.au/def/op#": "op",
"http://eprints.org/ontology/": "ep",
"http://geovocab.org/geometry": "ngeo",
"http://geovocab.org/spatial": "spatial",
"http://id.loc.gov/vocabulary/relators/": "mrel",
"http://idi.fundacionctic.org/cruzar/turismo#": "turismo",
"http://iflastandards.info/ns/fr/frad/": "frad",
"http://iflastandards.info/ns/fr/frbr/frbrer/": "frbrer",
"http://inference-web.org/2.0/ds.owl#": "dso",
"http://inference-web.org/2.0/pml-provenance.owl#": "pmlp",
"http://iserve.kmi.open.ac.uk/ns/hrests#": "hr",
"http://iserve.kmi.open.ac.uk/ns/msm#": "msm",
"http://kdo.render-project.eu/kdo": "kdo",
"http://kmi.open.ac.uk/projects/smartproducts/ontologies/food.owl#": "spfood",
"http://labs.mondeca.com/vocab/endpointStatus": "ends",
"http://lemon-model.net/lemon": "lemon",
"http://lexvo.org/ontology": "lvont",
"http://linkedevents.org/ontology/": "lode",
"http://linkedgeodata.org/ontology/": "lgdo",
"http://linkedscience.org/lsc/ns#": "lsc",
"http://linkedscience.org/teach/ns": "teach",
"http://lod.taxonconcept.org/ontology/sci_people.owl#": "scip",
"http://lod.taxonconcept.org/ontology/txn.owl": "txn",
"http://lod.xdams.org/reload/oad/": "oad",
"http://loted.eu/ontology#": "loted",
"http://lsdis.cs.uga.edu/projects/semdis/opus": "opus",
"http://metadataregistry.org/uri/schema/RDARelationshipsGR2/": "rdarel2",
"http://moat-project.org/ns": "moat",
"http://ndl.go.jp/dcndl/terms/": "dcndl",
"http://ns.bergnet.org/tac/0.1/triple-access-control": "tac",
"http://ns.inria.fr/ast/sql": "sql",
"http://ns.inria.fr/emoca": "emotion",
"http://ns.inria.fr/nicetag/2010/09/09/voc": "ntag",
"http://ns.inria.fr/prissma/v1": "prissma",
"http://ns.inria.fr/s4ac/v2": "s4ac",
"http://ns.nature.com/terms/": "npg",
"http://observedchange.com/moac/ns": "moac",
"http://observedchange.com/tisc/ns#": "tisc",
"http://ogp.me/ns#": "og",
"http://online-presence.net/opo/ns": "opo",
"http://ontologies.smile.deri.ie/pdo#": "pdo",
"http://ontology.it/itsmo/v1#": "itsmo",
"http://open-services.net/ns/asset#": "am",
"http://open-services.net/ns/core#": "oslc",
"http://open.vocab.org/terms/": "ov",
"http://openprovenance.org/model/opmo": "opmo",
"http://owlrep.eu01.aws.af.cm/fridge#": "of",
"http://paul.staroch.name/thesis/SmartHomeWeather.owl#": "shw",
"http://persistence.uni-leipzig.org/nlp2rdf/ontologies/nif-core#": "nif",
"http://persistence.uni-leipzig.org/nlp2rdf/ontologies/rlog#": "rlog",
"http://privatealpha.com/ontology/certification/1": "acrt",
"http://purl.oclc.org/NET/ldr/ns": "ldr",
"http://purl.oclc.org/NET/muo/muo#": "muo",
"http://purl.oclc.org/NET/mvco.owl#": "mvco",
"http://purl.oclc.org/NET/ssnx/meteo/aws#": "aws",
"http://purl.oclc.org/NET/ssnx/qu/qu#": "qu",
"http://purl.oclc.org/NET/ssnx/ssn": "ssn",
"http://purl.org/LiMo/0.1": "limoo",
"http://purl.org/NET/biol/botany#": "botany",
"http://purl.org/NET/biol/ns": "biol",
"http://purl.org/NET/c4dm/event.owl": "event",
"http://purl.org/NET/c4dm/keys.owl": "keys",
"http://purl.org/NET/c4dm/timeline.owl": "tl",
"http://purl.org/NET/dady#": "dady",
"http://purl.org/NET/raul#": "raul",
"http://purl.org/NET/schema-org-csv#": "scsv",
"http://purl.org/NET/scovo": "scovo",
"http://purl.org/acco/ns": "acco",
"http://purl.org/archival/vocab/arch#": "arch",
"http://purl.org/b2bo#": "b2bo",
"http://purl.org/biodiversity/taxon/": "taxon",
"http://purl.org/biotop/biotop.owl": "biotop",
"http://purl.org/cerif/frapo/": "frapo",
"http://purl.org/cld/cdtype/": "cdtype",
"http://purl.org/cld/terms/": "cld",
"http://purl.org/co/": "coll",
"http://purl.org/configurationontology": "cold",
"http://purl.org/coo/ns": "coo",
"http://purl.org/ctic/dcat": "dcat",
"http://purl.org/ctic/empleo/oferta#": "emp",
"http://purl.org/ctic/infraestructuras/localizacion#": "loc",
"http://purl.org/ctic/infraestructuras/organizacion#": "ctorg",
"http://purl.org/ctic/sector-publico/elecciones#": "elec",
"http://purl.org/dc/dcam/": "dcam",
"http://purl.org/dc/dcmitype/": "dctype",
"http://purl.org/dc/elements/1.1/": "dce",
"http://purl.org/dc/terms/": "dcterms",
"http://purl.org/dqm-vocabulary/v1/dqm": "dqm",
"http://purl.org/dsnotify/vocab/eventset/": "dsn",
"http://purl.org/eis/vocab/daq#": "daq",
"http://purl.org/essglobal/vocab/v1.0/": "essglobal",
"http://purl.org/gen/0.1#": "gen",
"http://purl.org/goodrelations/v1": "gr",
"http://purl.org/healthcarevocab/v1": "dicom",
"http://purl.org/imbi/ru-meta.owl#": "ru",
"http://purl.org/innovation/ns": "inno",
"http://purl.org/iso25964/skos-thes#": "iso-thes",
"http://purl.org/library/": "lib",
"http://purl.org/limo-ontology/limo": "limo",
"http://purl.org/linguistics/gold/": "gold",
"http://purl.org/linked-data/api/vocab": "api",
"http://purl.org/linked-data/cube": "qb",
"http://purl.org/linked-data/sdmx": "sdmx",
"http://purl.org/linked-data/sdmx/2009/code": "sdmx-code",
"http://purl.org/linked-data/sdmx/2009/dimension": "sdmx-dimension",
"http://purl.org/linkingyou/": "lyou",
"http://purl.org/lobid/lv": "lv",
"http://purl.org/media#": "media",
"http://purl.org/muto/core": "muto",
"http://purl.org/net/lio#": "lio",
"http://purl.org/net/nknouf/ns/bibtex": "bibtex",
"http://purl.org/net/ns/ex": "ex",
"http://purl.org/net/ns/ontology-annot": "ont",
"http://purl.org/net/opmv/ns": "opmv",
"http://purl.org/net/p-plan": "p-plan",
"http://purl.org/net/po#": "plo",
"http://purl.org/net/provenance/ns": "prv",
"http://purl.org/net/provenance/types#": "prvt",
"http://purl.org/net/vocab/2004/03/label": "label",
"http://purl.org/net/wf-invocation#": "wf-invoc",
"http://purl.org/net/wf-motifs#": "wfm",
"http://purl.org/ontology/af/": "af",
"http://purl.org/ontology/ao/core": "ao",
"http://purl.org/ontology/bibo/": "bibo",
"http://purl.org/ontology/cco/core": "cco",
"http://purl.org/ontology/chord/": "chord",
"http://purl.org/ontology/co/core": "co",
"http://purl.org/ontology/daia/": "daia",
"http://purl.org/ontology/dso#": "docso",
"http://purl.org/ontology/dvia": "dvia",
"http://purl.org/ontology/is/core": "is",
"http://purl.org/ontology/mo/": "mo",
"http://purl.org/ontology/olo/core": "olo",
"http://purl.org/ontology/pbo/core": "pbo",
"http://purl.org/ontology/places#": "place",
"http://purl.org/ontology/po/": "po",
"http://purl.org/ontology/prv/core": "prv",
"http://purl.org/ontology/rec/core": "rec",
"http://purl.org/ontology/service#": "service",
"http://purl.org/ontology/similarity/": "sim",
"http://purl.org/ontology/ssso#": "ssso",
"http://purl.org/ontology/stories/": "stories",
"http://purl.org/ontology/storyline/": "nsl",
"http://purl.org/ontology/wi/core": "wi",
"http://purl.org/ontology/wo/": "wlo",
"http://purl.org/ontology/wo/core": "wo",
"http://purl.org/opdm/refrigerator#": "ofrd",
"http://purl.org/openorg/": "oo",
"http://purl.org/oslo/ns/localgov#": "oslo",
"http://purl.org/pav/": "pav",
"http://purl.org/procurement/public-contracts": "pc",
"http://purl.org/rss/1.0/": "rss",
"http://purl.org/saws/ontology": "saws",
"http://purl.org/spar/biro/": "biro",
"http://purl.org/spar/c4o/": "c4o",
"http://purl.org/spar/cito/": "cito",
"http://purl.org/spar/datacite/": "dcite",
"http://purl.org/spar/deo/": "deo",
"http://purl.org/spar/doco/": "doco",
"http://purl.org/spar/fabio/": "fabio",
"http://purl.org/spar/pro/": "pro",
"http://purl.org/spar/pso/": "pso",
"http://purl.org/spar/pwo/": "pwo",
"http://purl.org/spar/scoro/": "scoro",
"http://purl.org/stuff/rev#": "rev",
"http://purl.org/swan/2.0/discourse-relationships/": "dr",
"http://purl.org/theatre#": "theatre",
"http://purl.org/tio/ns": "tio",
"http://purl.org/twc/ontologies/cmo.owl": "cmo",
"http://purl.org/twc/ontology/cdm.owl#": "cdm",
"http://purl.org/twc/vocab/conversion/": "conversion",
"http://purl.org/uco/ns": "uco",
"http://purl.org/voc/vrank": "vrank",
"http://purl.org/vocab/aiiso/schema#": "aiiso",
"http://purl.org/vocab/bio/0.1/": "bio",
"http://purl.org/vocab/changeset/schema": "cs",
"http://purl.org/vocab/frbr/core": "frbr",
"http://purl.org/vocab/frbr/extended#": "frbre",
"http://purl.org/vocab/lifecycle/schema": "lcy",
"http://purl.org/vocab/participation/schema#": "part",
"http://purl.org/vocab/relationship/": "rel",
"http://purl.org/vocab/vann/": "vann",
"http://purl.org/vocommons/voaf#": "voaf",
"http://purl.org/vso/ns": "vso",
"http://purl.org/vvo/ns#": "vvo",
"http://purl.org/wai#": "wai",
"http://purl.uniprot.org/core/": "uniprot",
"http://qudt.org/schema/qudt": "qudt",
"http://rdf-vocabulary.ddialliance.org/discovery": "disco",
"http://rdf-vocabulary.ddialliance.org/phdd#": "phdd",
"http://rdf-vocabulary.ddialliance.org/xkos": "xkos",
"http://rdf.geospecies.org/methods/observationMethod#": "obsm",
"http://rdf.geospecies.org/ont/geospecies": "geosp",
"http://rdf.insee.fr/def/demo#": "idemo",
"http://rdf.insee.fr/def/geo#": "igeo",
"http://rdf.muninn-project.org/ontologies/appearances": "aos",
"http://rdf.muninn-project.org/ontologies/military": "mil",
"http://rdf.myexperiment.org/ontologies/base/": "meb",
"http://rdf.myexperiment.org/ontologies/snarm/": "snarm",
"http://rdfs.co/bevon/": "bevon",
"http://rdfs.org/ns/void": "void",
"http://rdfs.org/scot/ns": "scot",
"http://rdfs.org/sioc/ns": "sioc",
"http://rdfs.org/sioc/types#": "tsioc",
"http://rdfunit.aksw.org/ns/core#": "ruto",
"http://rdvocab.info/Elements/": "rdag1",
"http://rdvocab.info/ElementsGr2/": "rdag2",
"http://rdvocab.info/ElementsGr3/": "rdag3",
"http://rdvocab.info/RDARelationshipsWEMI/": "rdarel",
"http://rdvocab.info/roles/": "rdarole",
"http://rdvocab.info/uri/schema/FRBRentitiesRDA/": "rdafrbr",
"http://reegle.info/schema#": "reegle",
"http://reference.data.gov.uk/def/central-government/": "cgov",
"http://reference.data.gov.uk/def/intervals/": "interval",
"http://reference.data.gov.uk/def/organogram/": "odv",
"http://reference.data.gov.uk/def/parliament/": "parl",
"http://reference.data.gov.uk/def/payment": "pay",
"http://reference.data.gov/def/govdata/": "gd",
"http://resource.geosciml.org/ontology/timescale/gts#": "gts",
"http://resource.geosciml.org/ontology/timescale/thors#": "thors",
"http://rhizomik.net/ontologies/copyrightonto.owl": "cro",
"http://salt.semanticauthoring.org/ontologies/sao#": "sao",
"http://salt.semanticauthoring.org/ontologies/sdo#": "sdo",
"http://salt.semanticauthoring.org/ontologies/sro#": "sro",
"http://schema.org/": "schema",
"http://schema.theodi.org/odrs#": "odrs",
"http://schemas.talis.com/2005/address/schema#": "ad",
"http://schemas.talis.com/2005/dir/schema#": "dir",
"http://schemas.talis.com/2005/user/schema#": "user",
"http://securitytoolbox.appspot.com/MASO#": "maso",
"http://securitytoolbox.appspot.com/securityAlgorithms": "algo",
"http://securitytoolbox.appspot.com/securityMain#": "security",
"http://securitytoolbox.appspot.com/stac#": "stac",
"http://semanticscience.org/resource/": "sio",
"http://semanticweb.cs.vu.nl/2009/11/sem/": "sem",
"http://semweb.mmlab.be/ns/apps4X": "apps4X",
"http://semweb.mmlab.be/ns/odapps#": "odapps",
"http://semweb.mmlab.be/ns/oh#": "oh",
"http://sensormeasurement.appspot.com/ont/home/homeActivity": "homeActivity",
"http://simile.mit.edu/2003/10/ontologies/vraCore3#": "vra",
"http://sindice.com/vocab/search#": "search",
"http://spi-fm.uca.es/spdef/models/deployment/spcm/1.0#": "spcm",
"http://spi-fm.uca.es/spdef/models/deployment/swpm/1.0#": "swpm",
"http://spi-fm.uca.es/spdef/models/genericTools/itm/1.0#": "itm",
"http://spi-fm.uca.es/spdef/models/genericTools/vmm/1.0#": "vmm",
"http://spi-fm.uca.es/spdef/models/genericTools/wikim/1.0#": "wikim",
"http://spinrdf.org/sp": "sp",
"http://spinrdf.org/spin#": "spin",
"http://spitfire-project.eu/ontology/ns/": "spt",
"http://sw-portal.deri.org/ontologies/swportal#": "swpo",
"http://swrc.ontoware.org/ontology": "swrc",
"http://umbel.org/umbel": "umbel",
"http://uri4uri.net/vocab#": "uri4uri",
"http://usefulinc.com/ns/doap#": "doap",
"http://vivoweb.org/ontology/core#": "vivo",
"http://voag.linkedmodel.org/voag": "voag",
"http://vocab.data.gov/def/drm#": "drm",
"http://vocab.data.gov/def/fea#": "fea",
"http://vocab.deri.ie/br#": "br",
"http://vocab.deri.ie/c4n": "c4n",
"http://vocab.deri.ie/cogs#": "cogs",
"http://vocab.deri.ie/csp#": "csp",
"http://vocab.deri.ie/odapp#": "odapp",
"http://vocab.deri.ie/ppo": "ppo",
"http://vocab.deri.ie/tao#": "tao",
"http://vocab.getty.edu/ontology": "gvp",
"http://vocab.lenka.no/geo-deling#": "geod",
"http://vocab.org/transit/terms/": "transit",
"http://vocab.org/whisky/terms/": "whisky",
"http://vocab.resc.info/communication#": "comm",
"http://www.agls.gov.au/agls/terms/": "agls",
"http://www.aktors.org/ontology/portal": "akt",
"http://www.aktors.org/ontology/support#": "akts",
"http://www.bbc.co.uk/ontologies/bbc/": "bbc",
"http://www.bbc.co.uk/ontologies/cms/": "bbccms",
"http://www.bbc.co.uk/ontologies/coreconcepts/": "bbccore",
"http://www.bbc.co.uk/ontologies/creativework/": "cwork",
"http://www.bbc.co.uk/ontologies/provenance/": "bbcprov",
"http://www.bbc.co.uk/ontologies/sport/": "sport",
"http://www.biopax.org/release/biopax-level3.owl#": "biopax",
"http://www.bl.uk/schemas/bibliographic/blterms#": "blt",
"http://www.cidoc-crm.org/cidoc-crm/": "crm",
"http://www.daml.org/2001/09/countries/iso-3166-ont#": "coun",
"http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#": "ebucore",
"http://www.ebusiness-unibw.org/ontologies/consumerelectronics/v1#": "ceo",
"http://www.ecole.ensicaen.fr/~vincentj/owl/id.owl": "identity",
"http://www.essepuntato.it/2008/12/pattern#": "pattern",
"http://www.essepuntato.it/2012/04/tvc/": "tvc",
"http://www.essepuntato.it/2013/03/cito-functions#": "citof",
"http://www.essepuntato.it/2013/10/vagueness/": "vag",
"http://www.europeana.eu/schemas/edm/": "edm",
"http://www.geonames.org/ontology": "gn",
"http://www.gsi.dit.upm.es/ontologies/marl/ns": "marl",
"http://www.gsi.dit.upm.es/ontologies/onyx/ns": "onyx",
"http://www.holygoat.co.uk/owl/redwood/0.1/tags/": "tag",
"http://www.ics.forth.gr/isl/MarineTLO/v4/marinetlo.owl": "mtlo",
"http://www.ics.forth.gr/isl/VoIDWarehouse/VoID_Extension_Schema.owl": "voidwh",
"http://www.kanzaki.com/ns/music": "music",
"http://www.kanzaki.com/ns/whois": "whois",
"http://www.lexinfo.net/lmf": "lmf",
"http://www.lexinfo.net/ontology/2.0/lexinfo": "lexinfo",
"http://www.lingvoj.org/olca": "olca",
"http://www.lingvoj.org/ontology#": "lingvo",
"http://www.lingvoj.org/semio#": "semio",
"http://www.linkedmodel.org/schema/dtype#": "dtype",
"http://www.linkedmodel.org/schema/vaem#": "vaem",
"http://www.loc.gov/mads/rdf/v1": "mads",
"http://www.loc.gov/premis/rdf/v1": "premis",
"http://www.mindswap.org/2003/owl/geo/geoFeatures20040307.owl#": "geof",
"http://www.oegov.org/core/owl/cc#": "oecc",
"http://www.oegov.org/core/owl/gc": "oegov",
"http://www.ontologydesignpatterns.org/cp/owl/informationrealization.owl#": "infor",
"http://www.ontologydesignpatterns.org/cp/owl/participation.owl#": "odpart",
"http://www.ontologydesignpatterns.org/cp/owl/sequence.owl#": "seq",
"http://www.ontologydesignpatterns.org/cp/owl/situation.owl#": "situ",
"http://www.ontologydesignpatterns.org/cp/owl/timeindexedsituation.owl": "tis",
"http://www.ontologydesignpatterns.org/cp/owl/timeinterval.owl#": "ti",
"http://www.ontologydesignpatterns.org/ont/dul/DUL.owl": "dul",
"http://www.ontologydesignpatterns.org/ont/dul/IOLite.owl#": "iol",
"http://www.ontologydesignpatterns.org/ont/dul/ontopic.owl#": "ontopic",
"http://www.ontologydesignpatterns.org/ont/lmm/LMM_L1.owl#": "lmm1",
"http://www.ontologydesignpatterns.org/ont/lmm/LMM_L2.owl#": "lmm2",
"http://www.ontologydesignpatterns.org/ont/web/irw.owl": "irw",
"http://www.ontologydesignpatterns.org/schemas/cpannotationschema.owl#": "cpa",
"http://www.ontotext.com/proton/protonext#": "pext",
"http://www.ontotext.com/proton/protonkm": "pkm",
"http://www.ontotext.com/proton/protonsys#": "psys",
"http://www.w3.org/2006/vcard/ns": "vcard",
"http://www.w3.org/2007/05/powder-s": "wdrs",
"http://www.w3.org/TR/2003/PR-owl-guide-20031209/wine#": "vin",
"http://www.w3.org/ns/adms": "adms",
"http://www.w3.org/ns/auth/acl#": "acl",
"http://www.w3.org/ns/auth/cert": "cert",
"http://www.w3.org/ns/dcat": "dcat",
"http://www.w3.org/ns/earl": "earl",
"http://www.w3.org/ns/hydra/core": "hydra",
"http://www.w3.org/ns/ldp": "ldp",
"http://www.w3.org/ns/locn": "locn",
"http://www.w3.org/ns/ma-ont": "ma",
"http://www.w3.org/ns/oa": "oa",
"http://www.w3.org/ns/org": "org",
"http://www.w3.org/ns/person#": "person",
"http://www.w3.org/ns/prov": "prov",
"http://www.w3.org/ns/r2rml": "rr",
"http://www.w3.org/ns/radion#": "radion",
"http://www.w3.org/ns/regorg": "rov",
"http://www.w3.org/ns/ui#": "ui",
"http://www.wiwiss.fu-berlin.de/suhl/bizer/D2RQ/0.1": "d2rq",
"http://xmlns.com/wot/0.1/": "wot",
"http://zbw.eu/namespaces/zbw-extensions/": "zbwext",
"https://decision-ontology.googlecode.com/svn/trunk/decision.owl#": "decision",
"https://raw.githubusercontent.com/airs-linked-data/lov/latest/src/airs_vocabulary.ttl#": "airs",
"https://www.auto.tuwien.ac.at/downloads/thinkhome/ontology/WeatherOntology.owl": "homeWeather",
"http://xmlns.com/foaf/": "foaf",
"http://dbpedia.org/ontology/": "dbpedia",
"http://www.semanticdesktop.org/ontologies/2007/03/22/nfo": "nfo",
"http://linda-project.eu/ontology/ldao.owl": "ldao",
"https://github.com/dipapaspyros/FileSync/CloudStorageUnificationOntology": "csuo",
"http://linda.epu.ntua.gr/ontolygy/ppsonto": "pps",
//manually added
"http://www.w3.org/2001/XMLSchema#": "xmls",
"http://dbpedia.org/resource/": "dbpres",
};






/*
//source: http://prefix.cc/context
prefixes = {
"http://dbpedia.org/resource/": "dbpedia",
"http://a9.com/-/spec/opensearch/1.1/": "opensearch",
"http://abs.270a.info/dataset/": "abs",
"http://advene.org/ns/cinelab/": "cl",
"http://aers.data2semantics.org/resource/": "aers",
"http://aers.data2semantics.org/vocab/": "aersv",
"http://agrinepaldata.com/": "agrd",
"http://agrinepaldata.com/vocab/": "agro",
"http://aims.fao.org/aos/agrovoc/": "asgv",
"http://aims.fao.org/aos/common/": "aims",
"http://aims.fao.org/aos/geopolitical.owl#": "geop",
"http://aims.fao.org/aos/jita/": "jita",
"http://akonadi-project.org/ontologies/aneo#": "aneo",
"http://annotation.semanticweb.org/2004/iswc#": "iswc",
"http://archdesc.info/archEvent#": "archdesc",
"http://art.uniroma2.it/ontologies/lime#": "lime",
"http://atomowl.org/ontologies/atomrdf#": "atomrdf",
"http://babelnet.org/2.0/": "babelnet",
"http://babelnet.org/rdf/": "bn",
"http://bblfish.net/work/atom-owl/2006-06-06/#": "atomowl",
"http://bblfish.net/work/atom-owl/2006-06-06/#": "awol",
"http://bg.dbpedia.org/property/": "bgdbp",
"http://bg.dbpedia.org/resource/": "bgdbr",
"http://bg.dbpedia.org/resource/\u041a\u0430\u0442\u0435\u0433\u043e\u0440\u0438\u044f:": "bgcat",
"http://bibframe.org/vocab/": "bf",
"http://bibliograph.net/schemas/": "bgn",
"http://bihap.kb.gov.tr/ontology/": "bihap",
"http://bing.com/schema/media/": "bing",
"http://bio2rdf.org/": "bio2rdf",
"http://bio2rdf.org/affymetrix_vocabulary:": "affymetrix",
"http://bio2rdf.org/chebi:": "chebi",
"http://bio2rdf.org/core#": "biocore",
"http://bio2rdf.org/hgnc:": "hgnc",
"http://bio2rdf.org/ns/kegg#": "kegg",
"http://bio2rdf.org/ns/ns/ns/pubchem#": "b2rpubchem",
"http://bio2rdf.org/pubmed_vocabulary:": "pubmed",
"http://biohackathon.org/resource/faldo#": "faldo",
"http://bioinformatics.ua.pt/coeus/": "coeus",
"http://bis.270a.info/dataset/": "bis",
"http://blogs.yandex.ru/schema/foaf/": "ya",
"http://bsym.bloomberg.com/sym/": "bsym",
"http://buzzword.org.uk/rdf/atomix#": "atomix",
"http://buzzword.org.uk/rdf/h5#": "h5",
"http://buzzword.org.uk/rdf/personal-link-types#": "plink",
"http://buzzword.org.uk/rdf/vcardx#": "vcardx",
"http://buzzword.org.uk/rdf/xen#": "xen",
"http://buzzword.org.uk/rdf/xhtml-elements#": "xhe",
"http://callimachusproject.org/rdf/2009/framework#": "calli",
"http://catalogus-professorum.org/cpm/": "cpm",
"http://cbasewrap.ontologycentral.com/vocab#": "cb",
"http://chem.deri.ie/granatum/": "granatum",
"http://clarin.eu/cmd#": "cmd",
"http://clarin.eu/fcs/resource#": "fcs",
"http://climb.dataincubator.org/vocabs/climb/": "climb",
"http://clirio.kaerle.com/clirio.owl#": "clirio",
"http://code-research.eu/ontology/visual-analytics#": "va",
"http://collection.britishmuseum.org/id/ontology/": "bmo",
"http://comicmeta.org/cbo/": "cbo",
"http://commons.psi.enakting.org/def/": "commons",
"http://commontag.org/ns#": "ctag",
"http://conserv.deri.ie/ontology#": "conserv",
"http://contextus.net/ontology/ontomedia/ext/common/trait#": "trait",
"http://contextus.net/ontology/ontomedia/misc/date#": "date",
"http://contsem.unizar.es/def/sector-publico/contratacion#": "contsem",
"http://contsem.unizar.es/def/sector-publico/pproc#": "pproc",
"http://courseware.rkbexplorer.com/ontologies/courseware#": "crsw",
"http://creativecommons.org/ns#": "cc",
"http://creativecommons.org/ns#": "ccrel",
"http://d-nb.info/gnd/": "dnb",
"http://d-nb.info/standards/elementset/agrelon#": "agrelon",
"http://d-nb.info/standards/elementset/gnd#": "gndo",
"http://d2rq.org/terms/jdbc/": "jdbc",
"http://data-gov.tw.rpi.edu/2009/data-gov-twc.rdf#": "dgtwc",
"http://data.archiveshub.ac.uk/def/": "locah",
"http://data.eurecom.fr/ontology/dvia#": "dvia",
"http://data.eurecom.fr/ontology/reve#": "reve",
"http://data.europa.eu/esco/model#": "esco",
"http://data.globalchange.gov/gcis.owl#": "gcis",
"http://data.ign.fr/def/ignf#": "ignf",
"http://data.ign.fr/def/topo#": "topo",
"http://data.ign.fr/ontologies/geofla#": "geofla",
"http://data.kasabi.com/dataset/eumida/terms/": "eumida",
"http://data.kasabi.com/dataset/italy/schema/": "italy",
"http://data.linkedct.org/resource/linkedct/": "ct",
"http://data.linkedct.org/vocab/": "linkedct",
"http://data.linkedct.org/vocab/resource/": "lctr",
"http://data.linkedmdb.org/resource/movie/": "movie",
"http://data.linkedmdb.org/sparql/": "linkedmdb",
"http://data.lirmm.fr/ontologies/laposte#": "laposte",
"http://data.lirmm.fr/ontologies/oan/": "oan",
"http://data.lirmm.fr/ontologies/osp#": "osp",
"http://data.lirmm.fr/ontologies/passim#": "passim",
"http://data.lirmm.fr/ontologies/poste#": "poste",
"http://data.lirmm.fr/ontologies/vdpp#": "vdpp",
"http://data.nytimes.com/": "nyt",
"http://data.nytimes.com/elements/": "nytimes",
"http://data.ordnancesurvey.co.uk/id/": "osgb",
"http://data.ordnancesurvey.co.uk/id/postcodeunit/": "postcode",
"http://data.ordnancesurvey.co.uk/ontology/50kGazetteer/": "gazetteer",
"http://data.ordnancesurvey.co.uk/ontology/admingeo/": "admingeo",
"http://data.ordnancesurvey.co.uk/ontology/geometry/": "osgeom",
"http://data.ordnancesurvey.co.uk/ontology/postcode/": "ospost",
"http://data.ordnancesurvey.co.uk/ontology/spatialrelations/": "spacerel",
"http://data.posccaesar.org/ilap/": "ilap",
"http://data.posccaesar.org/rdl/": "rdl",
"http://data.press.net/ontology/asset/": "pna",
"http://data.press.net/ontology/classification/": "pnc",
"http://data.press.net/ontology/event/": "pne",
"http://data.press.net/ontology/identifier/": "pni",
"http://data.press.net/ontology/stuff/": "pns",
"http://data.press.net/ontology/tag/": "pnt",
"http://data.rvdata.us/": "rvdata",
"http://data.scientology.org/ns/": "sci",
"http://data.semanticweb.org/conference/ekaw/2012/complete/": "ekaw",
"http://data.semanticweb.org/ns/swc/ontology#": "swc",
"http://data.semanticweb.org/person/": "swperson",
"http://data.totl.net/game/": "game",
"http://data.totl.net/occult/": "occult",
"http://data.totl.net/tarot/card/": "tarot",
"http://data.worldbank.org/": "wb",
"http://databugger.aksw.org/ns/core#": "tddo",
"http://dati.camera.it/ocd/": "ocd",
"http://dati.cdec.it/lod/shoah/": "shoah",
"http://dati.senato.it/osr/": "osr",
"http://datos.bcn.cl/ontologies/bcn-biographies#": "bcnbio",
"http://datos.bcn.cl/ontologies/bcn-congress#": "bcncon",
"http://datos.bcn.cl/ontologies/bcn-geographics#": "bcngeo",
"http://datos.bcn.cl/ontologies/bcn-norms#": "bcnnorms",
"http://datos.bne.es/resource/": "bne",
"http://datos.bne.es/resource/": "bner",
"http://datos.localidata.com/def/City#": "city",
"http://dayta.me/resource#": "dayta",
"http://dblp.l3s.de/d2r/page/authors/": "dblp",
"http://dbpedia.org/class/yago/": "dbyago",
"http://dbpedia.org/datatype/": "dt",
"http://dbpedia.org/ontology/": "dbo",
"http://dbpedia.org/ontology/": "dbpo",
"http://dbpedia.org/ontology/Stream/": "stream",
"http://dbpedia.org/property/": "dbp",
"http://dbpedia.org/resource/Category:": "category",
"http://dbpedia.org/resource/Category:": "dbcat",
"http://dbpedia.org/": "db",
"http://dbpedialite.org/things/": "dpl",
"http://dbtropes.org/ont/": "dbtont",
"http://dbtune.org/musicbrainz/resource/instrument/": "mb",
"http://dcm.com/": "dcm",
"http://ddbj.nig.ac.jp/ontologies/sequence#": "insdc",
"http://deductions-software.com/ontologies/doas.owl.ttl#": "doas",
"http://deductions-software.com/ontologies/forms.owl.ttl#": "form",
"http://deductions.sf.net/ontology/knowledge_base.owl#": "kb",
"http://def.esd.org.uk/": "esd",
"http://def.seegrid.csiro.au/isotc211/iso19103/2005/basic#": "basic",
"http://def.seegrid.csiro.au/isotc211/iso19107/2003/geometry#": "gm",
"http://def.seegrid.csiro.au/isotc211/iso19108/2002/temporal#": "tm",
"http://def.seegrid.csiro.au/isotc211/iso19109/2005/feature#": "gf",
"http://def.seegrid.csiro.au/isotc211/iso19115/2003/dataquality#": "dq",
"http://def.seegrid.csiro.au/isotc211/iso19115/2003/extent#": "ext",
"http://def.seegrid.csiro.au/isotc211/iso19115/2003/lineage#": "li",
"http://def.seegrid.csiro.au/isotc211/iso19150/-2/2012/basic#": "h2o",
"http://def.seegrid.csiro.au/isotc211/iso19156/2011/sampling#": "sam",
"http://demiblog.org/vocab/oauth#": "oauth",
"http://dev.w3.org/cvsweb/2000/quacken/vocab#": "quak",
"http://dig.csail.mit.edu/TAMI/2007/amord/air#": "air",
"http://diplomski.nelakolundzija.org/LTontology.rdf#": "lt",
"http://doc.metalex.eu/bwb/ontology/": "bwb",
"http://doc.metalex.eu/id/": "mds",
"http://docs.oasis-open.org/ns/search-ws/xcql#": "xcql",
"http://docs.oasis-open.org/ns/xri/xrd-1.0#": "xrd",
"http://dpc.Data/": "dpc",
"http://dsnotify.org/vocab/eventset/0.1/": "evset",
"http://dx.deepcarbon.net/": "dcoid",
"http://eatld.et.tu-dresden.de/rmo#": "rmo",
"http://ecb.270a.info/class/1.0/": "ecb",
"http://ecoinformatics.org/oboe/oboe.1.0/oboe-core.owl#": "oboe",
"http://edgarwrap.ontologycentral.com/vocab/edgar#": "edgar",
"http://elite.polito.it/ontologies/dogont.owl#": "dogont",
"http://en.wikipedia.org/wiki/": "wiki",
"http://environment.data.gov.au/def/op#": "op",
"http://eprints.org/ontology/": "ep",
"http://eprints.org/ontology/": "eprints",
"http://erlangen-crm.org/current/": "cidoc",
"http://erlangen-crm.org/current/": "ecrm",
"http://escience.rpi.edu/ontology/semanteco/2/0/pollution.owl#": "pol",
"http://escience.rpi.edu/ontology/semanteco/2/0/water.owl#": "water",
"http://escience.rpi.edu/ontology/sesf/s2s/4/0/": "s2s",
"http://escience.rpi.edu/ontology/vsto/2/0/vsto.owl#": "vsto",
"http://eulergui.sourceforge.net/contacts.owl.n3#": "ec",
"http://eulergui.sourceforge.net/engine.owl#": "eg",
"http://eulersharp.sourceforge.net/2003/03swap/agent#": "agent",
"http://eulersharp.sourceforge.net/2003/03swap/agent#": "agents",
"http://eulersharp.sourceforge.net/2003/03swap/bioSKOSSchemes#": "bioskos",
"http://eulersharp.sourceforge.net/2003/03swap/care#": "care",
"http://eulersharp.sourceforge.net/2003/03swap/countries#": "countries",
"http://eulersharp.sourceforge.net/2003/03swap/environment#": "environ",
"http://eulersharp.sourceforge.net/2003/03swap/event#": "events",
"http://eulersharp.sourceforge.net/2003/03swap/fl-rules#": "fl",
"http://eulersharp.sourceforge.net/2003/03swap/genomeAbnormality#": "genab",
"http://eulersharp.sourceforge.net/2003/03swap/human#": "human",
"http://eulersharp.sourceforge.net/2003/03swap/humanBody#": "humanbody",
"http://eulersharp.sourceforge.net/2003/03swap/languages#": "languages",
"http://eulersharp.sourceforge.net/2003/03swap/log-rules#": "elog",
"http://eulersharp.sourceforge.net/2003/03swap/log-rules#": "es",
"http://eulersharp.sourceforge.net/2003/03swap/log-rules#": "eu",
"http://eulersharp.sourceforge.net/2003/03swap/organism#": "organism",
"http://eulersharp.sourceforge.net/2003/03swap/organization#": "organiz",
"http://eulersharp.sourceforge.net/2003/03swap/prolog#": "prolog",
"http://eulersharp.sourceforge.net/2003/03swap/quantitiesExtension#": "quantities",
"http://eulersharp.sourceforge.net/2003/03swap/unitsExtension#": "units",
"http://eulersharp.sourceforge.net/2006/02swap/fcm#": "fcm",
"http://eunis.eea.europa.eu/rdf/species-schema.rdf#": "eunis",
"http://eur-lex.publicdata.eu/ontology/": "eurlex",
"http://eventography.org/sede/0.1/": "sede",
"http://example.com/": "ex",
"http://example.org/name#": "name",
"http://explain.z3950.org/dtd/2.0/": "zr",
"http://fao.270a.info/dataset/": "fao",
"http://fise.iks-project.eu/ontology/": "fise",
"http://fliqz.com/": "urn",
"http://foaf.qdos.com/lastfm/schema/": "qdoslf",
"http://foodable.co/ns/": "fd",
"http://frb.270a.info/dataset/": "frb",
"http://freedesktop.org/standards/xesam/1.0/core#": "xesam",
"http://futurios.org/fos/spec/": "fos",
"http://gadm.geovocab.org/ontology#": "gadm",
"http://gawd.atlantides.org/terms/": "gawd",
"http://geni-orca.renci.org/owl/topology.owl#": "orca",
"http://genomequest.com/": "gq",
"http://geo.linkeddata.es/ontology/": "geoes",
"http://geovocab.org/": "geovocab",
"http://geovocab.org/geometry#": "geom",
"http://geovocab.org/geometry#": "ngeo",
"http://geovocab.org/spatial#": "spatial",
"http://gmpg.org/xfn/11#": "xfn",
"http://gov.genealogy.net/ontology.owl#": "gov",
"http://govwild.org/0.6/GWOntology.rdf/": "govwild",
"http://groundedannotationframework.org/": "gaf",
"http://guava.iis.sinica.edu.tw/r4r/": "r4r",
"http://harrisons.cc/": "harrisons",
"http://hello.com/": "dummy",
"http://hxl.humanitarianresponse.info/ns/#": "hxl",
"http://id.loc.gov/vocabulary/iso639-1/": "language",
"http://id.loc.gov/vocabulary/relators/": "marcrel",
"http://id.loc.gov/vocabulary/relators/": "mrel",
"http://idi.fundacionctic.org/cruzar/turismo#": "turismo",
"http://iflastandards.info/ns/fr/frad/": "frad",
"http://iflastandards.info/ns/fr/frbr/frbrer/": "frbrer",
"http://iflastandards.info/ns/fr/frsad/": "frsad",
"http://iflastandards.info/ns/isbd/elements/": "isbd",
"http://iflastandards.info/ns/muldicat#": "muldicat",
"http://imf.270a.info/dataset/": "imf",
"http://imi.ipa.go.jp/ns/core/210#": "ic",
"http://inference-web.org/2.0/pml-justification.owl#": "pmlj",
"http://inference-web.org/2.0/pml-provenance.owl#": "pmlp",
"http://inference-web.org/2.0/pml-relation.owl#": "pmlr",
"http://inference-web.org/2.0/pml-trust.owl#": "pmlt",
"http://info.deepcarbon.net/schema#": "dco",
"http://infotech.nitk.ac.in/research-scholars/sakthi-murugan-r/": "sakthi",
"http://infra.clarin.eu/cmd/": "cmdm",
"http://institutions.publicdata.eu/#": "eui",
"http://intelleo.eu/ontologies/user-model/ns/": "um",
"http://intellimind.io/ns/company#": "company",
"http://iptc.org/std/rNews/2011-10-07#": "rnews",
"http://iserve.kmi.open.ac.uk/ns/hrests#": "hr",
"http://iserve.kmi.open.ac.uk/ns/msm#": "msm",
"http://jefferson.tw.rpi.edu/ontology/hasneto#": "hasneto",
"http://jefferson.tw.rpi.edu/ontology/vstoi#": "vstoi",
"http://jena.hpl.hp.com/2008/tdb#": "tdb",
"http://jena.hpl.hp.com/ARQ/function#": "afn",
"http://jena.hpl.hp.com/ARQ/property#": "pf",
"http://jena.hpl.hp.com/Eyeball#": "eye",
"http://jicamaro.info/mp#": "mp",
"http://jmvanel.free.fr/ontology/software_applications.n3#": "app",
"http://kai.uni-kiel.de/": "kai",
"http://kaiko.getalp.org/dbnary#": "dbnary",
"http://kasei.us/about/foaf.xrdf#": "greg",
"http://kdo.render-project.eu/kdo#": "kdo",
"http://km.aifb.kit.edu/projects/numbers/number#": "no",
"http://kmi.open.ac.uk/projects/smartproducts/ontologies/food.owl#": "spfood",
"http://kmm.lboro.ac.uk/ecos/1.0#": "ecos",
"http://knoesis.wright.edu/provenir/provenir.owl#": "provenir",
"http://krauthammerlab.med.yale.edu/ontologies/gelo#": "gelo",
"http://kwantu.net/kw/": "kw",
"http://kwijibo.talis.com/": "kwijibo",
"http://kwijibo.talis.com/vocabs/puelia#": "puelia",
"http://labels4all.info/ns/": "l4a",
"http://labs.mondeca.com/vocab/endpointStatus#": "ends",
"http://langegger.at/xlwrap/vocab#": "xl",
"http://launchpad.net/rdf/launchpad#": "lp",
"http://lawd.info/ontology/": "lawd",
"http://ldf.fi/void-ext#": "vext",
"http://lemon-model.net/lemon#": "lemon",
"http://lemon-model.net/lexica/uby/": "lemonuby",
"http://lemon-model.net/oils#": "oils",
"http://lexvo.org/ontology#": "lexvo",
"http://lexvo.org/ontology#": "lvont",
"http://life.deri.ie/schema/": "life",
"http://linked.opendata.cz/ontology/ldvm/": "ldvm",
"http://linkedevents.org/ontology/": "lode",
"http://linkedgeodata.org/ontology/": "lgd",
"http://linkedgeodata.org/ontology/": "lgdo",
"http://linkedgeodata.org/ontology/": "lgv",
"http://linkedmultimedia.org/sparql-mm/functions#": "mm",
"http://linkedmultimedia.org/sparql-mm/functions/temporal#": "mmt",
"http://linkedmultimedia.org/sparql-mm/ns/1.0.0/function#": "mmf",
"http://linkedrecipes.org/schema/": "lr",
"http://linkedrecipes.org/schema/": "recipe",
"http://linkedscience.org/lsc/ns#": "lsc",
"http://linkedscience.org/teach/ns#": "teach",
"http://linkedspending.aksw.org/instance/": "ls",
"http://linkedspending.aksw.org/ontology/": "lso",
"http://linkedwidgets.org/ontologies/": "lw",
"http://linkedwidgets.org/statisticaldata/ontology/": "lsd",
"http://linkedwidgets.org/statisticalwidget/ontology/": "sw",
"http://lod.ac/ns/lodac#": "lodac",
"http://lod.b3kat.de/title/": "bsb",
"http://lod.geodan.nl/vocab/bag#": "bag",
"http://lod.gesis.org/lodpilot/ALLBUS/vocab.rdf#": "gesis",
"http://lod.taxonconcept.org/ontology/p01/Mammalia/index.owl#": "mammal",
"http://lod.taxonconcept.org/ontology/sci_people.owl#": "scip",
"http://lod.taxonconcept.org/ontology/txn.owl#": "txn",
"http://lod.taxonconcept.org/ses/": "ses",
"http://lod.xdams.org/reload/oad/": "oad",
"http://lod2.eu/schema/": "lod2",
"http://lodlaundromat.org/metrics/ontology/": "llm",
"http://lodlaundromat.org/ontology/": "llo",
"http://lodlaundromat.org/resource/": "ll",
"http://loted.eu/ontology#": "loted",
"http://lsdis.cs.uga.edu/projects/semdis/opus#": "opus",
"http://ltsc.ieee.org/rdf/lomv1p0/lom#": "lom",
"http://ltsc.ieee.org/rdf/lomv1p0/vocabulary#": "lomvoc",
"http://lukasblaho.sk/football_league_schema#": "fls",
"http://madskills.com/public/xml/rss/module/trackback/": "trackback",
"http://manesht.ir/": "mohammad",
"http://mappings.roadmap.org/": "roadmap",
"http://maven.apache.org/POM/4.0.0#": "pom",
"http://mbgd.genome.ad.jp/owl/mbgd.owl#": "mbgd",
"http://merlin.phys.uni.lodz.pl/onto/physo/physo.owl#": "physo",
"http://metadataregistry.org/uri/schema/RDARelationshipsGR2/": "rdarel2",
"http://mex.aksw.org/mex-algo#": "mexalgo",
"http://mex.aksw.org/mex-algo#": "mexv",
"http://mex.aksw.org/mex-core#": "mexcore",
"http://mged.sourceforge.net/ontologies/MGEDOntology.owl#": "mged",
"http://mlode.nlp2rdf.org/quranvocab#": "qvoc",
"http://mmisw.org/ont/cf/parameter/": "cf",
"http://moat-project.org/ns#": "moat",
"http://models.okkam.org/ENS-core-vocabulary#": "okkam",
"http://models.okkam.org/ENS-core-vocabulary.owl#": "ens",
"http://multimedialab.elis.ugent.be/organon/ontologies/ninsuna#": "nsa",
"http://multimedialab.elis.ugent.be/users/samcoppe/ontologies/Premis/premis.owl#": "premis",
"http://musicbrainz.org/ns/mmd-1.0#": "mmd",
"http://musicontology.com/": "music",
"http://myprefix.org/": "myprefix",
"http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#": "ncit",
"http://ndl.go.jp/dcndl/terms/": "dcndl",
"http://nerd.eurecom.fr/ontology#": "nerd",
"http://nidm.nidash.org/": "nidm",
"http://nl.ijs.si/ME/owl/": "mte",
"http://nlp2rdf.lod2.eu/schema/sso/": "sso",
"http://nlp2rdf.lod2.eu/schema/string/": "str",
"http://ns.adobe.com/photoshop/1.0/": "photoshop",
"http://ns.adobe.com/xap/1.0/": "xmp",
"http://ns.aksw.org/Evolution/": "evopat",
"http://ns.aksw.org/scms/annotations/": "scms",
"http://ns.aksw.org/spatialHierarchy/": "shv",
"http://ns.bergnet.org/tac/0.1/triple-access-control#": "tac",
"http://ns.cerise-project.nl/energy/def/cim-smartgrid#": "smg",
"http://ns.inria.fr/ast/sql#": "sql",
"http://ns.inria.fr/emoca#": "emoca",
"http://ns.inria.fr/emoca#": "emotion",
"http://ns.inria.fr/l4lod/v2/": "l4lod",
"http://ns.inria.fr/nicetag/2010/09/09/voc#": "nt",
"http://ns.inria.fr/nicetag/2010/09/09/voc#": "ntag",
"http://ns.inria.fr/prissma/v1#": "prissma",
"http://ns.inria.fr/ratio4ta/v1#": "r4ta",
"http://ns.inria.fr/s4ac/v2#": "s4ac",
"http://ns.inria.fr/webmarks#": "wm",
"http://ns.lucid-project.org/revision/": "lcdr",
"http://ns.nature.com/datasets/": "npgd",
"http://ns.nature.com/extensions/": "npgx",
"http://ns.nature.com/graphs/": "npgg",
"http://ns.nature.com/terms/": "npg",
"http://ns.ontowiki.net/SysOnt/": "sysont",
"http://ns.ontowiki.net/SysOnt/Site/": "site",
"http://ns.poundhill.com/phss/1.0/": "phss",
"http://ns.rww.io/wapp#": "wapp",
"http://ns.taverna.org.uk/2010/scufl2#": "scufl2",
"http://ns.taverna.org.uk/2012/tavernaprov/": "tavprov",
"http://nuts.psi.enakting.org/id/BE335/doc/": "nuts",
"http://oanda2rdf.appspot.com/xch/": "xch",
"http://obofoundry.org/ro/ro.owl#": "oboro",
"http://observedchange.com/moac/ns#": "moac",
"http://observedchange.com/tisc/ns#": "tisc",
"http://ocean-data.org/schema/": "odo",
"http://oecd.270a.info/dataset/": "oecd",
"http://ogp.me/ns#": "ogp",
"http://ogp.me/ns/article#": "article",
"http://okkam.org/terms#": "ok",
"http://omdoc.org/ontology/": "omdoc",
"http://omerxi.com/ontologies/core.owl.ttl#": "oxi",
"http://omv.ontoware.org/2005/05/ontology#": "omv",
"http://online-presence.net/opo/ns#": "opo",
"http://onto.dm2e.eu/schemas/dm2e/": "dm2e",
"http://ontojob.at/": "oj",
"http://ontologi.es/days#": "days",
"http://ontologi.es/doap-bugs#": "dbug",
"http://ontologi.es/doap-changeset#": "dcs",
"http://ontologi.es/doap-deps#": "deps",
"http://ontologi.es/giving#": "giving",
"http://ontologi.es/lang/core#": "lang",
"http://ontologi.es/like#": "like",
"http://ontologi.es/profiling#": "profiling",
"http://ontologi.es/rail/vocab#": "rail",
"http://ontologi.es/sparql#": "sparql",
"http://ontologi.es/status#": "status",
"http://ontologies.ezweb.morfeo-project.org/ezcontext/ns#": "ezcontext",
"http://ontologies.ezweb.morfeo-project.org/eztag/ns#": "eztag",
"http://ontologies.hypios.com/out#": "out",
"http://ontologies.smile.deri.ie/2009/02/27/memo#": "memo",
"http://ontologies.smile.deri.ie/pdo#": "pdo",
"http://ontology.ip.rm.cnr.it/ontologies/DOLCE-Lite#": "dl",
"http://ontology.irstea.fr/": "irstea",
"http://ontology.irstea.fr/weather/ontology#": "irsteaont",
"http://ontology.it/itsmo/v1#": "itsmo",
"http://ontologycentral.com/2009/01/eurostat/ns#": "estatwrap",
"http://ontologycentral.com/2010/05/cb/vocab#": "cbase",
"http://ontologydesignpatterns.org/": "odp",
"http://ontologydesignpatterns.org/ont/wikipedia/d0.owl#": "d0",
"http://ontoloji.galaksiya.com/vocab/": "galaksiya",
"http://ontorule-project.eu/resources/steel-30#": "steel",
"http://ontoview.org/schema/unspsc/1#": "unspsc",
"http://open-multinet.info/ontology/omn#": "omn",
"http://open-multinet.info/ontology/omn-federation#": "omnfed",
"http://open-multinet.info/ontology/omn-lifecycle#": "omnlife",
"http://open-services.net/ns/basicProfile#": "bp",
"http://open-services.net/ns/core#": "oslc",
"http://open-services.net/ns/crtv#": "crtv",
"http://open.vocab.org/terms/": "open",
"http://open.vocab.org/terms/": "ov",
"http://opencoinage.org/rdf/": "oc",
"http://opendata.caceres.es/def/ontomunicipio#": "om",
"http://opendata.caceres.es/def/ontosemanasanta#": "oss",
"http://opendata.cz/infrastructure/odcleanstore/": "odcs",
"http://opendepot.org/reference/linked/1.0/": "oarj",
"http://openean.kaufkauf.net/id/": "ean",
"http://opengraph.org/schema/": "ogorg",
"http://opengraphprotocol.org/schema/": "og",
"http://openknowledgegraph.org/ontology/": "okg",
"http://openlad.org/vocab#": "olad",
"http://openlinksw.com/schema/attribution#": "opl",
"http://openlinksw.com/schemas/oat/": "oat",
"http://openlinksw.com/services/facets/1.0/": "fct",
"http://openprovenance.org/model/opmo#": "opmo",
"http://openprovenance.org/ontology#": "opm",
"http://openprovenance.org/ontology#": "oprovo",
"http://openskos.org/xmlns#": "openskos",
"http://origins.link/": "origins",
"http://orion.tw.rpi.edu/~xgmatwc/refe/": "refe",
"http://owlrep.eu01.aws.af.cm/fridge#": "of",
"http://paul.staroch.name/thesis/SmartHomeWeather.owl#": "shw",
"http://penis.to/#": "penis",
"http://persistence.uni-leipzig.org/nlp2rdf/ontologies/nif-core#": "nif",
"http://persistence.uni-leipzig.org/nlp2rdf/ontologies/rlog#": "rlog",
"http://philosurfical.open.ac.uk/ontology/philosurfical.owl/": "phil",
"http://pictogram.tokyo/vocabulary#": "hp",
"http://pkgsrc.co/schema#": "pkgsrc",
"http://pleiades.stoa.org/places/": "ple",
"http://plugin.org.uk/swh-plugins/": "swh",
"http://poderopedia.com/vocab/": "poder",
"http://pokedex.dataincubator.org/pkm/": "pkmn",
"http://poshrdf.org/ns/posh/": "posh",
"http://prefix.cc/": "prefix",
"http://prefix.cc/nsogi:": "nsogi",
"http://prismstandard.org/namespaces/basic/2.0/": "prism",
"http://prismstandard.org/namespaces/basic/2.1/": "prism21",
"http://prismstandard.org/namespaces/pam/2.0/": "pam",
"http://privatealpha.com/ontology/certification/1#": "acrt",
"http://protege.stanford.edu/plugins/owl/dc/protege-dc.owl#": "protegedc",
"http://protege.stanford.edu/system#": "protege",
"http://proton.semanticweb.org/2005/04/protons#": "protons",
"http://prov4j.org/w3p/": "w3p",
"http://provenanceweb.org/ns/pml#": "pml",
"http://psh.techlib.cz/skos/": "psh",
"http://purl.bioontology.org/ontology/EDAM/": "edam",
"http://purl.obolibrary.org/obo/": "ero",
"http://purl.obolibrary.org/obo/": "obo",
"http://purl.obolibrary.org/obo/": "pobo",
"http://purl.obolibrary.org/obo/bco.owl#": "bco",
"http://purl.obolibrary.org/obo/iao.owl#": "iao",
"http://purl.oclc.org/NET/ldr/ns#": "ldr",
"http://purl.oclc.org/NET/lldr/ns#": "lldr",
"http://purl.oclc.org/NET/muo/muo#": "muo",
"http://purl.oclc.org/NET/mvco.owl#": "mvco",
"http://purl.oclc.org/NET/nknouf/ns/bibtex#": "bibtex",
"http://purl.oclc.org/NET/sism/0.1/": "sism",
"http://purl.oclc.org/NET/ssnx/cf/cf-feature#": "cff",
"http://purl.oclc.org/NET/ssnx/meteo/aws#": "aws",
"http://purl.oclc.org/NET/ssnx/qu/qu#": "qu",
"http://purl.oclc.org/NET/ssnx/ssn#": "ssn",
"http://purl.oclc.org/POIS/vcblr#": "pois",
"http://purl.oreilly.com/ns/meta/": "metadata",
"http://purl.org/acco/ns#": "acco",
"http://purl.org/acco/ns#": "accom",
"http://purl.org/adms/sw/": "admssw",
"http://purl.org/amicroformat/arecipe/": "arecipe",
"http://purl.org/archival/vocab/arch#": "arch",
"http://purl.org/ASN/schema/core/": "asn",
"http://purl.org/b2bo#": "b2bo",
"http://purl.org/biodiversity/taxon/": "taxon",
"http://purl.org/biotop/biotop.owl#": "biotop",
"http://purl.org/captsolo/resume-rdf/0.2/base#": "cvbase",
"http://purl.org/carfo#": "carfo",
"http://purl.org/cerif/frapo/": "frapo",
"http://purl.org/cld/cdtype/": "cdtype",
"http://purl.org/cld/terms/": "cld",
"http://purl.org/co/": "coll",
"http://purl.org/commerce#": "com",
"http://purl.org/commerce/creditcard#": "ccard",
"http://purl.org/commerce/payment#": "pay",
"http://purl.org/commerce/product#": "product",
"http://purl.org/configurationontology#": "cold",
"http://purl.org/coo/ns#": "coo",
"http://purl.org/court/def/2009/coin#": "coin",
"http://purl.org/csm/1.0#": "csm",
"http://purl.org/ctic/dcat#": "ds",
"http://purl.org/ctic/empleo/oferta#": "emp",
"http://purl.org/ctic/infraestructuras/organizacion#": "ctorg",
"http://purl.org/ctic/sector-publico/elecciones#": "elec",
"http://purl.org/datanode/ns/": "dn",
"http://purl.org/dc/dcam/": "dcam",
"http://purl.org/dc/dcmitype/": "dcmit",
"http://purl.org/dc/dcmitype/": "dcmitype",
"http://purl.org/dc/dcmitype/": "dctype",
"http://purl.org/dc/dcmitype/": "dctypes",
"http://purl.org/dc/elements/1.1/": "dc",
"http://purl.org/dc/elements/1.1/": "dc11",
"http://purl.org/dc/elements/1.1/": "dce",
"http://purl.org/dc/qualifiers/1.0/": "dcq",
"http://purl.org/dc/terms/": "dct",
"http://purl.org/dc/terms/": "dcterm",
"http://purl.org/dc/terms/": "dcterms",
"http://purl.org/dc/terms/": "purl",
"http://purl.org/derecho#": "derecho",
"http://purl.org/dita/ns#": "dita",
"http://purl.org/dqm-vocabulary/v1/dqm#": "dqm",
"http://purl.org/dsnotify/vocab/eventset/": "dsn",
"http://purl.org/eis/vocab/daq#": "daq",
"http://purl.org/essglobal/vocab/v1.0/": "essglobal",
"http://purl.org/fab/ns#": "fab",
"http://purl.org/finlex/schema/laki/": "finlaw",
"http://purl.org/finlex/schema/oikeus/": "fincaselaw",
"http://purl.org/foodontology#": "food",
"http://purl.org/gc/": "gnvc",
"http://purl.org/geovocamp/ontology/geovoid/": "geovoid",
"http://purl.org/germplasm/terms#": "germplasm",
"http://purl.org/goodrelations/v1#": "gr",
"http://purl.org/healthcarevocab/v1#": "dicom",
"http://purl.org/hpi/patchr#": "pat",
"http://purl.org/hpi/patchr#": "pro",
"http://purl.org/ibis#": "ibis",
"http://purl.org/imbi/ru-meta.owl#": "ru",
"http://purl.org/innovation/ns#": "inno",
"http://purl.org/iso25964/skos-thes#": "iso",
"http://purl.org/iso25964/skos-thes#": "isothes",
"http://purl.org/legal_form/vocab#": "lofv",
"http://purl.org/lex#": "lex",
"http://purl.org/lex/cz#": "lexcz",
"http://purl.org/library/": "lib",
"http://purl.org/library/": "library",
"http://purl.org/LiMo/0.1/": "limoo",
"http://purl.org/linguistics/gold/": "gold",
"http://purl.org/linked-data/api/vocab#": "api",
"http://purl.org/linked-data/api/vocab#": "apivc",
"http://purl.org/linked-data/api/vocab#": "lda",
"http://purl.org/linked-data/cube#": "cube",
"http://purl.org/linked-data/cube#": "qb",
"http://purl.org/linked-data/sdmx#": "sdmx",
"http://purl.org/linked-data/sdmx/2009/attribute#": "sdmxa",
"http://purl.org/linked-data/sdmx/2009/dimension#": "sdmxd",
"http://purl.org/linked-data/sdmx/2009/dimension#": "sdmxdim",
"http://purl.org/linked-data/xkos#": "xkos",
"http://purl.org/linkedpolitics/vocabulary/eu/plenary/": "lpeu",
"http://purl.org/linkingyou/": "lyou",
"http://purl.org/lobid/lv#": "lv",
"http://purl.org/locwd/schema#": "locwd",
"http://purl.org/makolab/caont/": "cao",
"http://purl.org/media/audio#": "audio",
"http://purl.org/media/video#": "video",
"http://purl.org/metainfo/terms/dsp#": "dsp",
"http://purl.org/microformat/hmedia/": "media",
"http://purl.org/microformat/hmedia/": "ufmedia",
"http://purl.org/muto/core#": "muto",
"http://purl.org/NET/acc#": "acc",
"http://purl.org/net/biblio#": "biblio",
"http://purl.org/NET/biol/botany#": "botany",
"http://purl.org/NET/biol/ns#": "biol",
"http://purl.org/NET/biol/zoology#": "zoology",
"http://purl.org/net/biordfmicroarray/ns#": "biordf",
"http://purl.org/NET/book/vocab#": "book",
"http://purl.org/NET/c4dm/event.owl#": "c4dm",
"http://purl.org/NET/c4dm/event.owl#": "event",
"http://purl.org/NET/c4dm/keys.owl#": "keys",
"http://purl.org/NET/c4dm/timeline.owl#": "timeline",
"http://purl.org/NET/c4dm/timeline.owl#": "tl",
"http://purl.org/NET/cidoc-crm/core#": "cidoccrm",
"http://purl.org/NET/cloudisus#": "cis",
"http://purl.org/net/compass#": "compass",
"http://purl.org/NET/cpan-uri/terms#": "cpant",
"http://purl.org/NET/dady#": "dady",
"http://purl.org/NET/decimalised#": "ddc",
"http://purl.org/net/dssn/": "dssn",
"http://purl.org/net/evident#": "evident",
"http://purl.org/net/hdlipcores/ontology/soc#": "soc",
"http://purl.org/net/hifm/data#": "hifm",
"http://purl.org/net/ldap/": "ldap",
"http://purl.org/NET/lindt#": "lindt",
"http://purl.org/net/lio#": "lio",
"http://purl.org/NET/lx#": "lx",
"http://purl.org/NET/mediatypes/": "mime",
"http://purl.org/net/ns/ontology-annot#": "ont",
"http://purl.org/net/ns/wordmap#": "wordmap",
"http://purl.org/net/opmv/ns#": "opmv",
"http://purl.org/net/opmv/types/gridworks#": "gridworks",
"http://purl.org/net/opmv/types/xslt#": "xslopm",
"http://purl.org/NET/ordf/": "ordf",
"http://purl.org/net/pingback/": "ping",
"http://purl.org/net/pingback/": "pingback",
"http://purl.org/net/po#": "plo",
"http://purl.org/net/provenance/integrity#": "prviv",
"http://purl.org/net/provenance/ns#": "hartigprov",
"http://purl.org/net/provenance/ns#": "prv",
"http://purl.org/net/provenance/types#": "prvt",
"http://purl.org/net/provenance/types#": "prvtypes",
"http://purl.org/NET/puc#": "puc",
"http://purl.org/net/rdf-money/": "money",
"http://purl.org/NET/rulz#": "rulz",
"http://purl.org/NET/schema-org-csv#": "scsv",
"http://purl.org/net/schemas/space/": "space",
"http://purl.org/NET/scovo#": "scovo",
"http://purl.org/NET/scovo#": "scv",
"http://purl.org/NET/seas#": "seas",
"http://purl.org/NET/ssnext/electricmeters#": "emtr",
"http://purl.org/NET/uri#": "uri",
"http://purl.org/net/vgo#": "videogame",
"http://purl.org/net/VideoGameOntology#": "vgo",
"http://purl.org/net/vocab/2004/03/label#": "label",
"http://purl.org/net/vocab/2004/07/visit#": "visit",
"http://purl.org/net/wf-motifs#": "wfm",
"http://purl.org/net/wf4ever/ro#": "wro",
"http://purl.org/NET/yoda#": "yoda",
"http://purl.org/ns/meteo#": "meteo",
"http://purl.org/nxp/schema/v1/": "nxp",
"http://purl.org/obo/owl/MS#": "ms",
"http://purl.org/obo/owl/NCBITaxon#": "ncbitaxon",
"http://purl.org/obo/owl/SO#": "oboso",
"http://purl.org/olap#": "qb4o",
"http://purl.org/olia/mte/multext-east.owl#": "mtecore",
"http://purl.org/olia/olia.owl#": "olia",
"http://purl.org/olia/penn.owl#": "penn",
"http://purl.org/olia/stanford.owl#": "stanford",
"http://purl.org/olia/system.owl#": "oliasystem",
"http://purl.org/omapi/0.2/#": "omapi",
"http://purl.org/ontology/af/": "af",
"http://purl.org/ontology/ao/core#": "ao",
"http://purl.org/ontology/bibo/": "bibo",
"http://purl.org/ontology/cco/core#": "cco",
"http://purl.org/ontology/cco/mappings#": "ccom",
"http://purl.org/ontology/chord/": "chord",
"http://purl.org/ontology/cosmo#": "cosmo",
"http://purl.org/ontology/daia/": "daia",
"http://purl.org/ontology/daia/Service/": "daiaserv",
"http://purl.org/ontology/dso#": "dso",
"http://purl.org/ontology/ecpo#": "ecpo",
"http://purl.org/ontology/gbv/": "gbv",
"http://purl.org/ontology/holding#": "holding",
"http://purl.org/ontology/iron#": "iron",
"http://purl.org/ontology/is/core#": "is",
"http://purl.org/ontology/is/inst/": "isi",
"http://purl.org/ontology/is/quality/": "isq",
"http://purl.org/ontology/is/types/": "ist",
"http://purl.org/ontology/last-fm/": "gob",
"http://purl.org/ontology/last-fm/": "lastfm",
"http://purl.org/ontology/last-fm/": "lfm",
"http://purl.org/ontology/mo/": "mo",
"http://purl.org/ontology/mo/mit#": "mit",
"http://purl.org/ontology/myspace#": "myspace",
"http://purl.org/ontology/myspace#": "myspo",
"http://purl.org/ontology/olo/core#": "olo",
"http://purl.org/ontology/paia#": "paia",
"http://purl.org/ontology/pbo/core#": "pbo",
"http://purl.org/ontology/places#": "places",
"http://purl.org/ontology/places/": "place",
"http://purl.org/ontology/po/": "po",
"http://purl.org/ontology/prv/core#": "pr",
"http://purl.org/ontology/prv/rules#": "prvr",
"http://purl.org/ontology/rec/core#": "rec",
"http://purl.org/ontology/sco#": "sco",
"http://purl.org/ontology/service#": "service",
"http://purl.org/ontology/similarity/": "musim",
"http://purl.org/ontology/similarity/": "sim",
"http://purl.org/ontology/ssso#": "ssso",
"http://purl.org/ontology/stories/": "stories",
"http://purl.org/ontology/storyline/": "nsl",
"http://purl.org/ontology/symbolic-music/": "so",
"http://purl.org/ontology/wi/core#": "wi",
"http://purl.org/ontology/wo/": "wlo",
"http://purl.org/ontology/wo/": "wo",
"http://purl.org/ontomedia/core/expression#": "ome",
"http://purl.org/ontomedia/core/media#": "omm",
"http://purl.org/ontomedia/core/space#": "spc",
"http://purl.org/ontomedia/ext/common/being#": "being",
"http://purl.org/ontomedia/ext/common/being#": "omb",
"http://purl.org/ontomedia/ext/common/bestiary#": "omc",
"http://purl.org/ontomedia/ext/common/profession#": "omp",
"http://purl.org/ontomedia/ext/common/trait#": "omt",
"http://purl.org/opdm/refrigerator#": "ofrd",
"http://purl.org/openorg/": "oo",
"http://purl.org/oslo/ns/localgov#": "oslo",
"http://purl.org/pav/": "pav",
"http://purl.org/procurement/public-contracts#": "pc",
"http://purl.org/procurement/public-contracts#": "pco",
"http://purl.org/procurement/public-contracts-czech#": "pccz",
"http://purl.org/prog/": "prog",
"http://purl.org/provenance/w3p/w3po#": "w3po",
"http://purl.org/provone#": "provone",
"http://purl.org/rdfstats/stats#": "stats",
"http://purl.org/rdo/ns#": "rdo",
"http://purl.org/reco#": "reco",
"http://purl.org/req/": "req",
"http://purl.org/restdesc/http-template#": "tmpl",
"http://purl.org/rss/1.0/": "rss",
"http://purl.org/rss/1.0/modules/content/": 'columns',
"http://purl.org/rss/1.0/modules/taxonomy/": "taxo",
"http://purl.org/rvl/": "rvl",
"http://purl.org/saws/ontology#": "saws",
"http://purl.org/science/owl/sciencecommons/": "sc",
"http://purl.org/signature#": "sig",
"http://purl.org/spar/biro/": "biro",
"http://purl.org/spar/c4o/": "c4o",
"http://purl.org/spar/cito/": "cito",
"http://purl.org/spar/datacite/": "dcite",
"http://purl.org/spar/deo/": "deo",
"http://purl.org/spar/doco/": "doco",
"http://purl.org/spar/fabio/": "fabio",
"http://purl.org/spar/pso/": "pso",
"http://purl.org/spar/pwo/": "pwo",
"http://purl.org/spar/scoro/": "scoro",
"http://purl.org/stuff/project/": "prj",
"http://purl.org/stuff/rev#": "rev",
"http://purl.org/swan/1.2/agents/": "swanag",
"http://purl.org/swan/1.2/citations/": "swanci",
"http://purl.org/swan/1.2/discourse-elements/": "swande",
"http://purl.org/swan/1.2/discourse-relationships/": "swandr",
"http://purl.org/swan/1.2/pav/": "swanpav",
"http://purl.org/swan/1.2/qualifiers/": "swanq",
"http://purl.org/swan/1.2/qualifiers/": "swanqs",
"http://purl.org/swan/1.2/swan-commons/": "swanco",
"http://purl.org/swan/2.0/discourse-relationships/": "dr",
"http://purl.org/tcga/core#": "tcga",
"http://purl.org/telix#": "telix",
"http://purl.org/telmap/": "telmap",
"http://purl.org/theatre#": "theatre",
"http://purl.org/tio/ns#": "tio",
"http://purl.org/tripfs/2010/02#": "tripfs",
"http://purl.org/tripfs/2010/06#": "tripfs2",
"http://purl.org/twc/cabig/model/HINTS2005-1.owl#": "hints2005",
"http://purl.org/twc/health/vocab/": "health",
"http://purl.org/twc/health/vocab/aggregate/": "agg",
"http://purl.org/twc/ontologies/cmo.owl#": "cmo",
"http://purl.org/twc/ontologies/identity.owl#": "identity",
"http://purl.org/twc/ontology/cdm.owl#": "cdm",
"http://purl.org/twc/ontology/frir.owl#": "frir",
"http://purl.org/twc/vocab/aapi-schema#": "twaapi",
"http://purl.org/twc/vocab/between-the-edges/": "bte",
"http://purl.org/twc/vocab/centrifuge#": "centrifuge",
"http://purl.org/twc/vocab/conversion/": "c9d",
"http://purl.org/twc/vocab/conversion/": "conv",
"http://purl.org/twc/vocab/conversion/": "conversion",
"http://purl.org/twc/vocab/cross-topix#": "xt",
"http://purl.org/twc/vocab/datacarver#": "crv",
"http://purl.org/twc/vocab/datafaqs#": "datafaqs",
"http://purl.org/twc/vocab/goef#": "goef",
"http://purl.org/twc/vocab/opendap#": "od",
"http://purl.org/twc/vocab/pvcs#": "pvcs",
"http://purl.org/twc/vocab/vsr#": "vsr",
"http://purl.org/twc/vocab/vsr/graffle#": "graffle",
"http://purl.org/uco/ns#": "uco",
"http://purl.org/uF/hCard/terms/": "hcard",
"http://purl.org/uF/hCard/terms/": "hcterms",
"http://purl.org/viso/": "viso",
"http://purl.org/voc/ling/": "ling",
"http://purl.org/voc/uneskos#": "uneskos",
"http://purl.org/voc/vrank#": "vrank",
"http://purl.org/vocab/aiiso/schema#": "aiiso",
"http://purl.org/vocab/bio/0.1/": "bio",
"http://purl.org/vocab/changeset/schema#": "cs",
"http://purl.org/vocab/cpsv#": "cpsv",
"http://purl.org/vocab/frbr/core#": "frbr",
"http://purl.org/vocab/frbr/core#": "frbrcore",
"http://purl.org/vocab/frbr/extended#": "frbre",
"http://purl.org/vocab/lifecycle/schema#": "lcy",
"http://purl.org/vocab/lifecycle/schema#": "lifecycle",
"http://purl.org/vocab/participation/schema#": "part",
"http://purl.org/vocab/participation/schema#": "particip",
"http://purl.org/vocab/participation/schema#": "role",
"http://purl.org/vocab/psychometric-profile/": "psych",
"http://purl.org/vocab/relationship/": "ref",
"http://purl.org/vocab/relationship/": "rel",
"http://purl.org/vocab/resourcelist/schema#": "resource",
"http://purl.org/vocab/riro/ddl#": "ddl",
"http://purl.org/vocab/riro/gpt#": "gpt",
"http://purl.org/vocab/riro/sdl#": "sdl",
"http://purl.org/vocab/vann/": "vann",
"http://purl.org/vocabularies/amalgame#": "amalgame",
"http://purl.org/vocabularies/princeton/wn30/": "wn30",
"http://purl.org/vocabularies/princeton/wordnet/schema#": "wordnet",
"http://purl.org/vocommons/bridge#": "bridge",
"http://purl.org/vocommons/bv#": "bv",
"http://purl.org/vocommons/voaf#": "voaf",
"http://purl.org/vso/ns#": "vso",
"http://purl.org/vvo/ns#": "vvo",
"http://purl.org/wai#": "wai",
"http://purl.org/webofneeds/model#": "won",
"http://purl.org/weso/computex/ontology#": "cex",
"http://purl.org/weso/cpv/": "cpv",
"http://purl.org/weso/ontologies/scowt#": "scowt",
"http://purl.org/weso/uni/uni.html#": "uni",
"http://purl.org/wf4ever/ro#": "ro",
"http://purl.org/wf4ever/roevo#": "roevo",
"http://purl.org/wf4ever/roterms#": "roterms",
"http://purl.org/wf4ever/wf4ever#": "wf4ever",
"http://purl.org/wf4ever/wfdesc#": "wfdesc",
"http://purl.org/wf4ever/wfprov#": "wfprov",
"http://purl.org/xro/ns#": "xro",
"http://purl.org/xtypes/": "xtypes",
"http://purl.uniprot.org/core/": "uniprot",
"http://qudt.org/1.1/schema/qudt#": "qud",
"http://qudt.org/1.1/schema/qudt#": "qudt",
"http://qudt.org/schema/quantity#": "quantity",
"http://qudt.org/vocab/unit#": "unit",
"http://ramonantonio.net/doac/0.1/#": "doac",
"http://rdaregistry.info/Elements/a/": "rdaa",
"http://rdaregistry.info/Elements/c/": "rdac",
"http://rdaregistry.info/Elements/e/": "rdae",
"http://rdaregistry.info/Elements/i/": "rdai",
"http://rdaregistry.info/Elements/m/": "rdam",
"http://rdaregistry.info/Elements/u/": "rdau",
"http://rdaregistry.info/Elements/w/": "rdaw",
"http://rdaregistry.info/Elements/z/": "rdaz",
"http://rdaregistry.info/termList/bookFormat/": "rdabf",
"http://rdaregistry.info/termList/collTitle/": "rdacct",
"http://rdaregistry.info/termList/emulsionMicro/": "rdaemm",
"http://rdaregistry.info/termList/fontSize/": "rdafs",
"http://rdaregistry.info/termList/FormNoteMus/": "rdafnm",
"http://rdaregistry.info/termList/frequency/": "rdafr",
"http://rdaregistry.info/termList/gender/": "rdagd",
"http://rdaregistry.info/termList/groovePitch/": "rdagrp",
"http://rdaregistry.info/termList/grooveWidth/": "rdagw",
"http://rdaregistry.info/termList/modeIssue/": "rdami",
"http://rdaregistry.info/termList/MusNotation/": "rdafmn",
"http://rdaregistry.info/termList/noteForm/": "rdafnv",
"http://rdaregistry.info/termList/prodTactile/": "rdapmt",
"http://rdaregistry.info/termList/RDABaseMaterial/": "rdabm",
"http://rdaregistry.info/termList/RDACarrierType/": "rdact",
"http://rdaregistry.info/termList/RDAColourContent/": "rdacc",
"http://rdaregistry.info/termList/RDAContentType/": "rdaco",
"http://rdaregistry.info/termList/RDAMediaType/": "rdamt",
"http://rdaregistry.info/termList/RDAPolarity/": "rdapo",
"http://rdaregistry.info/termList/RDAReductionRatio/": "rdarr",
"http://rdaregistry.info/termList/rofch/": "rofch",
"http://rdaregistry.info/termList/rofem/": "rofem",
"http://rdaregistry.info/termList/rofer/": "rofer",
"http://rdaregistry.info/termList/rofet/": "rofet",
"http://rdaregistry.info/termList/soundCont/": "rdasco",
"http://rdaregistry.info/termList/statIdentification/": "rdasoi",
"http://rdaregistry.info/termList/TacNotation/": "rdaftn",
"http://rdaregistry.info/termList/trackConfig/": "rdatc",
"http://rdaregistry.info/termList/typeRec/": "rdatr",
"http://rdf-vocabulary.ddialliance.org/discovery#": "disco",
"http://rdf-vocabulary.ddialliance.org/phdd#": "phdd",
"http://rdf.alchemyapi.com/rdf/v1/s/aapi-schema#": "aapi",
"http://rdf.alchemyapi.com/rdf/v1/s/aapi-schema#": "alchemy",
"http://rdf.data-vocabulary.org/": "rich",
"http://rdf.data-vocabulary.org/#": "dv",
"http://rdf.data-vocabulary.org/#": "gd",
"http://rdf.data-vocabulary.org/#": "gv",
"http://rdf.data-vocabulary.org/rdf.xml#": "rdfdata",
"http://rdf.ebi.ac.uk/terms/chembl#": "chembl",
"http://rdf.ebi.ac.uk/vocabulary/zooma/": "zoomaterms",
"http://rdf.ecs.soton.ac.uk/ontology/ecs#": "ecs",
"http://rdf.freebase.com/ns/": "fb",
"http://rdf.freebase.com/ns/": "freebase",
"http://rdf.freebase.com/ns/location/geocode/": "fbgeo",
"http://rdf.geospecies.org/methods/observationMethod#": "obsm",
"http://rdf.geospecies.org/ont/geospecies#": "geosp",
"http://rdf.geospecies.org/ont/geospecies#": "geospecies",
"http://rdf.insee.fr/def/demo#": "idemo",
"http://rdf.insee.fr/def/geo#": "igeo",
"http://rdf.muninn-project.org/ontologies/appearances#": "aos",
"http://rdf.muninn-project.org/ontologies/graves#": "graves",
"http://rdf.muninn-project.org/ontologies/jp1/": "jp1",
"http://rdf.muninn-project.org/ontologies/military#": "mil",
"http://rdf.muninn-project.org/ontologies/naval#": "naval",
"http://rdf.muninn-project.org/ontologies/religion#": "religion",
"http://rdf.myexperiment.org/ontologies/base/": "meb",
"http://rdf.myexperiment.org/ontologies/snarm/": "snarm",
"http://rdf.onisep.fr/resource/": "onisep",
"http://rdf.ontology2.com/vocab#": "vocab",
"http://rdf123.umbc.edu/ns/": "rdf123",
"http://rdfdata.eionet.europa.eu/ramon/ontology/": "ramon",
"http://rdflivenews.aksw.org/ontology/": "rlno",
"http://rdflivenews.aksw.org/resource/": "rlnr",
"http://rdfns.org/d2d/": "d2d",
"http://rdfs.co/bevon/": "bevon",
"http://rdfs.org/ns/void#": "void",
"http://rdfs.org/ns/void-ext#": "voidext",
"http://rdfs.org/resume-rdf/": "cv",
"http://rdfs.org/scot/ns#": "scot",
"http://rdfs.org/sioc/actions#": "sioca",
"http://rdfs.org/sioc/argument#": "arg",
"http://rdfs.org/sioc/ns#": "sioc",
"http://rdfs.org/sioc/services#": "siocserv",
"http://rdfs.org/sioc/types#": "sioct",
"http://rdfs.org/sioc/types#": "sioctypes",
"http://rdfs.org/sioc/types#": "tsioc",
"http://rdfunit.aksw.org/ns/core#": "ruto",
"http://rdvocab.info/Elements/": "rdag1",
"http://rdvocab.info/Elements/": "rdagr1",
"http://rdvocab.info/ElementsGr2/": "rdag2",
"http://rdvocab.info/ElementsGr3/": "rdag3",
"http://rdvocab.info/RDARelationshipsWEMI/": "rdarel",
"http://rdvocab.info/RDARelationshipsWEMI/": "rdrel",
"http://rdvocab.info/roles/": "rdarole",
"http://rdvocab.info/termList/RDACarrierType/": "rdacarrier",
"http://rdvocab.info/termList/RDAContentType/": "rdacontent",
"http://rdvocab.info/termList/RDAMediaType/": "rdamedia",
"http://rdvocab.info/uri/schema/FRBRentitiesRDA/": "rdafrbr",
"http://reactionontology.org/piero/": "piero",
"http://redfoot.net/2005/session#": "session",
"http://reegle.info/schema#": "reegle",
"http://reference.data.gov.uk/def/central-government/": "cgov",
"http://reference.data.gov.uk/def/intervals/": "interval",
"http://reference.data.gov.uk/def/intervals/": "intervals",
"http://reference.data.gov.uk/def/organogram/": "odv",
"http://reference.data.gov.uk/def/parliament/": "parl",
"http://reference.data.gov.uk/def/payment#": "payment",
"http://reference.data.gov.uk/technical-registry/": "pronom",
"http://registry.info/termList/recMedium/": "rdarm",
"http://resex.rkbexplorer.com/ontologies/resex#": "resex",
"http://resource.geosciml.org/ontology/timescale/gts#": "gts",
"http://resource.geosciml.org/ontology/timescale/thors#": "thors",
"http://rhizomik.net/ontologies/2005/03/Mpeg7-2001.owl#": "mpeg7",
"http://rhizomik.net/ontologies/copyrightonto.owl#": "co",
"http://rhizomik.net/ontologies/copyrightonto.owl#": "copyright",
"http://richard.cyganiak.de/": "kontakt",
"http://richard.cyganiak.de/2007/pubby/config.rdf#": "conf",
"http://rinfo.lagrummet.se/ns/2008/11/rinfo/publ#": "rpubl",
"http://rs.tdwg.org/dwc/terms/": "dwc",
"http://s.zemanta.com/ns#": "zem",
"http://sa.aktivespace.org/ontologies/aktivesa#": "aktivesa",
"http://salt.semanticauthoring.org/ontologies/sao#": "sao",
"http://salt.semanticauthoring.org/ontologies/sro#": "sro",
"http://saxon.sf.net/": "saxon",
"http://schema.geolink.org/": "ecgl",
"http://schema.geolink.org/": "gl",
"http://schema.geolink.org/dev/view/": "glview",
"http://schema.geolink.org/view/": "ecglview",
"http://schema.intellimind.ns/symbology#": "imind",
"http://schema.omg.org/spec/CTS2/1.0/": "cts2",
"http://schema.org/": "schema",
"http://schema.org/": "sdo",
"http://schema.theodi.org/odrs#": "odrs",
"http://schema.wolterskluwer.de/": "wkd",
"http://schemas.capita-libraries.co.uk/2015/acl/schema#": "caplibacl",
"http://schemas.microsoft.com/imm/": "imm",
"http://schemas.ogf.org/nml/2013/05/base#": "ndl",
"http://schemas.opengis.net/wfs/": "wfs",
"http://schemas.talis.com/2005/address/schema#": "ad",
"http://schemas.talis.com/2005/address/schema#": "address",
"http://schemas.talis.com/2005/dir/schema#": "dir",
"http://schemas.talis.com/2005/service/schema#": "sv",
"http://schemas.talis.com/2005/user/schema#": "user",
"http://scubadive.networld.to/dive.rdf#": "dive",
"http://search.yahoo.com/searchmonkey/commerce/": "commerce",
"http://securitytoolbox.appspot.com/MASO#": "maso",
"http://securitytoolbox.appspot.com/securityAlgorithms#": "algo",
"http://securitytoolbox.appspot.com/securityMain#": "security",
"http://securitytoolbox.appspot.com/stac#": "stac",
"http://semantic-mediawiki.org/swivt/1.0#": "swivt",
"http://semantic.eurobau.com/eurobau-utility.owl#": "ebu",
"http://semanticdiet.com/schema/usda/nndsr/": "nndsr",
"http://semanticscience.org/resource/": "sio",
"http://semantictweet.com/": "semtweet",
"http://semanticweb.cs.vu.nl/2009/11/sem/": "sem",
"http://semanticweb.org/id/": "swid",
"http://semweb.mmlab.be/ns/dicera#": "dicera",
"http://semweb.mmlab.be/ns/odapps#": "odapps",
"http://semweb.mmlab.be/ns/oh#": "oh",
"http://semweb.mmlab.be/ns/rml#": "rml",
"http://semweb.mmlab.be/ns/stoptimes#": "st",
"http://sensormeasurement.appspot.com/ont/home/homeActivity#": "ha",
"http://server.ubiqore.com/ubiq/core#": "ubiq",
"http://sig.uw.edu/fma#": "fma",
"http://simile.mit.edu/2003/10/ontologies/artstor#": "artstor",
"http://simile.mit.edu/2003/10/ontologies/vraCore3#": "vra",
"http://sindice.com/hlisting/0.1/": "hlisting",
"http://sindice.com/vocab/search#": "search",
"http://sites.google.com/site/xgmaitc/": "marshall",
"http://sites.wiwiss.fu-berlin.de/suhl/bizer/d2r-server/config.rdf#": "d2r",
"http://skipforward.net/skipforward/resource/": "skip",
"http://spatial.ucd.ie/2012/08/osmsemnet/": "osmsemnet",
"http://spatial.ucd.ie/lod/osn/": "osn",
"http://spdx.org/rdf/terms#": "spdx",
"http://spektrum.ctu.cz/ontologies/radio-spectrum#": "rs",
"http://spi-fm.uca.es/neologism/cerif#": "cerif",
"http://spi-fm.uca.es/spdef/models/deployment/spcm/1.0#": "spcm",
"http://spi-fm.uca.es/spdef/models/deployment/swpm/1.0#": "swpm",
"http://spi-fm.uca.es/spdef/models/genericTools/itm/1.0#": "itm",
"http://spi-fm.uca.es/spdef/models/genericTools/vmm/1.0#": "vmm",
"http://spi-fm.uca.es/spdef/models/genericTools/wikim/1.0#": "wikim",
"http://spinrdf.org/sp#": "sp",
"http://spinrdf.org/spif#": "spif",
"http://spinrdf.org/spin#": "spin",
"http://spinrdf.org/spl#": "spl",
"http://spitfire-project.eu/ontology/ns/": "spt",
"http://stanbol.apache.org/ontology/disambiguation/disambiguation#": "dis",
"http://stanbol.apache.org/ontology/enhancer/enhancer#": "enhancer",
"http://standaarden.overheid.nl/owms/": "overheid",
"http://stats.data-gov.ie/property/": "sdgp",
"http://strdf.di.uoa.gr/ontology#": "strdf",
"http://sw-portal.deri.org/ontologies/swportal#": "swpo",
"http://sw.cyc.com/CycAnnotations_v1#": "cycann",
"http://sw.deri.org/2005/08/conf/cfp.owl#": "cfp",
"http://sw.deri.org/2006/07/location/loc#": "location",
"http://sw.opencyc.org/concept/": "cyc",
"http://sw.opencyc.org/concept/": "opencyc",
"http://swat.cse.lehigh.edu/onto/univ-bench.owl#": "sbench",
"http://swat.cse.lehigh.edu/resources/onto/aigp.owl#": "aigp",
"http://sweet.jpl.nasa.gov/2.0/mathOperation.owl#": "oper",
"http://swpatho.ag-nbi.de/context/meta.owl#": "swpatho",
"http://swrc.ontoware.org/ontology#": "swrc",
"http://sws.geonames.org/": "geodata",
"http://sws.ifi.uio.no/vocab/npd#": "npdv",
"http://tackbp.org/2013/ontology#": "kbp",
"http://tadirah.dariah.eu/vocab/": "tadirah",
"http://td5.org/#": "td5",
"http://telegraphis.net/ontology/geography/geography#": "geographis",
"http://telegraphis.net/ontology/measurement/code#": "code",
"http://test2.example.com/": "test",
"http://teste.com/": "ljkl",
"http://this.invalid/test2#": "test2",
"http://tipsy.googlecode.com/svn/trunk/vocab/pmt#": "pmt",
"http://tobyinkster.co.uk/#": "toby",
"http://topbraid.org/sparqlmotion#": "sm",
"http://topbraid.org/sparqlmotionfunctions#": "smf",
"http://topbraid.org/sparqlmotionlib#": "sml",
"http://trust.utep.edu/visko/ontology/visko-operator-v3.owl#": "visko",
"http://trust.utep.edu/visko/ontology/visko-operator-v3.owl#": "viskoo",
"http://trust.utep.edu/visko/ontology/visko-view-v3.owl#": "viskov",
"http://tw.rpi.edu/schema/": "tw",
"http://uis.270a.info/dataset/": "uis",
"http://umbel.org/umbel#": "umbel",
"http://umbel.org/umbel/ac/": "ac",
"http://umbel.org/umbel/ne/": "ne",
"http://umbel.org/umbel/rc/": "umbelrc",
"http://upload.wikimedia.org/wikipedia/commons/f/f6/": "wikimedia",
"http://uptheasset.org/ontology#": "ass",
"http://uptheasset.org/ontology#": "uta",
"http://uri4uri.net/vocab#": "uri4uri",
"http://uriplay.org/spec/ontology/#": "play",
"http://usefulinc.com/ns/doap#": "doap",
"http://users.ugent.be/~tdenies/up/": "up",
"http://users.utcluj.ro/~raluca/ontology/Ontology1279614123500.owl#": "lark1",
"http://users.utcluj.ro/~raluca/rdf_ontologies_ralu/ralu_modified_ontology_pizzas2_0#": "anca",
"http://vapour.sourceforge.net/vocab.rdf#": "vapour",
"http://verticalsearchworks.com/ontology/": "vsw",
"http://verticalsearchworks.com/ontology/synset#": "vsws",
"http://viaf.org/ontology/1.1/#": "viaf",
"http://vidont.org/": "vidont",
"http://vitro.mannlib.cornell.edu/ns/vitro/public#": "vitro",
"http://vivoweb.org/ontology/core#": "core",
"http://vivoweb.org/ontology/core#": "vivo",
"http://voag.linkedmodel.org/schema/voag#": "voag",
"http://vocab-ld.org/vocab/static-ld#": "static",
"http://vocab.data.gov/def/drm#": "drm",
"http://vocab.data.gov/def/fea#": "fea",
"http://vocab.deri.ie/am#": "am",
"http://vocab.deri.ie/br#": "br",
"http://vocab.deri.ie/c4n#": "c4n",
"http://vocab.deri.ie/cogs#": "cogs",
"http://vocab.deri.ie/csp#": "csp",
"http://vocab.deri.ie/fingal#": "fingal",
"http://vocab.deri.ie/nocal#": "nocal",
"http://vocab.deri.ie/odapp#": "odapp",
"http://vocab.deri.ie/ppo#": "ppo",
"http://vocab.deri.ie/raul#": "raul",
"http://vocab.deri.ie/rooms#": "room",
"http://vocab.deri.ie/rooms#": "rooms",
"http://vocab.deri.ie/sad#": "sad",
"http://vocab.deri.ie/tao#": "tao",
"http://vocab.fusepool.info/fam#": "fam",
"http://vocab.fusepool.info/fp3#": "fp3",
"http://vocab.getty.edu/aat/": "aat",
"http://vocab.getty.edu/ontology#": "gvp",
"http://vocab.getty.edu/tgn/": "tgn",
"http://vocab.getty.edu/ulan/": "ulan",
"http://vocab.gtfs.org/terms#": "gtfs",
"http://vocab.inf.ed.ac.uk/library/holdings#": "lh",
"http://vocab.lenka.no/geo-deling#": "geod",
"http://vocab.lenka.no/geo-deling#": "ngeoi",
"http://vocab.linkeddata.es/datosabiertos/def/comercio/tejidoComercial#": "escom",
"http://vocab.linkeddata.es/datosabiertos/def/hacienda/presupuestos#": "espresup",
"http://vocab.linkeddata.es/datosabiertos/def/sector-publico/territorio#": "esadm",
"http://vocab.linkeddata.es/datosabiertos/def/turismo/alojamiento#": "esaloj",
"http://vocab.linkeddata.es/datosabiertos/def/urbanismo-infraestructuras/callejero#": "cjr",
"http://vocab.linkeddata.es/datosabiertos/def/urbanismo-infraestructuras/callejero#": "escjr",
"http://vocab.linkeddata.es/datosabiertos/def/urbanismo-infraestructuras/direccionPostal#": "esdir",
"http://vocab.linkeddata.es/datosabiertos/def/urbanismo-infraestructuras/equipamiento#": "esequip",
"http://vocab.linkeddata.es/datosabiertos/def/urbanismo-infraestructuras/transporte#": "estrn",
"http://vocab.linkeddata.es/urbanismo-infraestructuras/territorio#": "muni",
"http://vocab.org/transit/terms/": "transit",
"http://vocab.org/waiver/terms/": "wv",
"http://vocab.org/whisky/terms/": "whisky",
"http://vocab.ouls.ox.ac.uk/projectfunding#": "arpfo",
"http://vocab.ox.ac.uk/camelot#": "camelot",
"http://vocab.ox.ac.uk/ludo#": "ludo",
"http://vocab.ox.ac.uk/projectfunding#": "ox",
"http://vocab.resc.info/communication#": "comm",
"http://vocab.sindice.com/xfn#": "xfnv",
"http://vocab.sindice.net/": "sindice",
"http://vocab.sindice.net/csv/": "csv",
"http://vocab.ub.uni-leipzig.de/bibrm/": "bibrm",
"http://vocabularies.bridgedb.org/ops#": "ops",
"http://vocabularies.wikipathways.org/": "wp",
"http://vocabularies.wikipathways.org/gpml#": "gpml",
"http://w3id.org/verb/": "verb",
"http://web-semantics.org/ns/mysql/": "mysql",
"http://web-semantics.org/ns/opensocial#": "osoc",
"http://web.resource.org/rss/1.0/modules/syndication/": "rssynd",
"http://webbox.ecs.soton.ac.uk/ns#": "webbox",
"http://weblab-project.org/core/model/property/processing/": "wlp",
"http://webns.net/mvcb/": "admin",
"http://webofcode.org/wfn/": "wfn",
"http://webofcode.org/wfn/call:": "call",
"http://webr3.org/owl/guo#": "guo",
"http://webtlab.it.uc3m.es/": "webtlab",
"http://webtlab.it.uc3m.es/2010/10/WebAppsOntology#": "wao",
"http://west.uni-koblenz.de/ontologies/2010/07/dgfoaf.owl#": "dgfoaf",
"http://wifo-ravensburg.de/semanticweb.rdf#": "rv",
"http://wifo5-04.informatik.uni-mannheim.de/factbook/ns#": "factbook",
"http://wiktionary.dbpedia.org/terms/": "wikterms",
"http://wiss-ki.eu/": "wisski",
"http://wordnet-rdf.princeton.edu/ontology#": "wno",
"http://wordnet-rdf.princeton.edu/wn31/": "wn31",
"http://worldbank.270a.info/classification/": "wbc",
"http://worldbank.270a.info/dataset/": "worldbank",
"http://worldbank.270a.info/property/": "wbp",
"http://www.affymetrix.com/community/publications/affymetrix/tmsplice#": "affy",
"http://www.agetec.org/": "agetec",
"http://www.agfa.com/w3c/2009/clinicalEvaluation#": "clineva",
"http://www.agfa.com/w3c/2009/clinicalProcedure#": "clinproc",
"http://www.agfa.com/w3c/2009/drugTherapy#": "drug",
"http://www.agfa.com/w3c/2009/healthCare#": "healthcare",
"http://www.agfa.com/w3c/2009/hemogram#": "hemogram",
"http://www.agfa.com/w3c/2009/hospital#": "hospital",
"http://www.agfa.com/w3c/2009/humanDisorder#": "disease",
"http://www.agfa.com/w3c/2009/infectiousDisorder#": "infection",
"http://www.agfa.com/w3c/2009/malignantNeoplasm#": "malignneo",
"http://www.agls.gov.au/agls/terms/": "agls",
"http://www.aifb.kit.edu/id/": "aifb",
"http://www.aifb.kit.edu/project/ld-retriever/qrl#": "qrl",
"http://www.aifb.uni-karlsruhe.de/WBS/uhe/ontologies#": "newsevents",
"http://www.aktors.org/ontology/portal#": "akt",
"http://www.aktors.org/ontology/support#": "akts",
"http://www.ashutosh.com/test/": "card",
"http://www.awesomesauce.net/urmom/": "eat",
"http://www.bbc.co.uk/ontologies/cms/": "bbccms",
"http://www.bbc.co.uk/ontologies/coreconcepts/": "bbccore",
"http://www.bbc.co.uk/ontologies/creativework/": "cwork",
"http://www.bbc.co.uk/ontologies/news/": "bbc",
"http://www.bbc.co.uk/ontologies/provenance/": "bbcprov",
"http://www.bbc.co.uk/ontologies/sport/": "sport",
"http://www.bigdata.com/rdf/search#": "bd",
"http://www.biopax.org/release/biopax-level3.owl#": "biopax",
"http://www.bl.uk/schemas/bibliographic/blterms#": "blt",
"http://www.cidoc-crm.org/cidoc-crm/": "crm",
"http://www.clarin.eu/cmd/": "cmdi",
"http://www.co-ode.org/ontologies/pizza/pizza.owl#": "pizza",
"http://www.co-ode.org/roberts/travel.owl#": "travel",
"http://www.cogsci.princeton.edu/~wn/schema/": "wnschema",
"http://www.contextdatacloud.org/resource/": "cdc",
"http://www.daisy.org/z3998/2012/vocab/": "daisy",
"http://www.daml.org/2001/03/daml+oil#": "daml",
"http://www.daml.org/2001/09/countries/iso-3166-ont#": "coun",
"http://www.daml.org/2001/10/html/airport-ont#": "airport",
"http://www.daml.org/services/owl-s/1.2/generic/Expression.owl#": "owlse",
"http://www.daml.org/services/owl-s/1.2/Service.owl#": "owls",
"http://www.dbs.cs.uni-duesseldorf.de/RDF/relational#": "rdb",
"http://www.demcare.eu/ontologies/demlab.owl#": "demlab",
"http://www.dotnetrdf.org/configuration#": "dnr",
"http://www.dotnetrdf.org/leviathan#": "lfn",
"http://www.e-lico.eu/data/kupkb/": "kupkb",
"http://www.ebi.ac.uk/efo/": "efo",
"http://www.ebi.ac.uk/gxa/": "gxa",
"http://www.ebsemantics.net/gastro#": "gastro",
"http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#": "ebucore",
"http://www.ebusiness-unibw.org/ontologies/consumerelectronics/v1#": "ceo",
"http://www.ebusiness-unibw.org/ontologies/eclass/5.1.4/#": "eco",
"http://www.eclap.eu/schema/eclap/": "eclap",
"http://www.employee.com/data#": "employee",
"http://www.enakting.org/provenance/voidp/": "voidp",
"http://www.ensias.ma/": "koly",
"http://www.essepuntato.it/2008/12/pattern#": "pattern",
"http://www.essepuntato.it/2012/04/tvc/": "tvc",
"http://www.essepuntato.it/2013/03/cito-functions#": "citof",
"http://www.essepuntato.it/2013/10/vagueness/": "vag",
"http://www.europeana.eu/schemas/edm/": "edm",
"http://www.example.org/lexicon#": "lexicon",
"http://www.example.org/rdf#": "example",
"http://www.example.org/terms/": "exterms",
"http://www.freeclass.eu/freeclass_v1#": "fc",
"http://www.ft.com/ontology/content/": "ftcontent",
"http://www.geneontology.org/formats/oboInOwl#": "oboinowl",
"http://www.geneontology.org/go#": "go",
"http://www.geocontext.org/publ/2013/vocab#": "geocontext",
"http://www.geonames.org/ontology#": "geonames",
"http://www.geonames.org/ontology#": "gn",
"http://www.geonames.org/ontology/mappings/": "gnm",
"http://www.georss.org/georss/": "georss",
"http://www.georss.org/georss/": "grs",
"http://www.google.com/": "beth",
"http://www.gsi.dit.upm.es/ontologies/marl/ns#": "marl",
"http://www.gsi.dit.upm.es/ontologies/onyx/ns#": "onyx",
"http://www.gutenberg.org/2009/pgterms/": "pgterms",
"http://www.holygoat.co.uk/owl/redwood/0.1/tags/": "hg",
"http://www.holygoat.co.uk/owl/redwood/0.1/tags/": "hlygt",
"http://www.holygoat.co.uk/owl/redwood/0.1/tags/": "tag",
"http://www.holygoat.co.uk/owl/redwood/0.1/tags/": "tags",
"http://www.icane.es/opendata/vocab#": "icane",
"http://www.ics.forth.gr/isl/MarineTLO/v4/marinetlo.owl#": "mtlo",
"http://www.ics.forth.gr/isl/oae/core#": "oae",
"http://www.ics.forth.gr/isl/oncm/core#": "onc",
"http://www.ics.forth.gr/isl/VoIDWarehouse/VoID_Extension_Schema.owl#": "voidwh",
"http://www.ifomis.org/bfo/1.1/span#": "span",
"http://www.infosys.com/": "infosys",
"http://www.inria.fr/acacia/corese#": "cos",
"http://www.ipaw.info/ns/picaso#": "pic",
"http://www.irit.fr/recherches/MELODI/ontologies/SAN.owl#": "san",
"http://www.isocat.org/datcat/": "isocat",
"http://www.isocat.org/ns/dcr.rdf#": "dcr",
"http://www.joshuajeeson.com/": "jjd",
"http://www.junkwork.net/xml/DocumentList#": "doclist",
"http://www.kanzaki.com/ns/dpd#": "dpd",
"http://www.kanzaki.com/ns/music#": "mu",
"http://www.kanzaki.com/ns/whois#": "whois",
"http://www.kinjal.com/condition:": "condition",
"http://www.language-archives.org/OLAC/1.0/": "olac",
"http://www.language-archives.org/OLAC/1.1/": "olac11",
"http://www.lehigh.edu/~zhp2/2004/0401/univ-bench.owl#": "ub",
"http://www.lexinfo.net/lmf#": "lmf",
"http://www.lexinfo.net/ontology/2.0/lexinfo#": "lexinfo",
"http://www.lingvoj.org/olca#": "olca",
"http://www.lingvoj.org/ontology#": "lingvo",
"http://www.lingvoj.org/ontology#": "lingvoj",
"http://www.lingvoj.org/semio#": "semio",
"http://www.linked2safety-project.eu/properties/": "l2sp",
"http://www.linkedcode.org/2014/12/linkedcode#": "lc",
"http://www.linkedmodel.org/1.0/schema/decl#": "decl",
"http://www.linkedmodel.org/schema/dtype#": "dtype",
"http://www.linkedmodel.org/schema/vaem#": "vaem",
"http://www.linkedthings.com/iot/": "iot",
"http://www.linklion.org/lden/": "lden",
"http://www.linklion.org/ontology#": "llont",
"http://www.loa-cnr.it/ontologies/DUL.owl#": "dul",
"http://www.loc.gov/mads/rdf/v1#": "mads",
"http://www.loc.gov/mads/rdf/v1#": "madsrdf",
"http://www.loc.gov/mods/v3#": "mods",
"http://www.loc.gov/zing/srw/": "sru",
"http://www.loc.gov/zing/srw/diagnostic/": "diag",
"http://www.lotico.com/meetup/": "meetup",
"http://www.lotico.com/ontology/": "loticoowl",
"http://www.lotico.com/resource/": "lotico",
"http://www.metadata.net/harmony/ABCSchemaV5Commented.rdf#": "abc",
"http://www.metalex.eu/schema/1.0#": "metalex",
"http://www.mico-project.eu/ns/platform/1.0/schema#": "mico",
"http://www.mit.jyu.fi/ai/TRUST_Ontologies/QA.owl#": "qa",
"http://www.mobile.com/model/": "my",
"http://www.morelab.deusto.es/ontologies/swrcfe#": "swrcfe",
"http://www.music-encoding.org/ns/mei/": "mei",
"http://www.mygrid.org.uk/mygrid-moby-service#": "moby",
"http://www.mygrid.org.uk/ontology#": "mygrid",
"http://www.mygrid.org.uk/ontology/JERMOntology#": "jerm",
"http://www.nanopub.org/nschema#": "np",
"http://www.neclimateus.org/": "nxs",
"http://www.newmedialab.at/fcp/": "fcp",
"http://www.nexml.org/2009/": "nex",
"http://www.oegov.org/core/owl/cc#": "oecc",
"http://www.oegov.org/core/owl/gc#": "gc",
"http://www.ogbd.fr/2012/ontologie#": "ogbd",
"http://www.omg.org/spec/FIGI/GlobalInstrumentIdentifiers/": "figigii",
"http://www.onto-med.de/ontologies/gfo.owl#": "gfo",
"http://www.ontologydesignpatterns.org/cp/owl/componency.owl#": "cmp",
"http://www.ontologydesignpatterns.org/cp/owl/informationobjectsandrepresentationlanguages.owl#": "irrl",
"http://www.ontologydesignpatterns.org/cp/owl/informationrealization.owl#": "infor",
"http://www.ontologydesignpatterns.org/cp/owl/informationrealization.owl#": "ir",
"http://www.ontologydesignpatterns.org/cp/owl/participation.owl#": "odpart",
"http://www.ontologydesignpatterns.org/cp/owl/sequence.owl#": "seq",
"http://www.ontologydesignpatterns.org/cp/owl/situation.owl#": "sit",
"http://www.ontologydesignpatterns.org/cp/owl/situation.owl#": "situ",
"http://www.ontologydesignpatterns.org/cp/owl/timeindexedsituation.owl#": "tis",
"http://www.ontologydesignpatterns.org/cp/owl/timeinterval.owl#": "ti",
"http://www.ontologydesignpatterns.org/cpont/ire.owl#": "ire",
"http://www.ontologydesignpatterns.org/ont/dul/IOLite.owl#": "iol",
"http://www.ontologydesignpatterns.org/ont/dul/ontopic.owl#": "ontopic",
"http://www.ontologydesignpatterns.org/ont/lmm/LMM_L1.owl#": "lmm1",
"http://www.ontologydesignpatterns.org/ont/lmm/LMM_L2.owl#": "lmm2",
"http://www.ontologydesignpatterns.org/ont/web/irw.owl#": "irw",
"http://www.ontologydesignpatterns.org/schemas/cpannotationschema.owl#": "cpa",
"http://www.ontologyportal.org/WordNet.owl#": "opwn",
"http://www.ontotext.com/": "onto",
"http://www.ontotext.com/proton/protonext#": "pext",
"http://www.ontotext.com/proton/protonkm#": "pkm",
"http://www.ontotext.com/proton/protonsys#": "psys",
"http://www.ontotext.com/proton/protontop#": "ptop",
"http://www.ontotext.com/trree/owlim#": "owlim",
"http://www.openannotation.org/ns/": "oac",
"http://www.openarchives.org/OAI/2.0/": "defns",
"http://www.openarchives.org/OAI/2.0/friends/": "friends",
"http://www.openarchives.org/ore/terms/": "ore",
"http://www.opengis.net/def/function/geosparql/": "geof",
"http://www.opengis.net/kml/2.2#": "kml",
"http://www.opengis.net/ont/geosparql#": "geosparql",
"http://www.opengis.net/ont/geosparql#": "gsp",
"http://www.opengis.net/ont/gml#": "gml",
"http://www.opengis.net/ont/sf#": "sf",
"http://www.openk.org/wscaim.owl#": "wsc",
"http://www.openk.org/wscaim.owl#": "wscaim",
"http://www.openlinksw.com/campsites/schema#": "campsite",
"http://www.openlinksw.com/ontology/acl#": "oplacl",
"http://www.openlinksw.com/ontology/ecrm#": "oplecrm",
"http://www.openlinksw.com/ontology/faq#": "faq",
"http://www.openlinksw.com/ontology/licenses#": "opllic",
"http://www.openlinksw.com/ontology/market#": "oplmkt",
"http://www.openlinksw.com/ontology/odbc#": "odbc",
"http://www.openlinksw.com/ontology/products#": "oplprod",
"http://www.openlinksw.com/ontology/restrictions#": "oplres",
"http://www.openlinksw.com/ontology/webservices#": "webservice",
"http://www.openlinksw.com/schema/sparql/extensions#": "bif",
"http://www.openlinksw.com/schemas/cert#": "oplcert",
"http://www.openlinksw.com/schemas/crunchbase#": "oplcb",
"http://www.openlinksw.com/schemas/virtrdf#": "openlinks",
"http://www.openlinksw.com/ski_resorts/schema#": "skiresort",
"http://www.openlinksw.com/virtrdf-data-formats#": "rdfdf",
"http://www.openmobilealliance.org/tech/profiles/UAPROF/ccppschema-20021212#": "prf",
"http://www.openrdf.org/config/repository#": "rep",
"http://www.openrdf.org/config/repository/sail#": "sr",
"http://www.openrdf.org/config/sail#": "sail",
"http://www.openrdf.org/config/sail/custom#": "custom",
"http://www.openrdf.org/config/sail/federation#": "fed",
"http://www.openrdf.org/rdf/2009/metadata#": "meta",
"http://www.openrdf.org/rdf/2009/object#": "obj",
"http://www.openrdf.org/schema/sesame#": "sesame",
"http://www.opmw.org/ontology/": "opmw",
"http://www.ordnancesurvey.co.uk/ontology/AdministrativeGeography/v2.0/AdministrativeGeography.rdf#": "osag",
"http://www.ordnancesurvey.co.uk/ontology/Datatypes.owl#": "osukdt",
"http://www.ordnancesurvey.co.uk/ontology/SpatialRelations/v0.2/SpatialRelations.owl#": "onssprel",
"http://www.ordnancesurvey.co.uk/ontology/Topography/v0.1/Topography.owl#": "ostop",
"http://www.owl-ontologies.com/generations.owl#": "genea",
"http://www.padinthecity.com/": "ipad",
"http://www.productontology.org/id/": "pto",
"http://www.proteinontology.info/po.owl#": "prot",
"http://www.provbook.org/ns/#": "bk",
"http://www.purl.org/limo-ontology/limo#": "limo",
"http://www.purl.org/net/remetca#": "remetca",
"http://www.purl.org/ontologia/eseduc#": "eseduc",
"http://www.rdaregistry.info/": "rda",
"http://www.rdfabout.com/rdf/schema/politico/": "politico",
"http://www.rdfabout.com/rdf/schema/usbill/": "bill",
"http://www.rdfabout.com/rdf/schema/usfec/": "fec",
"http://www.rdfabout.com/rdf/schema/usgovt/": "usgov",
"http://www.rdfabout.com/rdf/schema/vote/": "vote",
"http://www.rdfabout.com/rdf/usgov/geo/us/": "govtrackus",
"http://www.researchspace.org/ontology/": "rso",
"http://www.rkbexplorer.com/ontologies/acm#": "acm",
"http://www.rkbexplorer.com/ontologies/coref#": "coref",
"http://www.rkbexplorer.com/ontologies/resist#": "resist",
"http://www.s3db.org/core#": "s3db",
"http://www.samos.gr/ontologies/helpdeskOnto.owl#": "hdo",
"http://www.semanlink.net/2001/00/semanlink-schema#": "sl",
"http://www.semanticdesktop.org/ontologies/2007/01/19/nie#": "nie",
"http://www.semanticdesktop.org/ontologies/2007/03/22/nco#": "nco",
"http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#": "nfo",
"http://www.semanticdesktop.org/ontologies/2007/03/22/nmo#": "nmo",
"http://www.semanticdesktop.org/ontologies/2007/04/02/ncal#": "ncal",
"http://www.semanticdesktop.org/ontologies/2007/05/10/nexif#": "nexif",
"http://www.semanticdesktop.org/ontologies/2007/05/10/nid3#": "nid3",
"http://www.semanticdesktop.org/ontologies/2007/08/15/nao#": "nao",
"http://www.semanticdesktop.org/ontologies/2007/08/15/nrl#": "nrl",
"http://www.semanticdesktop.org/ontologies/2007/11/01/pimo#": "pimo",
"http://www.semanticdesktop.org/ontologies/2008/05/20/tmo#": "tmo",
"http://www.semanticweb.org/asow/ontologies/2013/9/untitled-ontology-36#": "mocanal",
"http://www.semanticweb.org/ontologies/2008/11/OntologySecurity.owl#": "ontosec",
"http://www.semanticweb.org/ontologies/2010/6/Ontology1279614123500.owl#": "remus",
"http://www.semanticweb.org/ontologies/cheminf.owl#": "cheminf",
"http://www.semanticweb.org/parthasb/ontologies/2014/6/vacseen1/": "vacseen1",
"http://www.sensormeasurement.appspot.com/ont/transport/traffic#": "traffic",
"http://www.smileyontology.com/ns#": "smiley",
"http://www.systemone.at/2006/03/wikipedia#": "wikipedia",
"http://www.tei-c.org/ns/1.0/": "tei",
"http://www.telegraphis.net/ontology/geography/geography#": "geos",
"http://www.telegraphis.net/ontology/measurement/measurement#": "msr",
"http://www.telegraphis.net/ontology/measurement/quantity#": "quty",
"http://www.thomsonreuters.com/": "tr",
"http://www.tvblob.com/ratings/#": "rating",
"http://www.w3.org/1999/02/22-rdf-syntax-ns#": "rdf",
"http://www.w3.org/1999/xhtml#": "xhtml",
"http://www.w3.org/1999/xhtml/vocab#": "xhv",
"http://www.w3.org/1999/xhtml/vocab/": "xhtmlvocab",
"http://www.w3.org/1999/xlink/": "xlink",
"http://www.w3.org/1999/XSL/Transform#": "xsl",
"http://www.w3.org/2000/01/rdf-schema#": "rdfs",
"http://www.w3.org/2000/10/annotation-ns#": "ann",
"http://www.w3.org/2000/10/swap/crypto#": "crypto",
"http://www.w3.org/2000/10/swap/grammar/bnf#": "bnf",
"http://www.w3.org/2000/10/swap/list#": "list",
"http://www.w3.org/2000/10/swap/log#": "log",
"http://www.w3.org/2000/10/swap/math#": "math",
"http://www.w3.org/2000/10/swap/os#": "os",
"http://www.w3.org/2000/10/swap/pim/contact#": "con",
"http://www.w3.org/2000/10/swap/pim/contact#": "contact",
"http://www.w3.org/2000/10/swap/pim/contact#": "w3con",
"http://www.w3.org/2000/10/swap/pim/doc#": "doc",
"http://www.w3.org/2000/10/swap/reason#": "re",
"http://www.w3.org/2000/10/swap/set#": "set",
"http://www.w3.org/2000/10/swap/string#": "string",
"http://www.w3.org/2001/02pd/rec54.rdf#": "rec54",
"http://www.w3.org/2001/04/xmlenc#": "enc",
"http://www.w3.org/2001/sw/DataAccess/tests/test-dawg#": "dawgt",
"http://www.w3.org/2001/sw/DataAccess/tests/test-manifest#": "mf",
"http://www.w3.org/2001/sw/DataAccess/tests/test-manifest#": "mt",
"http://www.w3.org/2001/sw/hcls/ns/transmed/": "transmed",
"http://www.w3.org/2001/xml-events/": "ev",
"http://www.w3.org/2001/XMLSchema#": "xds",
"http://www.w3.org/2001/XMLSchema#": "xmls",
"http://www.w3.org/2001/XMLSchema#": "xs",
"http://www.w3.org/2001/XMLSchema#": "xsd",
"http://www.w3.org/2001/XMLSchema-instance#": "xsi",
"http://www.w3.org/2002/01/bookmark#": "bookmark",
"http://www.w3.org/2002/01/p3prdfv1#": "p3p",
"http://www.w3.org/2002/07/owl#": "owl",
"http://www.w3.org/2002/12/cal/ical#": "cal",
"http://www.w3.org/2002/12/cal/ical#": "ical",
"http://www.w3.org/2002/12/cal/icaltzd#": "icaltzd",
"http://www.w3.org/2002/xforms/": "xf",
"http://www.w3.org/2002/xforms/": "xforms",
"http://www.w3.org/2003/01/geo/wgs84_pos#": "geo",
"http://www.w3.org/2003/01/geo/wgs84_pos#": "pos",
"http://www.w3.org/2003/01/geo/wgs84_pos#": "wgs",
"http://www.w3.org/2003/01/geo/wgs84_pos#": "wgs84",
"http://www.w3.org/2003/01/geo/wgs84_pos#": "wgspos",
"http://www.w3.org/2003/05/soap-envelope/": "soap",
"http://www.w3.org/2003/06/sw-vocab-status/ns#": "vs",
"http://www.w3.org/2003/11/swrl#": "swrl",
"http://www.w3.org/2003/11/swrlb#": "swrlb",
"http://www.w3.org/2003/12/exif/ns#": "exif",
"http://www.w3.org/2003/g/data-view#": "grddl",
"http://www.w3.org/2004/02/image-regions#": "imreg",
"http://www.w3.org/2004/02/skos/core#": "skos",
"http://www.w3.org/2004/03/trix/rdfg-1/": "rdfg",
"http://www.w3.org/2004/03/trix/rdfg-1/": "trig",
"http://www.w3.org/2004/03/trix/swp-2/": "swp",
"http://www.w3.org/2004/06/rei#": "rei",
"http://www.w3.org/2004/09/fresnel#": "fresnel",
"http://www.w3.org/2004/delta#": "delta",
"http://www.w3.org/2004/ql#": "ql",
"http://www.w3.org/2005/01/wai-rdf/GUIRoleTaxonomy#": "wairole",
"http://www.w3.org/2005/01/wf/flow#": "flow",
"http://www.w3.org/2005/01/wf/flow#": "wf",
"http://www.w3.org/2005/07/aaa#": "states",
"http://www.w3.org/2005/11/its/rdf#": "itsrdf",
"http://www.w3.org/2005/Atom/": "atom",
"http://www.w3.org/2005/sparql-results#": "res",
"http://www.w3.org/2005/xpath-functions#": "fn",
"http://www.w3.org/2006/03/wn/wn20/": "wn20",
"http://www.w3.org/2006/03/wn/wn20/schema/": "wn20schema",
"http://www.w3.org/2006/gen/ont#": "gen",
"http://www.w3.org/2006/gen/ont#": "gso",
"http://www.w3.org/2006/http#": "httpvoc",
"http://www.w3.org/2006/link#": "link",
"http://www.w3.org/2006/time#": "time",
"http://www.w3.org/2006/time-entry#": "te",
"http://www.w3.org/2006/timezone#": "tzont",
"http://www.w3.org/2006/vcard/ns#": "vcard",
"http://www.w3.org/2006/vcard/ns#": "vcard2006",
"http://www.w3.org/2007/05/powder#": "powder",
"http://www.w3.org/2007/05/powder#": "wdr",
"http://www.w3.org/2007/05/powder-s#": "wdrs",
"http://www.w3.org/2007/ont/httph#": "httph",
"http://www.w3.org/2007/ont/unit#": "un",
"http://www.w3.org/2007/rif#": "rif",
"http://www.w3.org/2007/rif-builtin-action#": "act",
"http://www.w3.org/2007/rif-builtin-function#": "func",
"http://www.w3.org/2007/uwa/context/common.owl#": "common",
"http://www.w3.org/2007/uwa/context/deliverycontext.owl#": "dcn",
"http://www.w3.org/2007/uwa/context/hardware.owl#": "hard",
"http://www.w3.org/2007/uwa/context/java.owl#": "java",
"http://www.w3.org/2007/uwa/context/location.owl#": "loc",
"http://www.w3.org/2007/uwa/context/network.owl#": "net",
"http://www.w3.org/2007/uwa/context/push.owl#": "push",
"http://www.w3.org/2007/uwa/context/software.owl#": "soft",
"http://www.w3.org/2007/uwa/context/web.owl#": "web",
"http://www.w3.org/2008/05/skos#": "skos08",
"http://www.w3.org/2008/05/skos-xl#": "skosxl",
"http://www.w3.org/2008/turtle#": "ttl",
"http://www.w3.org/2009/pointers#": "ptr",
"http://www.w3.org/2011/content#": "cnt",
"http://www.w3.org/2011/http#": "htir",
"http://www.w3.org/2011/http#": "http",
"http://www.w3.org/2011/http-methods#": "httpm",
"http://www.w3.org/2013/ShEx/ns#": "shex",
"http://www.w3.org/ns/activitystreams#": "as",
"http://www.w3.org/ns/adms#": "adms",
"http://www.w3.org/ns/auth/acl#": "acl",
"http://www.w3.org/ns/auth/cert#": "cert",
"http://www.w3.org/ns/auth/rsa#": "rsa",
"http://www.w3.org/ns/dcat#": "dcat",
"http://www.w3.org/ns/earl#": "earl",
"http://www.w3.org/ns/formats/": "formats",
"http://www.w3.org/ns/hydra/core#": "hydra",
"http://www.w3.org/ns/ldp#": "ldp",
"http://www.w3.org/ns/locn#": "locn",
"http://www.w3.org/ns/ma-ont#": "ma",
"http://www.w3.org/ns/md#": "md",
"http://www.w3.org/ns/oa#": "oa",
"http://www.w3.org/ns/odrl/2/": "odrl",
"http://www.w3.org/ns/openannotation/extensions/": "oax",
"http://www.w3.org/ns/org#": "org",
"http://www.w3.org/ns/people#": "gldp",
"http://www.w3.org/ns/person#": "person",
"http://www.w3.org/ns/pim/space#": "pim",
"http://www.w3.org/ns/prov#": "prov",
"http://www.w3.org/ns/r2rml#": "r2rml",
"http://www.w3.org/ns/r2rml#": "rr",
"http://www.w3.org/ns/rad#": "rad",
"http://www.w3.org/ns/radion#": "radion",
"http://www.w3.org/ns/rdfa#": "rdfa",
"http://www.w3.org/ns/regorg#": "rov",
"http://www.w3.org/ns/sawsdl#": "sawsdl",
"http://www.w3.org/ns/shacl#": "sh",
"http://www.w3.org/ns/sparql-service-description#": "sd",
"http://www.w3.org/ns/ui#": "ui",
"http://www.w3.org/opengov#": "opengov",
"http://www.w3.org/People/Berners-Lee/card#": "tblcard",
"http://www.w3.org/TR/2003/PR-owl-guide-20031209/food#": "fowl",
"http://www.w3.org/TR/2003/PR-owl-guide-20031209/wine#": "vin",
"http://www.w3.org/TR/owl-time#": "owltime",
"http://www.w3.org/TR/SVG/": "sgv",
"http://www.w3.org/XML/1998/namespace/": "lmx",
"http://www.w3.org/XML/1998/namespace/": "xml",
"http://www.who.int/vocab/ontology#": "who",
"http://www.wikidata.org/entity/": "wd",
"http://www.wikidata.org/entity/": "wikidata",
"http://www.wiwiss.fu-berlin.de/suhl/bizer/D2RQ/0.1#": "d2rq",
"http://www.wordnet.dk/owl/instance/2009/03/instances/": "dannet",
"http://www.wsmo.org/ns/wsmo-lite#": "wl",
"http://www.wsmo.org/ns/wsmo-lite#": "wsl",
"http://www.xbrl.org/2003/instance#": "xbrli",
"http://www4.wiwiss.fu-berlin.de/bizer/bsbm/v01/vocabulary/": "bsbm",
"http://www4.wiwiss.fu-berlin.de/bizer/r2r/": "r2r",
"http://www4.wiwiss.fu-berlin.de/cordis/resource/cordis/": "cordis",
"http://www4.wiwiss.fu-berlin.de/dailymed/resource/dailymed/": "dailymed",
"http://www4.wiwiss.fu-berlin.de/diseasome/resource/diseasome/": "diseasome",
"http://www4.wiwiss.fu-berlin.de/drugbank/resource/drugbank/": "drugbank",
"http://www4.wiwiss.fu-berlin.de/sider/resource/sider/": "sider",
"http://wwwiti.cs.uni-magdeburg.de/~srahman/": "saif",
"http://xlime-project.org/vocab/": "xlime",
"http://xmlns.com/aerols/0.1/": "aerols",
"http://xmlns.com/foaf/0.1/": "foaf",
"http://xmlns.com/wordnet/1.6/": "wn",
"http://xmlns.com/wot/0.1/": "wot",
"http://xmlns.notu.be/aair#": "aair",
"http://xxefe.de/": "erce",
"http://yago-knowledge.org/resource/": "yago",
"http://yovisto.com/": "yo",
"http://zbw.eu/beta/p20/vocab/": "p20",
"http://zbw.eu/namespaces/zbw-extensions/": "zbwext",
"http://zeitkunst.org/bibtex/0.1/bibtex.owl#": "bib",
"https://decision-ontology.googlecode.com/svn/trunk/decision.owl#": "decision",
"https://ns.eccenca.com/": "ecc",
"https://onlinesocialmeasures.wordpress.com/": "owsom",
"https://project-open-data.cio.gov/v1.1/schema/#": "pod",
"https://raw.githubusercontent.com/airs-linked-data/lov/latest/src/airs_vocabulary.ttl#": "airs",
"https://vg.no/": "namespaces",
"https://vocab.eccenca.com/revision/": "eccrev",
"https://w3id.org/cc#": "curr",
"https://w3id.org/legal_form#": "lfov",
"https://w3id.org/navigation_menu#": "navm",
"https://w3id.org/payswarm#": "ps",
"https://w3id.org/security#": "sec",};



function retrievePrefixes(){

	var request = $.ajax({
		type: 'GET',
		dataType: 'jsonp',
		//data: { "q": "" },
		url: "http://linda.epu.ntua.gr:8000/api/vocabularies/versions/",
	});

	request.fail(function (jqXHR, textStatus, errorThrown) {
			console.log("Prefixes: AJAX call to 'http://linda.epu.ntua.gr:8000/api/vocabularies/versions/' failed.");
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		}
	);

	request.success(function (data) {
		if(data.length===0){
				console.log("Prefixes: AJAX call to 'http://linda.epu.ntua.gr:8000/api/vocabularies/versions/' returned en empty set of uris and prefixes.");
				//return;
			}
			lindaGlobals.prefixes = {};
			//recent_text.innerHTML = "please choose from list";
			for(var i = 0; i < data.length; i++){
				lindaGlobals.prefixes[data.prefix] = data.uri;
				console.log(lindaGlobals.prefixes[data.prefix]);
			}

	});

	//return request;
}

retrievePrefixes();

*/



// used for blank nodes
function toLetters(num) {
	"use strict";
	var mod = num % 26,
			pow = num / 26 | 0,
			out = mod ? String.fromCharCode(64 + mod) : (--pow, 'Z');
	return pow ? toLetters(pow) + out : out;
}


function create_subjects_from_model_skeleton(model) {
	var skeleton = "";
	var base_url = "";

	if(model['subject']){
		skeleton = model['subject']['skeleton'];//(model['subject']['skeleton']) ? model['subject']['skeleton'] : "";
		base_url = model['subject']['base_url'];//(model['subject']['base_url']) ? model['subject']['base_url'] : "";;
	}

	if((!skeleton && !base_url) || !model){
		console.log("no subjects could be created");
		skeleton = "?subject?"
	}

	var subjects_array = [];
	$.each(model['columns'], function(i, col){
		if(col['col_num_new'] >- 1){ // column was chosen, same as show==true
			var col_name = col['header']['orig_val'];
			$.each(col['fields'], function(j, elem){
				if(model && model['subject']['blank_nodes'] == "true"){
						subjects_array[j] = "_:"+toLetters(j+1);
				}else{
					if(subjects_array[j] == undefined){
						subjects_array[j] = "<" + base_url.trim() + skeleton.trim() + ">";
					}
					subjects_array[j] = subjects_array[j].replace(new RegExp("{"+col_name.trim()+"}","g"), elem['orig_val'].trim()).trim();
				}
			});
		}
	});
	
	lindaGlobals.validURL = true;
	var testURL = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;
	subjects_array.forEach(function(entry) {
		var result = entry
		if ((entry.charAt(0) == '<') && (entry.charAt(entry.length - 1) == '>')) {
			result = entry.substring(1, entry.length - 1);
		}
		lindaGlobals.validURL = lindaGlobals.validURL && testURL.test(result);
		//console.log(result);
		//console.log(lindaGlobals.validURL);
	});
	return subjects_array;
}



function create_predicates_from_model(model) {
	var predicates_array = [];
	$.each(model['columns'], function(row){
		if($(this)[0]['col_num_new'] >- 1){ // column was chosen, same as show==true
			if(typeof $(this)[0]['predicate'] == 'undefined')
				$(this)[0]['predicate'] = "";
			var url = $(this)[0]['predicate']['url'];
			var replaced_prefix = $(this)[0]['predicate']['prefix'];//replacePrefix(url);
			predicates_array.push(replaced_prefix);
		}
	});
	return predicates_array;
}


function create_objects_from_model(model) {
	var objects_array = [];
	$.each(model['columns'], function(row){
		if($(this)[0]['col_num_new'] >- 1){ // column was chosen, same as show==true
			var col_name = $(this)[0]['header']['orig_val'];
			$.each($(this)[0]['fields'], function(elem){
				objects_array.push(elem['orig_val']);
			});
		}
	});
	return objects_array;
}


function create_multidim_array(x, y) {
	var f = [];
	for (i = 0; i < x; i++) {
		f[i] = [];
		for (j = 0; j < y; j++)
			f[i][j] = 0;
	}
	return f;
}


//returns sth like 
//'http.someurl.org/first_name'  -->  ['http.someurl.org/', 'first_name', 'some']
function replacePrefix(uri){
	var result = {'url': uri, 'suffix':"", 'prefix':""};
	$.each(lindaGlobals.prefixes, function(key, value){	
		if(uri && uri.indexOf(key) == 0 && uri.replace(key, "").indexOf("#")==-1 && uri.replace(key, "").indexOf("/")==-1){
			result['suffix'] = uri.replace(key, "");
			result['prefix'] = value;
			result['url'] = key;
			return;			
		}
	});
	return result;
};


function shortenURI(uri, maxlength){
	if(uri.length <= maxlength)
		return uri;

	maxlength = maxlength -3; //because we include "..."

	var parts = uri.split("/");
	var head = parts[0];
	var tail = "";
	for(var i = 1; i <= (parts.length/2); i++){
		if((head.length + tail.length+parts[i].length + 1) >= maxlength)
			return head + "..." + tail;
		else 
			head += parts[i] + "/";
		if((head.length + tail.length + parts[parts.length-i] + 1)>=maxlength)
			return head + "..." + tail;
		else
			tail = "/" + parts[parts.length-i] + tail;
	}	
}

jQuery.fn.extend({
insertAtCaret: function(myValue){
  return this.each(function(i) {
	if (document.selection) {
	  //For browsers like Internet Explorer
	  this.focus();
	  var sel = document.selection.createRange();
	  sel.text = myValue;
	  this.focus();
	}
	else if (this.selectionStart || this.selectionStart == '0') {
	  //For browsers like Firefox and Webkit based
	  var startPos = this.selectionStart;
	  var endPos = this.selectionEnd;
	  var scrollTop = this.scrollTop;
	  this.value = this.value.substring(0, startPos)+myValue+this.value.substring(endPos,this.value.length);
	  this.focus();
	  this.selectionStart = startPos + myValue.length;
	  this.selectionEnd = startPos + myValue.length;
	  this.scrollTop = scrollTop;
	} else {
	  this.value += myValue;
	  this.focus();
	}
  });
}
});

function transpose_matrix(matrix) {
  var w = matrix.length ? matrix.length : 0,
	h = matrix[0] instanceof Array ? matrix[0].length : 0;
  if(h === 0 || w === 0) { return []; }
  var i, j, k = [];
  for(i=0; i<h; i++) {
	k[i] = [];
	for(j=0; j<w; j++) {
	  k[i][j] = matrix[j][i];
	}
  }
  return k;
};



// ///////////////// MODEL ///////////////////////////////

function get_model(){
	return JSON.parse($("#id_hidden_model").val().replace(/'/g,"\""));
}

function get_num_selected_cols_model(){
	var nums = get_model()['num_cols_selected']; // take info from model if existing
	if(!nums){ // otherwise calculate
		var counter = 0;
		$.each(get_model()['columns'], function(){
			if($(this)[0]['col_num_new'] >- 1)
				counter++;
		});
		return counter;
	}
	return nums;
}

function write_model(m){
	$("#id_hidden_model").val(JSON.stringify(m));
}

//GENERIC
function add_model_field(fieldname, subj){
	var model = get_model();
	model[fieldname] = subj;
	write_model(model);
}

function add_model_subject(k, v){
	var model = get_model();
	if(!model['subject'])
		model['subject'] = {};
	model['subject'][k] = v;
	write_model(model);
}

//returns false if already exists
function add_model_enrich(e){
	var model = get_model();
	if(!model['enrich'])
		model['enrich'] = [];
	//avoid duplicates
	for(var i=0; i<model['enrich'].length; i++){
		if(model['enrich'][i].url==e.url){ 
			//console.log("enrich already exists");
			return false;
		}
	}

	model['enrich'].push(e);
	write_model(model);
	return true;
}

//removes enrich entry with specific url
//returns true if could be removed
function remove_model_enrich(url){
	var model = get_model();
	if(!model['enrich'])
		return false;
	for(var i=0; i<model['enrich'].length; i++){
		if(model['enrich'][i].url==url){ 
			model['enrich'].splice(i, 1);
			write_model(model);
			return true;
		}
	}
	return false;
}

function delete_model_enrich(){
	var model = get_model();
	if(model['enrich'])
		model['enrich'] = [];
	write_model(model);
}

function add_model_filename(subj){
	add_model_field("file_name", subj);
}

//GENERIC
function add_to_model_where_fieldname(new_key, new_value, field_name, field_property){
	var model = get_model();
	$.each(model['columns'], function(i, v1){
		$.each(v1['fields'], function(j, v2){
			if(v2[field_name]==field_property)
				v2[new_key] = new_value;
		});
	});
	write_model(model);
}

//GENERIC
function add_to_model_field_where_col_and_row(new_key, new_value, col, row){
	var model = get_model();
	$.each(model['columns'], function(i, v1){
		if(v1["col_num_new"]==col)
			$.each(v1['fields'], function(j, v2){
				if(v2['field_num']==row)
					v2[new_key] = new_value;
			});
	});
	write_model(model);
}

//GENERIC
function add_to_content_where_col(new_key, new_value, col){
	var model = get_model();
	$.each(model['columns'], function(i, v1){
		if(v1["col_num_new"]==col)
			v1[new_key] = new_value;
	});
	write_model(model);
}

//GENERIC
function add_to_model_header_where_col(new_key, new_value, col){
	var model = get_model();
	$.each(model['columns'], function(i, v1){
		if(v1["col_num_new"]==col)
			v1["header"][new_key] = new_value;
	});
	write_model(model);
}

//adds to content field in table
function add_to_model_content_field(new_key, new_value, field){
	add_to_model_where_fieldname(new_key, new_value, "orig_val", field);
}

function add_to_model_predicate(new_value, col){
	add_to_content_where_col("predicate", new_value, col);
}

function add_to_model_enrich(new_value, col){
	add_to_content_where_col("enrich", new_value, col);
}


// ///////////////// MODEL END ///////////////////////////////



$( document ).ready(function() {

	//$("div.content:not(#rdf_view):not(.no-minimize)").each(function(){
	$(".minimizable").each(function(){
		//$(this).css("position","relative");
		$(this).html($(this).html()+'<i class="fa fa-caret-square-o-down fa-2x content-resizer" style="position: absolute; top: 0.3em; right: 0.2em; color: rgb(136, 136, 136); opacity: 0.4;"></i>');
	});

	$("i.content-resizer").css("cursor", "pointer");
	$("i.content-resizer").each(function(){
		$(this).on("click", function(){
			$(this).parent().find("div div").slideToggle( "fast", "swing" );
			if($(this).hasClass("fa-caret-square-o-down")){
				
				/*
				$(this).parent().css("height", "4.3em");
				$(this).parent().css("overflow", "hidden");
				$(this).parent().scrollTop("0");*/
				$(this).removeClass("fa-caret-square-o-down");
				$(this).addClass("fa-caret-square-o-left");
			}else{				
				/*$(this).parent().css("height", "");
				$(this).parent().css("overflow", "");*/
				$(this).removeClass("fa-caret-square-o-left");
				$(this).addClass("fa-caret-square-o-down");
			}
		});
		$(this).on("mouseover", function(){
			$(this).css("opacity","1");
		});
		$(this).on("mouseoout", function(){
			$(this).css("opacity","0.4");
		});
	});
});

function model_to_table(model){

	var tbl = jQuery('<table/>', {
		class: "rdf_table"
	});//.appendTo(elem);

	if(model == undefined){
		console.log("model undefinded");
		return tbl;
	}

	var rdf_array = model_to_array(model);


	//create table content
	for(var i = 0; i < rdf_array.length; i++){

			var tr = jQuery('<tr/>', {});
			for(var j = 0; j < 3; j++){
				var td = jQuery('<td/>', {});
				td.text(rdf_array[i][j]);
				td.appendTo(tr);
			}
			var td = jQuery('<td/>', {});
			td.text(".");
			td.appendTo(tr);
			tr.appendTo(tbl);

	}

	return tbl;
}


function model_to_array(model){


	if(typeof model === "undefined" || !model['columns']){
		console.log("model undefinded");
		return;
	}

	var num_total_rows_rdf = 0;
	var num_total_cols = 0;

	//count
	$.each(model['columns'], function(){
		if($(this)[0]['col_num_new'] >- 1){ // column was chosen, same as show==true
			num_total_cols++;
			$.each($(this)[0]['fields'], function(){
				num_total_rows_rdf++;
			
			});
		}
	});

	var rdf_array = create_multidim_array(num_total_rows_rdf, 3);


	//insert subjects
	var subjects = create_subjects_from_model_skeleton(model);
	for(var i = 0; i < rdf_array.length; i++){
		var subj_index = Math.floor(i/num_total_cols);
		rdf_array[i][0] = subjects[subj_index];
	}

	//insert predicates
	lindaGlobals.used_prefixes = {};
	var predicates = create_predicates_from_model(model);
	for(var i = 0; i < rdf_array.length; i++){
		var pred_index = i % predicates.length;
		if(predicates[pred_index] && predicates[pred_index]['url']){ // uri exists (earlier sucessful ajax call)
			if(predicates[pred_index]['suffix'] && predicates[pred_index]['prefix']){ // prefix exists
				rdf_array[i][1] = predicates[pred_index]['prefix']+":"+predicates[pred_index]['suffix']; // prefixed url
				// TODO can be problem if keys are not unique 
				lindaGlobals.used_prefixes[predicates[pred_index]['prefix']] = predicates[pred_index];
			}else{
				rdf_array[i][1] = "<"+predicates[pred_index]['url']+predicates[pred_index]['suffix']+">"; // = original url	
			}
		}else{
			rdf_array[i][1] = "<?predicate?>" // no ajax call yet
		}
	}

	//insert objects
	var col_count = -1;
	$.each(model['columns'], function(i, row){
		if(row['col_num_new'] >- 1){ // column was chosen, same as show==true
			col_count++;
			var method = row['object_method'];
			$.each($(this)[0]['fields'], function(j, elem){
				var suffix = "";

				if(method === "data type" && row['data_type'] ){//reconciliation, no action, data type
					suffix = "^^"+row['data_type']['prefix']+":"+row['data_type']['suffix'];
					rdf_array[j*num_total_cols+col_count][2] = '"'+elem['orig_val']+'"'+suffix;
					lindaGlobals.used_prefixes[row['data_type']['prefix']] = row['data_type'];
				}
				if(method == "reconciliation" && elem['reconciliation']){//reconciliation, no action, data type
					rdf_array[j*num_total_cols+col_count][2] = elem['reconciliation']['prefix']['prefix']+":"+elem['reconciliation']['prefix']['suffix'];
					lindaGlobals.used_prefixes[elem['reconciliation']['prefix']] = elem['reconciliation']['prefix'];
				}else{
					rdf_array[j*num_total_cols+col_count][2] = '"'+elem['orig_val']+'"'+suffix;
				}
			});
		}
	});


	/*array.splice(index, 0, item);
	var num_total_rows_rdf = 0;
	var num_total_cols = 0;
*/


	//insert from enrichment
	if(model['enrich']){
		var inserted = 0;
		for(var i=num_total_cols; i<=(rdf_array.length-inserted); i+=num_total_cols){
			for(var j=0; j<model['enrich'].length; j++){
				var elem = model['enrich'][j];
				var object = "";
				if(elem['prefix']['prefix']){
					object = elem['prefix']['prefix']+":"+elem['prefix']['suffix'];
					lindaGlobals.used_prefixes[elem['prefix']['prefix']] = elem['prefix'];
				}
				else
					object = "<"+elem['url']+">";

				rdf_array.splice(i+inserted, 0, [rdf_array[i+inserted-1][0], "a", object]);
				inserted++;
			}
		}
	}

	//create table content: prefixes
	var prefix_array = []
	$.each(lindaGlobals.used_prefixes, function(i, prefix){
		
		var p = [];
		p[0]="@prefix";
		p[1]=prefix['prefix']+":";
		p[2]="<"+prefix['url']+">";
		prefix_array.push(p);
		
	});

	return prefix_array.concat(rdf_array);
}
